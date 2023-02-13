// Quotes API
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100"
const quoteSection = document.getElementById("quote")
const userInput = document.getElementById("quote-input")

let quote = ""
let time = 60
let timer = ""
let mistakes = 0

// Display Quotes from the API
const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl)
    let data = await response.json()
    quote = data.content

    // array of chars in quote
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" +  value + "</span>"
    })
    quoteSection.innerHTML += arr.join("")
}

// Compare the input text with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars")
    quoteChars = Array.from(quoteChars)

    // Array of user input chars
    let userInputChars = userInput.value.split("")
    // loop throgh each char in quote
    quoteChars.forEach((char, index) => {
        // check chars with quote chars
        if (char.innerHTML == userInputChars[index]) {
            char.classList.add("success")
        }
        // if user hasn't entered anything or backspaced
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success")
            } else {
                char.classList.remove("fail")
            }
        }
        // if user Entered wrong char
        else {
            if (!char.classList.contains("fail")) {
                // increment and display mistakes
                mistakes ++
                char.classList.add("fail")
            }
            document.getElementById("mistakes").innerText = mistakes
        }

        // return true if all chars are correct
        let check = quoteChars.every((element) => {
            return element.classList.contains("success")
        })

        // end test if all chars are correct
        if (check)  {
            displayResult()
        }

    })
})

// Update TIMER
function updateTimer() {
    if (time == 0) {
        // END TEST
        displayResult()
    } else {
        document.getElementById("timer").innerText = --time + "s"
        }
}

// Set TIMER
const timeReduce = () => {
    time = 60
    timer = setInterval(updateTimer, 1000)
}

// END TEST
const displayResult = () => {
    // Display results div
    document.querySelector(".result").style.display = "block"
    clearInterval(timer)
    document.getElementById("stop-test").style.display = "none"
    userInput.disabled = true
    let timeTaken = 1
    if (time != 0) {
        timeTaken = (60 - time) / 100
        }
        document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm"
        document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%"
}

// START
const startTest = () => {
    mistakes = 0
    timer = ""
    userInput.disabled = false
    timeReduce()
    document.getElementById("start-test").style.display = "none"
    document.getElementById("stop-test").style.display = "block"
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}