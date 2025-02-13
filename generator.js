/**
@brief basic password generator that creates a random string password
    with the given conditions (uppercase, numbers, basic symbols,
    all symbols, length)

@references https://www.youtube.com/watch?v=iKo9pDKKHnc
@author Em Nam
@date 04-16-2024
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

const MAX_PERCENT_SYMBOL = 0.25; /**cannot be/divide by zero */
const MIN_PERCENT_NUM = 0.3;
const NUM_LETTERS = 26;
const NUM_NUMBERS = 10;

const charAmountRange = document.getElementById("charAmountRange");
const charAmountNum = document.getElementById("charAmountNum");
const form = document.getElementById("pwGeneratorForm");
const includeUpperEl = document.getElementById("includeUpper");
const includeNumEl = document.getElementById("includeNum");
const includeBasicSymbolsEl = document.getElementById("includeBasicSymbols");
const includeAllSymbolsEl = document.getElementById("includeAllSymbols");
const pwDisplay = document.getElementById("pw-display");
const copyBtn = document.getElementById("copy-icon");
const copyPopup = document.getElementById("popup-copy");

charAmountNum.addEventListener("input", syncCharAmount);
charAmountRange.addEventListener("input", syncCharAmount);
form.addEventListener("submit", submitForm);
copyBtn.addEventListener("click", copyPassword);

copyBtn.addEventListener("mouseover", () => {
    copyPopup.classList.remove("hidden");
    copyPopup.innerText = "copy";
});

copyBtn.addEventListener("mouseout", () => {
    copyPopup.classList.add("hidden");
});

function copyPassword() {
    navigator.clipboard.writeText(pwDisplay.innerText);
    copyPopup.classList.remove("hidden");
    copyPopup.innerText = "copied";
}

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
    // prettier-ignore
    const password = generatePw(charAmount, includeUpper, includeNum,
        includeBasicSymbols, includeAllSymbols);

    pwDisplay.innerText = password;
}

/**
 * Generates the password string using the users' choices of character types
 *      and number of characters. The default is to only include ascii
 *      char 97-122 (lowercase letters), all ascii char are based in decimal.
 *      Based on the char types chosen, different ratios of each character is
 *      added to an array. Then a RNG chooses each char in the password. After
 *      choosing each char, the string is returned.
 * @param {*} charAmount determines how many characters to generate
 * @param {*} includeUpper boolean when true include ascii char 65 - 90
 * @param {*} includeNum boolean when true include ascii char 48 - 57
 * @param {*} includeBasicSymbols boolean when true include the BASIC_SYMBOLS
 * @param {*} includeAllSymbols boolean when true include ascii char 33-47, 58 - 64, 91-96, 123-126
 */
// prettier-ignore
function generatePw(charAmount, includeUpper, includeNum, includeBasicSymbols,
    includeAllSymbols) {
    let pw = "";
    let charOptions = [];
    const multipliers = new Map();
    multipliers.set("lower", 1);
    multipliers.set("upper", 1 * includeUpper);
    multipliers.set("num", 1 * includeNum);

    //Add ascii code to array for symbols
    if (includeBasicSymbols) {
        charOptions = charOptions.concat(BASIC_SYMBOLS_ASCII_CODES);
    }

    if (includeAllSymbols) {
        for (let i = 0; i < SYMBOL_LOWER_LIMITS.length; i++) {
            console.time("test");
            /**multiplier of 1, bc minimum, want to weight this the least */
            generateCharOptions(charOptions, SYMBOL_LOWER_LIMITS[i],
                SYMBOL_UPPER_LIMITS[i], 1);
        }
    }

    //update multipliers needed to satisfy percentages
    let numSymbols = charOptions.length;
    let goalTotal = numSymbols / MAX_PERCENT_SYMBOL;
    updateMultipliers(goalTotal, numSymbols, multipliers, includeUpper,
        includeNum);

    //Add ascii code to array for chars with multipliers
    //always includes lowercase
    generateCharOptions(charOptions, LOWERCASE_LOWER_LIMIT,
        LOWERCASE_UPPER_LIMIT, multipliers.get("lower"));

    //if statement not needed because multiplier would handle the false case
    // (no appending char type) but conditional prevents function call 
    if (includeUpper){
        generateCharOptions(charOptions, UPPERCASE_LOWER_LIMIT, 
            UPPERCASE_UPPER_LIMIT, multipliers.get("upper"));
    }

    if (includeNum){
        generateCharOptions(charOptions, NUM_LOWER_LIMIT, 
            NUM_UPPER_LIMIT, multipliers.get("num"));
    }

    //Randomly chose a value for each character needed in password
    for (let i = 0; i < charAmount; i++) {
        const randIndex = Math.floor(Math.random() * charOptions.length);
        pw = pw + String.fromCharCode(charOptions[randIndex]);
    }

    return pw;
}

/**
 * Update the multipliers for lower, upper, and number characters based on how
 *      many symbols exist and the global constants of percentage of
 *      symbols and numbers. While the curr character options are too small to
 *      satisfy the symbol and number percentages, respectively, increase
 *      the multipliers evenly. Then increase the number multiplier until its
 *         percentage is also satisfied.
 * @param {*} goal target minimum goal of total characters needed
 * @param {*} numSymbols number of symbol options (basic, all)
 * @param {*} multipliers Map of multipliers for each character type
 * @param {*} upper bool if upper chars are included
 * @param {*} num bool if number chars are included
 */
function updateMultipliers(goal, numSymbols, multipliers, upper, num) {
    let curr =
        numSymbols +
        multipliers.get("lower") * NUM_LETTERS +
        multipliers.get("upper") * NUM_LETTERS +
        multipliers.get("num") * NUM_NUMBERS;

    while (goal > curr) {
        //always includes lower case letters
        multipliers.set("lower", multipliers.get("lower") + 1);
        multipliers.set("upper", (multipliers.get("upper") + 1) * upper);
        multipliers.set("num", (multipliers.get("num") + 1) * num);

        curr =
            numSymbols +
            multipliers.get("lower") * NUM_LETTERS +
            multipliers.get("upper") * NUM_LETTERS +
            multipliers.get("num") * NUM_NUMBERS;
    }

    /**update the number multiplier */
    if (num) {
        let currNum = multipliers.get("num") * NUM_NUMBERS;
        let goalNum = curr * MIN_PERCENT_NUM;

        while (goalNum > currNum) {
            multipliers.set("num", (multipliers.get("num") + 1) * num);
            currNum = multipliers.get("num") * NUM_NUMBERS;
            curr =
                numSymbols +
                multipliers.get("lower") * NUM_LETTERS +
                multipliers.get("upper") * NUM_LETTERS +
                multipliers.get("num") * NUM_NUMBERS;
            goalNum = curr * MIN_PERCENT_NUM;
        }
    }
}

/**
 * generates the ascii character codes within the given range and appends it
 * to the existing array storing the possible character options
 * @param {*} chars array with possible character options
 * @param {*} lowerLimit lower limit of the range (inclusive)
 * @param {*} upperLimit upper limit of the range (inclusive)
 * @param {*} multiplier int that represents how many multiples of the char set
 *      needs to be appended in order to meet the percentage requirements
 */
function generateCharOptions(chars, lowerLimit, upperLimit, multiplier) {
    for (let j = 0; j < multiplier; j++) {
        for (let i = lowerLimit; i <= upperLimit; i++) {
            chars.push(i);
        }
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
