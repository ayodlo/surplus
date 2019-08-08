const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load User Model
require('../models/User');
const Users = mongoose.model('users');
require('../models/CostMonthly');
const CostMonthly = mongoose.model('costMonthly');
require('../models/CostOther');
const CostOther = mongoose.model('costOther');

// Render Initialize View
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('initialize', {

    });
});

//Initialize Vars
let numTimesPaidEachMonth;
let paidPerMonth;

// Process Form
router.post('/', (req, res) => {

    // Keep Track of Errors
    let errors = [];

    if (!req.body.payFrequency) {
        errors.push({ text: 'Please enter a valid value for how often your paid' });
    }

    if (!req.body.payRate) {
        errors.push({ text: 'Please enter a valid value for how much your paid each pay period' });
    }

    if (!req.body.firstPayDay) {
        errors.push({ text: 'Please select your first pay day for this month' });
    }

    if (!req.body.rent) {
        errors.push({ text: 'Please enter a valid value for rent' });
    }

    if (!req.body.car) {
        errors.push({ text: 'Please enter a valid value for car expenses' });
    }

    if (!req.body.phone) {
        errors.push({ text: 'Please enter a valid value for phone expenses' });
    }

    if (!req.body.internet) {
        errors.push({ text: 'Please enter a valid value for internet and cable package' });
    }

    if (!req.body.allother) {
        errors.push({ text: 'Please enter a valid value for other re-occuring expenses' });
    }

    if (!req.body.nonReocurring) {
        errors.push({ text: 'Please enter a valid value for non re-occuring expenses this month' });
    }

    // Render the page without resetting the form
    if (errors.length > 0) {
        res.render('initialize', {
            errors: errors,
            payFrequency: req.body.payFrequency,
            payRate: req.body.payRate,
            firstPayDay: req.body.firstPayDay,
            rent: req.body.rent,
            car: req.body.car,
            phone: req.body.phone,
            internet: req.body.internet,
            allother: req.body.allother,
            nonReocurring: req.body.nonReocurring

        });
    } else {

        let date = (req.body.firstPayDay).toString();
        console.log(date);
        const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        //PARSE DATE
        if (date.indexOf('/') != -1) {
            date = date.split("/");
            console.log(date);
        }
        if (date.indexOf('-') != -1) {
            date = date.split("-");
            console.log(date);
        }

        let firstPaydayThisMonth;
        let month;

        if ((date[0]).length > 3) {
            firstPaydayThisMonth = (date[2] * 1);
            month = (date[1] * 1) - 1;
        } else {
            firstPaydayThisMonth = (date[1] * 1);
            month = (date[0] * 1) - 1;
        }

        const restOfMonths = daysInMonths.slice(month);

        let firstPaydayNextMonth;
        const payFrequency = req.body.payFrequency;

        monthlyCosts = {
            rent: req.body.rent,
            car: req.body.car,
            phone: req.body.phone,
            internet: req.body.internet,
            other: req.body.allother
        };

        const yearlyCosts = new Array(restOfMonths.length);
        yearlyCosts.fill(monthlyCosts);
        const yearlyNonReocurringCosts = new Array(restOfMonths.length);
        yearlyNonReocurringCosts.fill({});
        yearlyNonReocurringCosts[0] = { 'initial': req.body.nonReocurring * 1 };

        // paidEachMonth is an array that holds how many times user will be paid each month
        numTimesPaidEachMonth = restOfMonths.map((monthDays) => {
            const daysLeftInMonth = monthDays - firstPaydayThisMonth + 1;
            if (payFrequency === "weekly") {
                firstPaydayNextMonth = 8 - (daysLeftInMonth % 7);
                firstPaydayThisMonth = firstPaydayNextMonth;
                return Math.floor(daysLeftInMonth / 7) + 1;
            }
            else if (payFrequency === "biweekly") {
                firstPaydayNextMonth = 8 - (daysLeftInMonth % 7);
                firstPaydayThisMonth = firstPaydayNextMonth;
                return Math.floor(daysLeftInMonth / 14) + 1;
            }
            else if (payFrequency === "monthly") {
                return 1;
            }
        });

        paidPerMonth = numTimesPaidEachMonth.map((timesPaidPerMonth) => {
            return (timesPaidPerMonth * (req.body.payRate * 1));
        })

        date = date.toString();

        // Save how much user will be paid each month to the DB
        Users.update({ _id: req.user.id }, { paidPerMonth: paidPerMonth, initialized: true, yearlyCosts: yearlyCosts, yearlyNonReocurringCosts: yearlyNonReocurringCosts, date: date })
            .then(updatedUser => {
                res.redirect('/');
            })

    }

})

router.post('/restart', (req, res) => {
    Users.updateOne({ _id: req.user.id }, { initialized: false })
        .then(userInitialized => {
            res.redirect('/');
        })
})

module.exports = router;