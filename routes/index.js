const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Models
require('../models/User');
const User = mongoose.model('users');

// Process Form
router.get('/', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.user.id })
        .then(user => {
            if (user.initialized == false) {
                res.redirect('/initialize');
            } else {
                //Set user theme
                res.locals.theme = user.theme;

                //Calculation to find current month
                const d = new Date();
                const m = d.getMonth();
                currentMonth = user.paidPerMonth.length - (12 - m);

                //Calculation to add up current months reocurring costs
                currentMonthlyCosts = 0;
                const currentObject = user.yearlyCosts[currentMonth];
                for (let prop in currentObject) {
                    currentMonthlyCosts += (currentObject[prop] * 1);
                }

                //Calculation to add up current months nonreocurring costs
                currentNonreocurringMonthlyCosts = 0;
                const currentObject2 = user.yearlyNonReocurringCosts[currentMonth];
                for (let prop in currentObject2) {
                    currentNonreocurringMonthlyCosts += (currentObject2[prop] * 1);
                }

                //Calculation to tell us what the surplus is
                surplus = user.paidPerMonth[currentMonth] - currentNonreocurringMonthlyCosts - currentMonthlyCosts;
                surplus = surplus.toFixed(2);

                //Send the calculated surplus and current month
                res.render('index', {
                    surplus: surplus,
                    month: m + 1,
                    monthsCosts: currentObject,
                    otherCosts: currentObject2
                });
            }
        });
});

router.post('/', (req, res) => {
    User.findOne({ _id: req.user.id })
        .then(user => {

            //Calculation to find current month
            const d = new Date();
            const m = d.getMonth();
            currentMonth = user.paidPerMonth.length - (12 - m);
            currentNonReoccuringCostMonth = user.yearlyNonReocurringCosts[currentMonth];
            currentNonReoccuringCostMonth[req.body.costOtherName] = req.body.costOther * 1;
            newYearlyNonReocurringCosts = user.yearlyNonReocurringCosts;

            User.updateOne({ _id: req.user.id }, { yearlyNonReocurringCosts: newYearlyNonReocurringCosts })
                .then(updatedUser => {
                    res.redirect('/');
                })
        })
})

module.exports = router;