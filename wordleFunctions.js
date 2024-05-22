let currentPosition = 1;
let currentRow = 1;
let letters = [4];
let keyboardValid = false;

// for keyboard input
document.addEventListener('keydown', function(event) {
  if (event.key.match(/[a-zA-Z]/) && event.key != 'Backspace' && event.key != 'Enter') {
      addLetter(event.key.toLowerCase(), currentPosition, currentRow); 
  } else if (event.key === 'Backspace') {
    removeLetter(currentPosition, currentRow);
  } else if (event.key === 'Enter') {
    submit(letters);
  }
});

function transitionTo(screenId) {
  console.log("Now showing game screen.")
  var screens = document.querySelectorAll('.screen');
  screens.forEach(function(screen) {
    screen.classList.remove('active-screen');
  });
  var selectedScreen = document.getElementById(screenId);
  selectedScreen.classList.add('active-screen');  
}

function changeBackgroundColor(color) {
  console.log("Background color changed to: %d", color);
  document.body.style.backgroundColor = color;
}

function getDate() {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var curDate = new Date();
  var namedMonth = months[curDate.getMonth()];
  var formattedDate =  namedMonth + " " + curDate.getDate() + ", " + curDate.getFullYear();
  document.getElementById('footerDate').innerText = formattedDate;
}

function addLetter(letter, position, row) {
  if (position < 6) {
    console.log('Adding letter:', letter, 'to position:', position, 'and row: ', row);
    document.getElementById('tileText_' + position + '_' + row).innerText = letter;
  
    let tile = document.getElementById('tileText_' + position + '_' + row);
    tile.style.borderColor = '#545458';

    letters[position - 1] = letter;
    currentPosition++;

    impactAnimation(tile);

  } else {
    return;
  }
  console.log(letters);
}

function removeLetter(position, row) {
  if (position > 1) {
    console.log('Removed from position:', position - 1);
    document.getElementById('tileText_' + --position + '_' + row).innerText = '';
    
    let tile = document.getElementById('tileText_' + position + '_' + row);
    tile.style.borderColor = '#3a3a3c';
  
    letters[position - 1] = null;
    currentPosition--;
  } else {
    return;
  }
  console.log(letters);
}

function validGuess() {
  if (letters.includes(null) || letters.length != 5) {
    console.log("Fill in all blanks");
    return false;
  }

  if (!validWords.includes(letters.join(''))) {
    console.log("Word not in list")

    return false;
  }
  return true;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function computeGuess(guess) {
  let correctString = correct;
  let correctArray = correct.split('');
  let guessArray = Array.from(guess);
  let correctCounts = {};
  let guessCounts = {};

  for (let letter of correctArray) {
    correctCounts[letter] = (correctCounts[letter] || 0) + 1;
  }
  console.log(correctCounts);

  for (let i = 0; i < guessArray.length; i++) {
    let tile = document.getElementById("tileText_" + (i + 1) + "_" + currentRow);
    let guessLetter = guessArray[i];
    let correctLetter = correctArray[i];
    guessCounts[guessLetter] = (guessCounts[guessLetter] || 0) + 1;

    if (correctString.includes(guessLetter)) {
      if (guessLetter === correctLetter) {
        tile.style.backgroundColor = '#548c4c';
        tile.style.borderColor = '#548c4c';

        let key = document.getElementById("button_" + guessLetter);
        key.style.backgroundColor = '#548c4c';

      } else if (guessCounts[guessLetter] <= correctCounts[guessLetter]) {
        tile.style.backgroundColor = '#b59f3b';
        tile.style.borderColor = '#b59f3b';
        console.log(guessCounts);
      } else {
        tile.style.backgroundColor = '#3a3a3c';
        tile.style.borderColor = '#3a3a3c';
      }
    } else {
      tile.style.backgroundColor = '#3a3a3c';
      // for keyboard
      let key = document.getElementById("button_" + guessLetter);
      key.style.backgroundColor = '#3a3a3c';
      tile.style.borderColor = '#3a3a3c';
    }
  }
}

function findIndices(arr, letter) {
  let indices = [];
  for (let i = 0; i < arr.length; i++) {
      if (arr[i] === letter) {
          indices.push(i);
      }
  }
  return indices;
}

function letterOccurrenceWordle(string, letter) {
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) == letter) {
      count++;
    }
  }
  return count;
}

async function submit(guess) {
  // Disable keyboard input
  document.addEventListener('keydown', preventDefaultHandler);
  
  if (validGuess(guess)) {
      await animateRowAndWait(currentRow);
      computeGuess(guess);
      currentPosition = 1;
      currentRow++;

      letters.fill(null);
      console.log("currentRow: %d", currentRow);
  }
  
  // Re-enable keyboard input
  document.removeEventListener('keydown', preventDefaultHandler);
}

function preventDefaultHandler(event) {
  event.preventDefault();
}

function disableKeyboard() {
  document.addEventListener('keydown', function(event) {
    event.preventDefault();
  });
}

function impactAnimation(tile) {
  tile.classList.add('enlarged');
  setTimeout(() => {
    tile.classList.remove('enlarged');
  }, 50); 
}

function animateRowAndWait(row) {
  return new Promise(resolve => {
    const delays = [0, 400, 800, 1200, 1600];
    let completedAnimations = 0;

    const onAnimationEnd = () => {
      completedAnimations++;
      if (completedAnimations === 5) {
        resolve();
      }
    };

    for (let i = 0; i < 5; i++) {
      let tile = document.getElementById('tileText_' + (i + 1) + '_' + row);
      tile.classList.add('flip-animation');
      tile.style.animationDelay = delays[i] + 'ms';
      tile.addEventListener('animationend', onAnimationEnd);
    }
  });
}