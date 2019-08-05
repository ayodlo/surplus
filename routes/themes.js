const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Models
require('../models/User');
const User = mongoose.model('users');


router.post('/', (req, res) => {
    User.findOne({ _id: req.user.id })
        .then(user => {
            User.updateOne({ _id: req.user.id }, { theme: req.body.theme })
                .then(updatedUser => {
                    res.redirect('/');
                })
        })
})

module.exports = router;