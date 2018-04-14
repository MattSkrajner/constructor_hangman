//Require inquirer and is-letter npm packages
var inquirer = require('inquirer');
var isLetter = require('is-letter');

//require other exported items
var Word = require('./word.js');
var List = require('./list.js');

// grabs the array of player names from the list.js
var playerArray = List.newWord.wordList

// variable that holds the number of user guesses remaining
var guessesLeft = 10

//array to hold the already guessed letters
var guessedLetters = []
var display = 0
var currentWord

// calls the newGame function
newGame();

    function newGame() {
      if(guessesLeft === 10) {
        // displays a starting message
        console.log("Let's play Baseball Hall of Fame Hangman");
        console.log("Guess a letter to start the game. Try to figure out the hidden hall of famer!");

        // randomly selects a word from the array
        var randNum = Math.floor(Math.random() * playerArray.length);
        currentWord = new Word(playerArray[randNum]);
        currentWord.getLetters(); 
        console.log(currentWord.wordRender());
        userPrompts();
      } else {
        resetguessesLeft();
        newGame();
      }
    };
	
	function resetguessesLeft() {
      guessesLeft = 10;
    }
   
    function userPrompts() {
      inquirer.prompt([{
        name: "chosenLtr",
        type: "input",
        message: "Choose a letter:",
        validate: function(value) {
          if(isLetter(value)){
            return true;
          } else {
            return false;
          }
        }
      }]).then(function(ltr) {
        var letterReturned = (ltr.chosenLtr);
        var guessedAlready = false;
          for(var i = 0; i < guessedLetters.length; i++){
            if(letterReturned === guessedLetters[i]){
              guessedAlready = true;
            }
          }
          if(guessedAlready === false){
            guessedLetters.push(letterReturned);

            var found = currentWord.letterCheck(letterReturned);

            if(found === 0){
              console.log("Wrong!");
              guessesLeft--;
              display++;
              console.log("Guesses left: " + guessesLeft);
              //console.log([display-1]); //check this later

              console.log("\n***************");
              console.log(currentWord.wordRender());

              console.log("Letters guessed: " + guessedLetters);
            }else{
              console.log("You guessed correctly. Nice job!");

                if(currentWord.wordCheck() === true){
                  console.log(currentWord.wordRender());
                  console.log("Home run! You won!");
                } else {
                  console.log("Guesses left: " + guessesLeft);
                  console.log(currentWord.wordRender());
                  console.log("\n***************");
                  console.log("Letters guessed: " + guessedLetters);
                }
            }
            if(guessesLeft > 0 && currentWord.wordFound === false) {
              userPrompts();
            }else if(guessesLeft === 0){
              console.log("Strike three! You lost!");
              console.log("The correct player was: " + currentWord.word);
            }
          } else {
              console.log("That letter has already been guessed.");
              userPrompts();
          }
      })
    }