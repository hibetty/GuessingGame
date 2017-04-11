function generateWinningNumber(){
  var winningNum = Math.floor(Math.random() * 100) + 1;
  return winningNum;
}

function shuffle(array){
  var m = array.length;

  while(m){
    var i = Math.floor(Math.random() * m--);

    //swap item at array[i] with last element of unshuffled items
    var temp = array[m];
    array[m] = array[i];
    array[i] = temp;
  }
  
  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
  if((num >= 1 && num <= 100) && num !== NaN){
    this.playersGuess = num;
    return this.checkGuess();
  } else {
    throw 'That is an invalid guess.'
  }
}

Game.prototype.getLastGuess = function(){
  return this.pastGuesses[this.pastGuesses.length-1];
}

Game.prototype.getGuessNum = function(){
  return this.pastGuesses.length;
}

Game.prototype.getWinningNum = function(){
  return this.winningNumber;
}

Game.prototype.checkGuess = function(){
  if(this.pastGuesses.includes(this.playersGuess)){
    return 'You have already guessed that number.';
  } else {
    this.pastGuesses.push(this.playersGuess);

      if(this.pastGuesses.length < 5){
        if(this.difference() === 0){
          return 'You Win!';
        } else if(this.difference() < 10){
          return 'You\'re burning up!';
        } else if(this.difference() >= 10 && this.difference() < 25){
          return 'You\'re lukewarm.';
        } else if(this.difference() >= 25 && this.difference() < 50){
          return 'You\'re a bit chilly.';
        } else {
          return 'You\'re ice cold!';
        }
      } else {
        if(this.difference() === 0){
          return 'You Win!';
        } else {
          return 'Game Over.';
        }
      }
  }
}

function newGame(){
  return new Game();
}

Game.prototype.provideHint = function(){
  var hint = [];
  hint.push(this.winningNumber);
  for(var i=0; i<2; i++){
    hint.push(generateWinningNumber());
  }

  return shuffle(hint);
}

$(document).ready(function(){
  var gameInstance = new Game();
  function saveGuess(){
    var guess = $('#guess').val();
    var result = gameInstance.playersGuessSubmission(guess);
    var lower = gameInstance.isLower();
    var lastGuess = gameInstance.getLastGuess();
    var guessNum = gameInstance.getGuessNum();
    var winningNum = gameInstance.getWinningNum();

    $('#guess').val('');
    $('#title').text(result);

    if(result === 'Game Over.' || result === 'You Win!'){
      if(result === 'You Win!'){
        $('body').css('background', 'linear-gradient(#e91e63, #00bcd4)');
        $('#subtitle').text('Click \'Reset\' to play again!');
      } else {
        $('#subtitle').text('The winning number was ' + winningNum + '. Click \'Reset\' to play again!');
      }


      $('#submit').prop('disabled', true);
      $('#submit').addClass('buttonDisable');
      $('#hint').prop('disabled', true);
      $('#hint').addClass('buttonDisable');
    } else if(lower){
      $('#subtitle').text('Guess higher!');
    } else {
      $('#subtitle').text('Guess lower!');
    }

    if(result !== 'You have already guessed that number.'){
      $('#guesses').find('li:nth-child('+ guessNum + ')').text(lastGuess);
    }
  }

  $('#submit').on('click', saveGuess);
  $('#guess').on('keydown', function(event){
    var key = event.keyCode;
    if(key === 13){
      saveGuess();
    }
  });

  $('#reset').on('click', function(){
    gameInstance = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100');
    $('#submit').prop('disabled', false);
    $('#submit').removeClass('buttonDisable');
    $('#hint').prop('disabled', false);
    $('#hint').removeClass('buttonDisable');
    $('#guesses').find('li').text('?');
    $('body').css('background', 'linear-gradient(#004056, #74ceb7)');
  });

  $('#hint').on('click', function(){
    $('#subtitle').text('It might be... ' + gameInstance.provideHint().join("... or ") + '!');
  });

});