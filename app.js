const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moveCount = 0;
let seconds = 0;
let timerInterval;
const moveCounter = document.querySelector('.move-counter');
const timerElement = document.querySelector('.timer');
const restartButton = document.querySelector('.restart-btn');

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
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
    isMatch ? disableCards() : unflipCards();
    if (document.querySelectorAll('.memory-card.flip').length === cards.length) {
        setTimeout(() => {
            alert(`Congratulations! You completed the game in ${moveCount} moves and ${seconds} seconds!`);
            stopTimer();
        }, 500);
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

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

function restartGame() {
    moveCount = 0;
    seconds = 0;
    moveCounter.textContent = 'Moves: 0';
    timerElement.textContent = 'Time: 0s';
    stopTimer();
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    shuffle();
}

cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restartGame);