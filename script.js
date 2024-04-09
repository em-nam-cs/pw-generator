/**
@brief basic password generator that creates a random string password
    with the given conditions (uppercase, numbers, symbols, length)

@references https://www.youtube.com/watch?v=iKo9pDKKHnc
@author Em Nam
@date 04-02-2024
 */

const charAmountRange = document.getElementById("charAmountRange");
const charAmountNum = document.getElementById("charAmountNum");
const form = document.getElementById("pwGeneratorForm");
const includeUpperEl = document.getElementById("includeUpper");
const includeNumEl = document.getElementById("includeNum");
const includeSymbolsEl = document.getElementById("includeSymbols");
const pwDisplayEl = document.getElementById("pwDisplay");

charAmountNum.addEventListener("input", syncCharAmount);
charAmountRange.addEventListener("input", syncCharAmount);

form.addEventListener("submit", submitForm);

function submitForm(e) {
    console.log("submitting form");
    e.preventDefault();
    const charAmount = charAmountNum.value;
    const includeUpper = includeUpperEl.checked;
    const includeNum = includeNumEl.checked;
    const includeSymbols = includeSymbolsEl.checked;
    const password = generatePw(
        charAmount,
        includeUpper,
        includeNum,
        includeSymbols
    );

    pwDisplayEl.innerHTML = password;
}

/**
 * default is to only include ascii char 97-122 (lowercase letters) all ascii char are based in decimal
 * @param {*} charAmount determines how many characters to generate
 * @param {*} includeUpper include ascii char 65 - 90
 * @param {*} includeNum include ascii char 48 - 57
 * @param {*} includeSymbols include ascii char 33-47, 58 - 64, 91-96, 123-126
 */
function generatePw(charAmount, includeUpper, includeNum, includeSymbols) {
    let pw = "tereasfsda123st";
    console.log(charAmount);
    console.log(includeUpper);
    console.log(includeNum);
    console.log(includeSymbols);
    for (let i = 0; i < charAmount; i++) {
        const randValue = Math.floor(Math.random() * totalOptions);
        console.log("char");
    }
    // String.fromCharCode();
    return pw;
}

/**
 *
 * @param {*} e
 */
function syncCharAmount(e) {
    const value = e.target.value;
    charAmountNum.value = value;
    charAmountRange.value = value;
}
