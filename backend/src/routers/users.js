const express = require('express');
const User = require('../models/user');
const auth =  require('../middleware/auth');
const userRouter = new express.Router();
const multer = require('multer');
//const sharp = require('sharp');
const crypto =  require('crypto');
const async =  require('async');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

userRouter.post('/users/login',async (req,res) => {

    try{
        const user  =  await User.findUserByEmailAndPassword(req.body.email,req.body.password);
        const userObj = await user.toJSON();
        const token = await user.generateAuthToken();
        res.send({user:userObj,token});
    }
    catch(e){
        res.status(500).send(e);
    }
})

userRouter.post('/user/create', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const userObj = await user.toJSON();
        const token  = await user.generateAuthToken();
        res.status(201).send({user:userObj,token});
    }
    catch (err) {
        res.status(500);
        res.send(err);
        console.log(err);
    }
})

userRouter.post('/user/logout',auth,async (req,res) =>{
    try{

       const  user = req.user;
       user.tokens =  user.tokens.filter((token) => token.token != req.token);
        await user.save();
        res.send();
    }
    catch(err){
        res.status(500).send(err);
    }
})

userRouter.post('/user/logoutall',auth,async (req,res) =>{
    try{

       const  user = req.user;
       user.tokens = [];
        await user.save();
        res.send();
    }
    catch(err){
        res.status(500).send(err);
    }
})

userRouter.get('/users/profile',auth, async (req, res) => {
   var userDetails =  await req.user.toJSON()
    res.send(userDetails);
});


userRouter.get('/user/:id', async (req, res) => {

    try {
        var reqId = req.params.id
        const user = await User.findById(reqId)
        if (user)
            res.send(await user.toJSON());
        else {
            res.status(404);
            res.send("user not found!")
        }
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
});


userRouter.patch('/user/:id', async (req, res) => {
    try {

        const updates = Object.keys(req.body);

        const allowedUpdates = ["name", "age", "password", "email"];

        const isValidForUpdate = updates.every((update) => {
            return allowedUpdates.includes(update);
        })

        if (!isValidForUpdate)
            res.status(500).send({ error: 'Invalid Updates ' })
        var reqId = req.params.id

        const user = await User.findById(reqId);

        updates.every((update) => user[update] = req.body[update]);

         await user.save();

        if (user)
            res.send(user);
        else {
            res.status(404);
            res.send("user not found!")
        }
    }
    catch (e) {
        res.status(500);
        res.send(e);
    }
})

userRouter.delete('/user/:id', async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user)
            res.status(404).send({ error: "User not found!" })

        res.status(200).send("user deleted!")
    }
    catch (err) {
        res.status(500).send(err)
    }
})

userRouter.get('/users/avatar', auth, async (req,res) => {

    if(req.user.avatar){

       res.set('Content-Type','image/png');
        res.send(req.user.avatar);
    }
    
    res.send("user doesnt have a profile avatar");
});


const upload = multer({
    fileFilter(req,file,cb){
        
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an image'))
        }
        cb(undefined,true);
    }
})

userRouter.post('/user/profile/avatar', auth, upload.single('avatar') ,async (req,res) => {

    // const buffer = await sharp(req.file.buffer).resize({width:250 ,height :250}).png().toBuffer();
    // req.user.avatar = buffer;
    // await req.user.save();
    // res.send();

},(error,req,res,next) => {
    res.status(500).send({error : error.message })
});

userRouter.post('/user/forgotpassword', (req,res) => {

    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err,buf) => {
                var token  =  buf.toString('hex');
                console.log(token);
                done(err,token);
            })  
        },
        (token,done) => {
            User.findOne({email: req.body.email},(err,user) => {
                if(!user)
                return  res.status(500).send({error : `user with email address - ${req.body.email} doesnt exists, please register!` });

                console.log('updating user reset password token');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err,token,user);
                });
           })
        },
        async (token,user,done) =>{
            console.log('updating user reset password token');
            
           
            const msg = {
                to: user.email,
                from: 'test@example.com',
                subject: 'Sending with Twilio SendGrid is Fun',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
              };
             await sgMail.send(msg,false,(err,result) => {
                 if(err)
                 {
                     console.log(...err);
                    done(err,'done');
                 }
                 console.log(result);
                 res.status(200).send({message:"email has been sent with instructions"});
              });
             
        }

    ],(err) => {
      if(err)
        res.status(500).send({error : err.message })
    })
})





module.exports = userRouter;