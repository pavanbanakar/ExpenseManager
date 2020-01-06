const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {

    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');
        const token = await jwt.decode(authToken, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: token._id, 'tokens.token': authToken });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = authToken;
        next();
    }
    catch{
        res.status(401).send({ error: 'Please authenticate' });
    }

}

module.exports = auth;