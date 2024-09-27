const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moveCount = 0;
let seconds = 0;
let timeLeft = 60;
let timerInterval, countdownInterval;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

const moveCounter = document.querySelector('.move-counter');
const timerElement = document.querySelector('.timer');
const countdownTimer = document.querySelector('.countdown-timer');
const restartButton = document.querySelector('.restart-btn');
const hintButton = document.querySelector('.hint-btn');
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const unflipSound = document.getElementById('unflip-sound');

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    flipSound.play();
    updateMoveCounter();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? (matchSound.play(), disableCards()) : unflipCards();
    if (document.querySelectorAll('.memory-card.flip').length === cards.length) {
        setTimeout(() => {
            alert(`Congratulations! You completed the game in ${moveCount} moves and ${seconds} seconds!`);
            stopTimer();
            updateLeaderboard();
        }, 500);
    }
}

function disableCards() {
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        unflipSound.play();
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

function updateMoveCounter() {
    moveCount++;
    moveCounter.textContent = `Moves: ${moveCount}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = `Time: ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startCountdown() {
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownTimer.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            alert('Time’s up! You lost.');
            restartGame();
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
}

function restartGame() {
    moveCount = 0;
    seconds = 0;
    timeLeft = 60;
    moveCounter.textContent = 'Moves: 0';
    timerElement.textContent = 'Time: 0s';
    countdownTimer.textContent = 'Time left: 60s';
    stopTimer();
    stopCountdown();
    shuffle();
    cards.forEach(card => {
        card.classList.remove('flip', 'match');
        card.addEventListener('click', flipCard);
    });
    startTimer();
    startCountdown();
}

function updateLeaderboard() {
    leaderboard.push({ moves: moveCount, time: seconds });
    leaderboard.sort((a, b) => a.time - b.time || a.moves - b.moves);
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 records
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboard
        .map(entry => `<li>Moves: ${entry.moves}, Time: ${entry.time}s</li>`)
        .join('');
}

function showHint() {
    cards.forEach(card => card.classList.add('flip'));
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('flip'));
    }, 2000); // Cards remain flipped for 2 seconds
}

hintButton.addEventListener('click', showHint);
restartButton.addEventListener('click', restartGame);

cards.forEach(card => card.addEventListener('click', flipCard));
shuffle();
displayLeaderboard();
startTimer();
startCountdown();