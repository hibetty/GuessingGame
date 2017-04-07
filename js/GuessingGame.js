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
/*
$(window).resize(function(){
  $('body').css('background', 'linear-gradient(#004056, #74ceb7)');
}); */

$(document).ready(function(){
  var gameInstance = new Game();
  function saveGuess(){
    var guess = $('#guess').val();
    var result = gameInstance.playersGuessSubmission(guess);
    var lower = gameInstance.isLower();
    var lastGuess = gameInstance.getLastGuess();

    $('#guess').val('');
    $('#title').text(result);

    if(result === 'Game Over.' || result === 'You Win!'){
      $('#subtitle').text('Click \'Reset\' to play again!');
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
      $('#guesses').prepend('<li>' + lastGuess + '</li>');
      $('#guesses').find('li').remove(':last-child');
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
  });

  $('#hint').on('click', function(){
    $('#subtitle').text('It might be... ' + gameInstance.provideHint().join("... or ") + '!');
  });

  


});