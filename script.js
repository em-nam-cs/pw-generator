/**
@brief basic password generator that creates a random string password
    with the given conditions (uppercase, numbers, basic symbols,
    all symbols, length)

@references https://www.youtube.com/watch?v=iKo9pDKKHnc
@author Em Nam
@date 04-16-2024
*/

/**
 * @TODO make labels larger
 * @TODO make generated pw text larger
 * @TODO pick a different font for the pw so it is easier to read
 */

const LOWERCASE_LOWER_LIMIT = 97;
const LOWERCASE_UPPER_LIMIT = 122;
const UPPERCASE_LOWER_LIMIT = 65;
const UPPERCASE_UPPER_LIMIT = 90;
const NUM_LOWER_LIMIT = 48;
const NUM_UPPER_LIMIT = 57;
const SYMBOL_LOWER_LIMITS = [33, 58, 91, 123];
const SYMBOL_UPPER_LIMITS = [47, 64, 96, 126];
const BASIC_SYMBOLS_ASCII_CODES = [
    33, 35, 36, 37, 38, 40, 41, 42, 43, 45, 46, 58, 59, 61, 63, 64, 91, 93, 126,
];

const charAmountRange = document.getElementById("charAmountRange");
const charAmountNum = document.getElementById("charAmountNum");
const form = document.getElementById("pwGeneratorForm");
const includeUpperEl = document.getElementById("includeUpper");
const includeNumEl = document.getElementById("includeNum");
const includeBasicSymbolsEl = document.getElementById("includeBasicSymbols");
const includeAllSymbolsEl = document.getElementById("includeAllSymbols");
const pwDisplayEl = document.getElementById("pwDisplay");

charAmountNum.addEventListener("input", syncCharAmount);
charAmountRange.addEventListener("input", syncCharAmount);
form.addEventListener("submit", submitForm);

/**
 * functionality for when the form is submitted and the password should be 
        generated. Get the user's values for all the options of characters 
        and user's choice of password length and generate. Display the password.

 * @param {*} e event that triggers
 */
function submitForm(e) {
    e.preventDefault();
    const charAmount = charAmountNum.value;
    const includeUpper = includeUpperEl.checked;
    const includeNum = includeNumEl.checked;
    const includeBasicSymbols = includeBasicSymbolsEl.checked;
    const includeAllSymbols = includeAllSymbolsEl.checked;
    const password = generatePw(
        charAmount,
        includeUpper,
        includeNum,
        includeBasicSymbols,
        includeAllSymbols
    );

    pwDisplayEl.innerText = password;
}

/**
 * default is to only include ascii char 97-122 (lowercase letters) all ascii 
    char are based in decimal
 * @param {*} charAmount determines how many characters to generate
 * @param {*} includeUpper boolean when true include ascii char 65 - 90
 * @param {*} includeNum boolean when true include ascii char 48 - 57
 * @param {*} includeBasicSymbols boolean when true include the BASIC_SYMBOLS
 * @param {*} includeAllSymbols boolean when true include ascii char 33-47, 58 - 64, 91-96, 123-126
 */
function generatePw(
    charAmount,
    includeUpper,
    includeNum,
    includeBasicSymbols,
    includeAllSymbols
) {
    let pw = "";
    let charOptions = [];

    //Add ascii code to array for each option
    generateCharOptions(
        charOptions,
        LOWERCASE_LOWER_LIMIT,
        LOWERCASE_UPPER_LIMIT
    );

    if (includeUpper) {
        generateCharOptions(
            charOptions,
            UPPERCASE_LOWER_LIMIT,
            UPPERCASE_UPPER_LIMIT
        );
    }
    if (includeNum) {
        generateCharOptions(charOptions, NUM_LOWER_LIMIT, NUM_UPPER_LIMIT);
    }

    if (includeBasicSymbols) {
        charOptions = charOptions.concat(BASIC_SYMBOLS_ASCII_CODES);
    }

    if (includeAllSymbols) {
        for (let i = 0; i < SYMBOL_LOWER_LIMITS.length; i++) {
            generateCharOptions(
                charOptions,
                SYMBOL_LOWER_LIMITS[i],
                SYMBOL_UPPER_LIMITS[i]
            );
        }
    }

    //Randomly chose a value for each character needed in password
    for (let i = 0; i < charAmount; i++) {
        const randIndex = Math.floor(Math.random() * charOptions.length);
        pw = pw + String.fromCharCode(charOptions[randIndex]);
    }

    return pw;
}

/**
 * generates the ascii character codes within the given range and appends it
 * to the existing array storing the possible character options
 * @param {*} chars array with possible character options
 * @param {*} lowerLimit lower limit of the range (inclusive)
 * @param {*} upperLimit upper limit of the range (inclusive)
 */
function generateCharOptions(chars, lowerLimit, upperLimit) {
    for (let i = lowerLimit; i <= upperLimit; i++) {
        chars.push(i);
    }
}

/**
 * set the values for the slider and the number value for the number
 * of characters to match
 * @param {*} e event that triggered function
 */
function syncCharAmount(e) {
    const value = e.target.value;
    charAmountNum.value = value;
    charAmountRange.value = value;
}
