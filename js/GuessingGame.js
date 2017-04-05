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
  if(num >= 1 && num <= 100 || num === NaN){
    this.playersGuess = num;
    return this.checkGuess();
  } else {
    throw 'That is an invalid guess.'
  }
}

Game.prototype.checkGuess = function(){
  var duplicate = false

  for(var i=0; i<this.pastGuesses.length; i++){
    if(this.pastGuesses[i] === this.playersGuess){
      duplicate = true;
    }
  }

  if(this.pastGuesses.length <= 5){
    if(this.playersGuess === this.winningNumber){
      return 'You Win!';
    } else if(duplicate){
      return 'You have already guessed that number.'
    } else {
      this.pastGuesses.push(this.playersGuess);
    }
  }

  if(this.pastGuesses.length === 5){
    return 'You Lose.';
  } else if(this.difference() < 10){
    return 'You\'re burning up!';
  } else if(this.difference() >= 10 && this.difference() < 25){
    return 'You\'re lukewarm.';
  } else if(this.difference() >= 25 && this.difference() < 50){
    return 'You\'re a bit chilly.';
  } else {
    return 'You\'re ice cold!';
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