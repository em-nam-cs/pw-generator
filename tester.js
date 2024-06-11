/**
@brief Basic web app that will analyze a text password and determine how strong it is
based on length, characters, variety using regex. The strength of the password
will be shown increasing or decreasing in the progress bar and recommendations
to improve the password will be given below

@ref https://www.youtube.com/watch?v=7-1VZ2wF8pw
@author Em Nam
@date May 28, 2024
 */

/**
  * @todo have specific message for which upper, lower, num, symbol is needed
    @todo check how to do with regex instead of if statements
    @todo make deductions smoother/check values
    @todo other factors of a password??

    
  */

const MAX_STRENGTH_METER = 100;
const MIN_REPEAT_LENGTH = 3;
const MAX_PW_REC = "Nice! That is a strong password!";

const strengthMeter = document.getElementById("strength-meter");
const pwInput = document.getElementById("password-input");
const recsContainer = document.getElementById("recs");
const recs = document.getElementById("recs");
const pasteBtn = document.getElementById("paste-icon");
const pastePopup = document.getElementById("popup-paste");

window.onload = function () {
    pwInput.value = "";
};

pwInput.addEventListener("input", displayAnalysis);
pasteBtn.addEventListener("click", pastePassword);

pasteBtn.addEventListener("mouseover", () => {
    pastePopup.classList.remove("hidden");
});

pasteBtn.addEventListener("mouseout", () => {
    pastePopup.classList.add("hidden");
});

strengthMeter.addEventListener("mouseover", showStrengthScore);

strengthMeter.addEventListener("mouseout", () => {
    console.log("HIDE SCORE")
})

function showStrengthScore(){
    console.log("SHOWING SCORE")
    strengthMeter.before
}

async function pastePassword() {
    pastePopup.classList.add("hidden");
    const currPw = await navigator.clipboard.readText();
    pwInput.value = currPw;
    displayAnalysis();
}


/**
 * Analysizes the password and displays the results. It clears the previous
 * results, reads in the user input and calculates all the weaknesses. Based
 * on the weaknesses returned, makes the proper deductions and displays the
 * recommendations
 */
function displayAnalysis() {
    console.log("DISPLAY");
    clearAnalysis();
    weaknesses = calcPwStrength(pwInput.value);
    let strength = MAX_STRENGTH_METER;

    // update strength and rec for each weakness
    for (let i = 0; i < weaknesses.length; i++) {
        //ignore 'undefined' returns
        if (weaknesses[i]) {
            strength = strength - weaknesses[i].deduction;

            const recElement = document.createElement("div");
            recElement.innerText = weaknesses[i].message;
            recs.appendChild(recElement);
        }
        strengthMeter.style.setProperty("--strength", strength);
    }

    if (strength == MAX_STRENGTH_METER && pwInput.value != "") {
        const recElement = document.createElement("div");
        recElement.innerText = MAX_PW_REC;
        recs.appendChild(recElement);
    }
}



/**
 * clears the password strength bar and the recommendations displays
 */
function clearAnalysis() {
    while (recs.firstChild) {
        recs.removeChild(recs.lastChild);
    }
    strengthMeter.style.setProperty("--strength", 0);
}

/**
 * Creates an array of weaknesses the password may or may not have
 * @param {*} password string that contains entire input password
 * @returns an array of all the weaknesses that were checked, if a password
 *      does not have a weakness, that value in the array will be undefined
 */
function calcPwStrength(password) {
    const weaknesses = [];
    //calc all weaknesses if there is a password entered
    if (password) {
        weaknesses.push(lengthWeakness(password));
        weaknesses.push(
            characterTypeWeakness(password, /[a-z]/g, "lowercase character")
        );
        weaknesses.push(
            characterTypeWeakness(password, /[A-Z]/g, "uppercase character")
        );
        weaknesses.push(characterTypeWeakness(password, /[0-9]/g, "number"));
        weaknesses.push(
            characterTypeWeakness(
                password,
                /[^A-Za-z0-9\s]/g,
                "special character"
            )
        );
        weaknesses.push(repeatWeakness(password));
    }

    return weaknesses;
}

