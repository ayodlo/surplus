//MENU VARS
const menuButtonUp = document.querySelector('.menu-button-up');
const menuButtonDown = document.querySelector('.menu-button-down');
const menu = document.querySelector('.menu');
const main = document.querySelector('.main');


//COSTS & INITIALIZE VARS
const costs = document.querySelector('.costs-page');
const costsButton = document.querySelector('.costs-button');
const closeCostsButton = document.querySelector('.costs-menu-button-left');
const otherCosts = document.querySelector('.otherCostsPage');
const otherCostsButton = document.querySelector('.otherCostsButton');
const closeOtherCostsButton = document.querySelector('.other-costs-menu-button-left');
const initializeButton = document.querySelector('.initialize-button');


//THEMES VARS
const themes = document.querySelector('.themes');
const themesButton = document.querySelector('.themes-button');
const themeOptionContainer = document.querySelectorAll('.theme-option-container');
const mistyRose = document.querySelector('.misty-rose');
const pastelGreen = document.querySelector('.pastel-green');
const verdigirs = document.querySelector('.verdigris');
const black = document.querySelector('.black');

//INIT VARS
const init1stButton = document.querySelector('.init1');
const init2ndButton = document.querySelector('.init2');
const init3rdButton = document.querySelector('.init3');
const init1st = document.querySelector('.first');
const init2nd = document.querySelector('.second');
const init3rd = document.querySelector('.third');
const back1 = document.querySelector('.back1');
const back2 = document.querySelector('.back2');
const dateElement = document.querySelector('.first-pay-day');


//ONLOAD FUNCTION
window.onload = function () {
}


//MENU JS
if (menuButtonUp && menuButtonDown) {

    menuButtonUp.addEventListener('click', function () {
        menu.classList.add('menu-transform');
        main.classList.add('main-transform');
        main.classList.add('main-transform');
        main.classList.add('main-transform');
    })

    menuButtonDown.addEventListener('click', function () {
        menu.classList.remove('menu-transform');
        main.classList.remove('main-transform');
    })

}


//COSTS & initialize JS
if (initializeButton && costs && costsButton && closeCostsButton && otherCosts && otherCostsButton && closeOtherCostsButton) {

    costsButton.addEventListener('click', function () {
        console.log('this is working')
        costs.classList.add('costs-transform');
    })

    closeCostsButton.addEventListener('click', function () {
        costs.classList.remove('costs-transform');
    })

    otherCostsButton.addEventListener('click', function () {
        otherCosts.classList.add('costs-transform');
    })

    closeOtherCostsButton.addEventListener('click', function () {
        otherCosts.classList.remove('costs-transform');
    })

    function deleteMonthlyCost(propName) {
        document.getElementById('editMonthlyCostsInput').value = propName;
        document.getElementById('editMonthlyCostsForm').submit();
    }

    function deleteOtherCost(propName) {
        document.getElementById('editOtherCostsInput').value = propName;
        document.getElementById('editOtherCostsForm').submit();
    }

    initializeButton.addEventListener('click', initialize);

    function initialize(propName) {
        document.getElementById('initializeForm').submit();
    }
}


//THEMES JS
if (themesButton && themeOptionContainer && mistyRose && pastelGreen && verdigirs && black) {

    themesButton.addEventListener('click', function () {
        themes.classList.add('themes-transform');
    })

    /*
    themeOptionContainer.forEach(element => {
        element.addEventListener('click', function () {
            themes.classList.remove('themes-transform');
        })
    })
    */

    mistyRose.addEventListener('click', function () {
        document.getElementById('theme-input').value = "/css/themes/pink-style.css";
        document.getElementById('themeForm').submit();
    })

    pastelGreen.addEventListener('click', function () {
        document.getElementById('theme-input').value = "/css/themes/green-style.css";
        document.getElementById('themeForm').submit();
    })

    verdigirs.addEventListener('click', function () {
        document.getElementById('theme-input').value = "/css/themes/verdigris-style.css";
        document.getElementById('themeForm').submit();
    })

    black.addEventListener('click', function () {
        document.getElementById('theme-input').value = "/css/themes/black-style.css";
        document.getElementById('themeForm').submit();
    })
}


//INIT JS
if (init1stButton && init2ndButton && back1 && back2) {
    init1stButton.addEventListener('click', function () {
        init1st.classList.add('move');
        init2nd.classList.remove('start');
    })

    init2ndButton.addEventListener('click', function () {
        init2nd.classList.add('move');
        init3rd.classList.remove('start');
    })

    back1.addEventListener('click', function () {
        init1st.classList.remove('move');
        init2nd.classList.add('start');
    })

    back2.addEventListener('click', function () {
        init2nd.classList.remove('move');
        init3rd.classList.add('start');
    })
}

// DATE PICKER
if (dateElement) {

    //reset type=date inputs to text
    $( document ).bind( "mobileinit", function(){
        $.mobile.page.prototype.options.degradeInputs.date = true;
      });

        jQuery(function ($) { //on document.ready
            $('#start').datepicker({
                inline: true,
                showOtherMonths: true,
                dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            });
        })
    }