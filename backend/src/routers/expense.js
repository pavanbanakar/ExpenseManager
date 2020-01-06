const express = require('express');
const Expense = require('../models/expense');
const auth = require('../middleware/auth');

var expenseRouter = express.Router();

expenseRouter.post('/expense', auth, async (req, res) => {

    try {
        var expense = new Expense({
            ...req.body,
            'owner': req.user._id
        });
        await expense.save();
        res.send(expense);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('An error occured when saving an expense');
    }
})


//Gets all expenses for a user sort desc in the order of creation
expenseRouter.get('/expenses', auth, async (req, res) => {
    try {

        let filter = req.body.filter ? req.body.filter : {};

        let today  =  new Date();
        if(filter.startDate) 
            filter.startDate =  new Date(filter.startDate).setHours(0,0,0);
        else
        {
            filter.startDate =  new Date(today.getFullYear(),today.getMonth(),1);
        }

        if(filter.endDate)
            filter.endDate =  new DataCue(filter.endDate).setHours(23,59,59);
        else
        {
            filter.endDate =  new Date(today.getFullYear(),today.getMonth()+1,1);
        }

     let matchObj = {};
     if(filter.text)
     {
      
        matchObj.$or = [
            {
                title : { "$regex": filter.text,"$options":'i' }
            },
            {
                description : { "$regex": filter.text,"$options":'i' }
            }
        ]
      }
     
      matchObj.date = {$gte: filter.startDate, $lte: filter.endDate} ;
            
        const user = await req.user.populate({
            path: 'expenses',
            match: {...matchObj},
            options: {
                sort: { createdAt: -1 }
            }
        }).execPopulate();

        res.send(user.expenses)
    }
    catch (err) {
        console.log(err);
        res.status(500).send('An error occured when fetching expenses');
    }
})

//Find expense by id
expenseRouter.get('/expense/:id', auth, async (req, res) => {
    try {
        console.log(req.params.id);
        var expense = await Expense.findOne({ _id: req.params.id, owner: req.user._id });
        if (expense)
            res.send(expense);
        else {
            res.status(404);
            res.send("expense not found!")
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('An error occured when fetching expense');
    }
});


//Update and expense
expenseRouter.patch('/expense/:id', auth, async (req, res) => {
    try {

        const updates = Object.keys(req.body);

        const allowedUpdates = ["description", "date", "title", "amount"];

        const isValidForUpdate = updates.every((update) => {
            return allowedUpdates.includes(update);
        });

        if (!isValidForUpdate)
            res.status(500).send({ error: 'Invalid Updates ' })

        var reqId = req.params.id

        const expense = await Expense.findOne({ _id: reqId, owner: req.user._id });

        if (expense) {
            updates.every((update) => expense[update] = req.body[update]);
            await expense.save();
            res.send(expense);
        }
        else {
            res.status(404);
            res.send("expense not found!")
        }


    }
    catch (err) {
        console.log(err);
        res.status(500).send('An error occured when updating the expense');
    }
});


expenseRouter.delete('/expense/:id', auth, async (req, res) => {
    try {

        var expense = await Expense.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });

        console.log(expense);
        res.status(200).send("expense deleted!")
    }
    catch (err) {
        console.log(err);
        res.status(500).send('An error occured when deleting the expense');
    }
})


module.exports = expenseRouter;