/**
 * Checks if a password uses a certain character type and the frequency, if the
 *      password contains the character type, it is considered stronger
 * @param {*} password string that contains the entire input password
 * @param {*} regex regular expression that defines how to match the character type
 * @param {*} type string that states what type is being checked for 
        in order to display the matching recommendation
 * @returns a weakness that has a string recommendation message and an int
        deduction based on how strong the password is otherwise, if the 
        password is ideal for this weakness returns undefined
 */
function characterTypeWeakness(password, regex, type) {
    const matches = password.match(regex) || [];
    if (matches.length == 0) {
        return {
            message: `Include at least one ${type}`,
            deduction: 15,
        };
    } else if (matches.length < 2) {
        return {
            message: `Include more ${type}s`,
            deduction: 5,
        };
    }
}

/**
 * Checks how long a password is. The longer the password, the stronger and
 * more secure it is 
 * @param password string that contains the entire input password
 * @returns a weakness that makes a recommendation message and a deduction 
        based on how strong the password is otherwise, if the password is ideal
        for this weakness returns undefined
 */
function lengthWeakness(password) {
    const len = password.length;
    if (len < 5) {
        return {
            message: "Password is too short",
            deduction: 40,
        };
    } else if (len <= 10) {
        return {
            message: "Password could be longer",
            deduction: 15,
        };
    }
}

/**
 * Makes sure the password does not have repeating characters directly in a row
 * For example: AAA, 111121, 
 * It does not check for repeating sequences: 123123
 * @param password string that contains the entire input password
 * @returns a weakness that makes a recommendation message and a deduction 
        based on how strong the password is otherwise, if the password is ideal
        for this weakness returns undefined
 */
function repeatWeakness(password) {
    //find matches of repeating charcters
    const matches = password.match(/(.)\1+/g) || [];

    //only keep the matches that have more than MIN_REPEAT_LENGTH
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].length < MIN_REPEAT_LENGTH) {
            matches.splice(i, 1);
        }
    }

    if (matches.length > 0) {
        return {
            message: "Password has repeating characters",
            deduction: 5 * matches.length,
        };
    }
}

// const LOWERCASE_LOWER_LIMIT = 97;
// const LOWERCASE_UPPER_LIMIT = 122;
// const UPPERCASE_LOWER_LIMIT = 65;
// const UPPERCASE_UPPER_LIMIT = 90;
// const NUM_LOWER_LIMIT = 48;
// const NUM_UPPER_LIMIT = 57;
/** for each character in password, check what type of character it is
        then evaluate how much variety is in the password
        The more variety, the stronger the password and the less deductions
    @param password string that contains the entire input password
    @returns a weakness that makes a recommendation message and a deduction 
        based on how strong the password is otherwise, if the password is ideal
        for this weakness returns undefined
 */
// function varietyWeakness(password) {
//     console.log("variety");
//     let upper = false;
//     let lower = false;
//     let num = false;
//     let symbol = false;

//     //determine if at least one an upper, lowercase, number, or symbol was used
//     for (let i = 0; i < password.length; i++) {
//         const currChar = password.charCodeAt(i);
//         if (
//             currChar >= LOWERCASE_LOWER_LIMIT &&
//             currChar <= LOWERCASE_UPPER_LIMIT
//         ) {
//             lower = true;
//         } else if (
//             currChar >= UPPERCASE_LOWER_LIMIT &&
//             currChar <= UPPERCASE_UPPER_LIMIT
//         ) {
//             upper = true;
//         } else if (currChar >= NUM_LOWER_LIMIT && currChar <= NUM_UPPER_LIMIT) {
//             num = true;
//         } else {
//             symbol = true;
//         }
//     }

//     console.log(`variety: ${upper}, ${lower}, ${num}, ${symbol}`);

//     //fill this in with case statements
//     const varietyScore = upper + lower + num + symbol;
//     console.log(varietyScore);

//     if (varietyScore == 1) {
//         return {
//             message: "Use more than one type of character",
//             deduction: 40,
//         };
//     }
//     if (varietyScore == 2) {
//         return {
//             message: "Use more than two type of character",
//             deduction: 25,
//         };
//     }
//     if (varietyScore == 3) {
//         return {
//             message: "Use more than three type of character",
//             deduction: 10,
//         };
//     }
// }
