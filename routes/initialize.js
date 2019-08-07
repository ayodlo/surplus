const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

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
    let date = (req.body.firstPayDay).toString();
    console.log(date);
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //PARSE DATE
    if(date.indexOf('/') != -1) {
        date = date.split("/");
        console.log(date);
    }
    if(date.indexOf('-') != -1) {
        date = date.split("-");
        console.log(date);
    }

    console.log(date);

    const month = (date[0] * 1) - 1;
    const restOfMonths = daysInMonths.slice(month);
    let firstPaydayThisMonth = (date[1] * 1);
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
    yearlyNonReocurringCosts[0] = {'initial' : req.body.nonReocurring * 1};

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

})

router.post('/restart', (req, res) => {
    Users.updateOne({ _id: req.user.id }, { initialized: false })
    .then(userInitialized => {
        res.redirect('/');
    })
})

module.exports = router;