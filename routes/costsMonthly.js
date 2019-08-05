const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Models
require('../models/User');
const User = mongoose.model('users');

router.post('/delete', (req, res) => {
    User.findOne({ _id: req.user.id })
        .then(user => {
            propertyToDelete = req.body.costsMonthlyIndex;
            oldMonthlyCosts = user.yearlyCosts;
            newMonthlyCosts = oldMonthlyCosts.map(obj => {
                delete obj[propertyToDelete];
                return obj;
            })
            User.updateOne({ _id: req.user.id }, { yearlyCosts: newMonthlyCosts })
                .then(updatedUser => {
                    res.redirect('/');
                })
        })
})

module.exports = router;