const PlayerScore = () => {
  let score = 0;

  const getScore = () => score;
  const incrementScore = () => { score += 1; };
  const resetScore = () => {
    score = 0;
    const [humanScore, botScore] = document.querySelectorAll('span');
    humanScore.textContent = '0';
    botScore.textContent = '0';
  };

  return { getScore, incrementScore, resetScore };
};

const Winner = (man, machine) => {
  // Composition by passing objects
  const getMan = () => man;
  const getMachine = () => machine;

  const declareWinner = (win) => {
    const winnerText = document.querySelector('p');
    if (win === 'human') winnerText.textContent = 'You won! Wooooo!';
    else if (win === 'bot') winnerText.textContent = 'The Bot won! Nooooo!';
  };

  // Game is best of 5 so 3 wins is all it takes
  const isWinnerPresent = () => {
    if (man.getScore() === 3) {
      declareWinner('human');
      return true;
    }
    if (machine.getScore() === 3) {
      declareWinner('bot');
      return true;
    }

    return false;
  };

  return { isWinnerPresent, getMan, getMachine };
};

const GameBoard = (theWinner) => {
  // More composition
  const samePlayer = theWinner.getMan();
  const sameBot = theWinner.getMachine();

  let turns = 1;

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

  const checkForWin = (char) => {
    const inARow = char.concat(char.concat(char));
    for (let i = 0; i < winCombo.length; ++i) {
      // winCombo acts as the index of board
      // Ex. winCombo[2][2] grabs the first array stored in the array and grabs
      //     the value, 8
      const a = board[winCombo[i][0]];
      const b = board[winCombo[i][1]];
      const c = board[winCombo[i][2]];

      // Concatenate all 3 board indices together into a string and remove
      // all commas
      const threeMarks = a.concat(b.concat(c)).toString().replace(/,/g, '');

      if (threeMarks === inARow) {
        if (char === 'X') {
          samePlayer.incrementScore();
          return true;
        }
        if (char === 'O') {
          sameBot.incrementScore();
          return true;
        }
      }
    }
    return false;
  };

  const resetBoardState = () => {
    board.forEach;
  };

  const checkBoardState = () => {
    const game = document.querySelector('table');

    game.addEventListener('click', (e) => {
      // Earliest win is in 5 turns and this function checks on turns 5-9
      if (turns > 4 && turns < 10) {
        if (checkForWin('X') && checkForWin('O')) {
          resetBoardState();
        }
      }

      // Check if 3 wins reach and declare winner
      if (theWinner.isWinnerPresent()) {
        return;
      }

      if (e.target.id.textContent === '' && turns < 9) {
        const index = parseInt(e.target.id, 10);
        board[index] = 'x';
        turns += 1;
      }
    });
  };

  return { checkBoardState };
};

const main = (() => {
  const human = PlayerScore();
  const bot = PlayerScore();

  const winningBeing = Winner(human, bot);

  const gameTime = GameBoard(winningBeing);
  gameTime.checkBoardState();
})();

main();
