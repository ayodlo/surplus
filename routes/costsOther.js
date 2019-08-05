const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load CostsOther Model
require('../models/CostOther');
const CostOther = mongoose.model('costOther');
require('../models/User');
const User = mongoose.model('users')

// Process Form
router.post('/', (req, res) => {
    console.log(req.body)
    let errors = [];

    if (!req.body.costOther) {
        errors.push({ text: 'Please add a USD $ amount' });
    }
    if (errors.length > 0) {
        res.render('/', {
            errors: errors,
            costOther: req.body.costOther
        });
    } else {
        const newCostOther = {
            price: req.body.costOther,
            user: req.user.id
        }
        new CostOther(newCostOther)
            .save()
            .then(savedCost => {
                res.redirect('/');
            });
    }
});

router.post('/delete', (req, res) => {
    User.findOne({ _id: req.user.id })
        .then(user => {

            //Calculation to find current month
            const d = new Date();
            const m = d.getMonth();
            currentMonth = user.paidPerMonth.length - (12 - m);

            //Deleteing the correct property
            propertyToDelete = req.body.costsOtherName;
            newOtherCostsObject = user.yearlyNonReocurringCosts[currentMonth];
            delete newOtherCostsObject[propertyToDelete];
            newOtherCostsArray = user.yearlyNonReocurringCosts;
            newOtherCostsArray[currentMonth] = newOtherCostsObject;

            User.updateOne({ _id: req.user.id }, { yearlyNonReocurringCosts: newOtherCostsArray })
                .then(updatedUser => {
                    res.redirect('/');
                })
        })
})


module.exports = router;