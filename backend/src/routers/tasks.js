const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
var taskRouter = new express.Router();


//CREATE
taskRouter.post('/tasks', auth, async (req, res) => {
    try {
        var task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await task.save();
        res.send(task);
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
})


//READ ALL TASKS
taskRouter.get('/tasks', auth, async (req, res) => {

    const match = {};

    if(req.query.completed){
        match.completed = req.query.completed ==="true";
    }
    try {
        const user = await req.user.populate(
            {
                path: 'tasks',
                match,
                options:{
                    limit:parseInt(req.query.limit),
                    skip:parseInt(req.query.skip)
                }
            }).
            execPopulate();
        //await Task.find({owner:req.user._id});
        res.send(user.tasks);
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
});

//GET A TASK
taskRouter.get('/task/:id', auth, async (req, res) => {

    try {
        var reqId = req.params.id
        const task = await Task.findOne({ _id: reqId, owner: req.user._id });
        if (task)
            res.send(task);
        else {
            res.status(404);
            res.send("task not found!")
        }
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
});

//UPDATE TASK
taskRouter.patch('/task/:id', auth, async (req, res) => {
    try {

        const updates = Object.keys(req.body);

        const allowedUpdates = ["description", "completed"];

        const isValidForUpdate = updates.every((update) => {
            return allowedUpdates.includes(update);
        })

        if (!isValidForUpdate)
            res.status(500).send({ error: 'Invalid Updates ' })
        var reqId = req.params.id

        const task = await Task.findOne({ _id: reqId, owner: req.user._id });


        if (task) {
            updates.every((update) => task[update] = req.body[update]);
            await task.save();
            res.send(task);
        }
        else {
            res.status(404);
            res.send("task not found!")
        }
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
})


//DELETE
taskRouter.delete('/task/:id', auth, async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task)
            res.status(404).send({ error: "Task not found!" })

        res.status(200).send("task deleted!")
    }
    catch (err) {
        res.status(500).send(err)
    }
})

module.exports = taskRouter;