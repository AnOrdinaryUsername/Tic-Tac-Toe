const PlayerScore = () => {
  let score = 0;

  const getScore = () => score;
  const incrementScore = (str) => {
    score += 1;
    if (str === 'human') {
      const humanScore = document.querySelector('#man');
      humanScore.textContent = score;
    } else if (str === 'bot') {
      const botScore = document.querySelector('#cpu');
      botScore.textContent = score;
    }
  };

  const resetScore = () => {
    score = 0;
    const humanScore = document.querySelector('#man');
    const botScore = document.querySelector('#cpu');
    humanScore.textContent = '0';
    botScore.textContent = '0';
  };

  return { getScore, incrementScore, resetScore };
};

const Winner = (man, machine) => {
  // Composition by passing objects
  const getMan = () => man;
  const getMachine = () => machine;

  const declareWinner = () => {
    const winnerText = document.querySelector('#result-text');
    if (man.getScore() === 3) winnerText.textContent = 'You won! Wooooo!';
    else if (machine.getScore() === 3) {
      winnerText.textContent = 'The Bot won! Nooooo!';
    }
  };

  // Game is best of 5 so 3 wins is all it takes
  const isWinnerPresent = () => {
    if (man.getScore() === 3 || machine.getScore() === 3) {
      return true;
    }

    return false;
  };

  return {
    isWinnerPresent, declareWinner, getMan, getMachine,
  };
};

const GameBoard = (theWinner) => {
  // More composition
  const samePlayer = theWinner.getMan();
  const sameBot = theWinner.getMachine();

  let turns = 0;

  /* **********************
  *     Tic-Tac-Toe       *
  *  Array Visualization  *
  *                       *
  *     0 |  1  |  2      *
  *   -----------------   *
  *     3 |  4  |  5      *
  *   -----------------   *
  *     6 |  7  |  8      *
  ********************** */
  const board = [null, null, null,
    null, null, null,
    null, null, null];

  const winCombo = [[0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical wins
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal wins
    [0, 4, 8], [2, 4, 6]]; // Diagonal wins

  const animateWinningRow = (first, second, third) => {
    const winningRow = [first, second, third];

    for (let i = 0; i < 3; ++i) {
      const index = winningRow[i];
      const gameBoard = document.querySelector('table');
      const char = gameBoard.getElementsByTagName('span')[index];

      char.classList.add('blink');
    }
  };

  const checkForWin = (char) => {
    const inARow = char.concat(char.concat(char));
    for (let i = 0; i < winCombo.length; ++i) {
      // winCombo acts as the index of board
      // Ex. winCombo[2][2] grabs the 3rd array stored in the array and grabs
      //     the 3rd index value, 8
      const a = board[winCombo[i][0]];
      const b = board[winCombo[i][1]];
      const c = board[winCombo[i][2]];

      if (c === null || b === null || a === null) continue;

      // Concatenate all 3 board indices together into a string and remove
      // all commas
      const threeMarks = a.concat(b.concat(c)).toString().replace(/,/g, '');

      if (threeMarks === inARow) {
        animateWinningRow(winCombo[i][0], winCombo[i][1], winCombo[i][2]);
        if (char === 'X') {
          samePlayer.incrementScore('human');
          return true;
        }
        if (char === 'O') {
          sameBot.incrementScore('bot');
          return true;
        }
      }
    }
    return false;
  };

  // Set entire board array to null, reset turns back to 0, and remove all
  // Xs and Os on visual webpage
  const resetBoardState = () => {
    for (let i = 0; i < board.length; ++i) {
      board[i] = null;
      const table = document.querySelector('table');
      const boardNode = table.getElementsByTagName('span')[i];

      // Remove blinking animations from winning row
      if (boardNode.classList.contains('blink')) {
        boardNode.classList.remove('blink');
      }

      boardNode.textContent = '';
    }
    turns = 0;
  };

  // Function to grab all empty boxes for the bot
  const getAvailableBoxes = () => {
    const index = [];
    for (let i = 0; i < board.length; ++i) {
      if (board[i] === null) index.push(i);
    }
    return index;
  };

  const checkBoardState = () => {
    const table = document.querySelector('#click-box');
    let winnerOrDrawPresent = false;

    table.addEventListener('click', (e) => {
      const tdChild = e.target.querySelector('span');

      if (winnerOrDrawPresent) {
        resetBoardState();
        // Reset player scores and text box
        if (theWinner.isWinnerPresent()) {
          samePlayer.resetScore();
          sameBot.resetScore();
          const winnerText = document.querySelector('#result-text');
          winnerText.textContent = 'Click the Squares!';
        }

        winnerOrDrawPresent = false;
      }

      if (e.target.tagName === 'TD' && tdChild.textContent === ''
            && turns < 10) {
        const index = parseInt(tdChild.id, 10);
        board[index] = 'X';
        tdChild.textContent = 'X';
        turns += 1;

        // Earliest win is in 5 turns and this function checks on turns 5-9
        if (turns > 4 && turns < 10) {
          if (checkForWin('X') || checkForWin('O')) {
            winnerOrDrawPresent = true;
            // Check if 3 wins reach and declare winner
            if (theWinner.isWinnerPresent()) theWinner.declareWinner();
            return;
          }
          // If no winners, then it's a draw
          if (turns === 9) {
            winnerOrDrawPresent = true;
            const winnerText = document.querySelector('#result-text');
            winnerText.textContent = "It's a draw!";
          }
        }

        // This is where the bot's "AI" is
        if (turns !== 9) {
          // Grabs a new array with all the index values of null in board,
          // where null represents an empty box
          const emptyBoxesArray = getAvailableBoxes();
          // Randomly choose an indice of the new array
          const indice = Math.floor(Math.random() * emptyBoxesArray.length);
          // Use the value in new array as index for the board array
          const botChoice = emptyBoxesArray[indice];

          board[botChoice] = 'O';
          const gameBox = document.querySelector('table');
          gameBox.getElementsByTagName('span')[botChoice].textContent = 'O';
          turns += 1;

          if (checkForWin('O')) {
            winnerOrDrawPresent = true;
            // Check if 3 wins reach and declare winner
            if (theWinner.isWinnerPresent()) theWinner.declareWinner();
          }
        }
      }
    });
  };

  return { checkBoardState };
};

const main = (() => {
  const startGame = () => {
    const human = PlayerScore();
    const bot = PlayerScore();

    const winningBeing = Winner(human, bot);

    const gameTime = GameBoard(winningBeing);
    gameTime.checkBoardState();
  };

  return { startGame };
})();

main.startGame();
