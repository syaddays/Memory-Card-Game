/**
 * Memory Card Game
 * A simple game where players match pairs of cards with identical symbols.
 */

// Card symbols (emojis)
const symbols = ['🍎', '🚗', '🐶', '🎵', '🌈', '⚽', '🎮', '🚀'];

// Game state variables
let flippedCards = [];
let matchedCount = 0;
let movesCount = 0;
let isProcessing = false;

// DOM elements
const gameContainer = document.querySelector('.game-container');
const restartBtn = document.getElementById('restart-btn');
const movesCounter = document.getElementById('moves-count');

/**
 * Shuffle array in place using Fisher–Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Create a card element with front and back faces
 * @param {string} symbol - The symbol to display on the card
 * @returns {HTMLElement} The card element
 */
function createCard(symbol) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('aria-label', 'Card');
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = symbol;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '?';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', flipCard);
    
    return card;
}

/**
 * Initialize or reset the game
 */
function initGame() {
    // Clear the game container
    gameContainer.innerHTML = '';
    
    // Reset game state
    flippedCards = [];
    matchedCount = 0;
    movesCount = 0;
    isProcessing = false;
    movesCounter.textContent = '0';
    
    // Create a deck with pairs of each symbol
    const cardSymbols = [...symbols, ...symbols];
    const shuffledSymbols = shuffle(cardSymbols);
    
    // Create and append cards to the game container
    shuffledSymbols.forEach(symbol => {
        const card = createCard(symbol);
        gameContainer.appendChild(card);
    });
}

/**
 * Handle card flip when clicked
 * @param {Event} event - The click event
 */
function flipCard(event) {
    if (isProcessing) return;
    
    const card = event.currentTarget;
    
    // Prevent flipping already matched or flipped cards
    if (card.classList.contains('matched') || card.classList.contains('flipped') || flippedCards.includes(card)) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check for a match if two cards are flipped
    if (flippedCards.length === 2) {
        movesCount++;
        movesCounter.textContent = movesCount.toString();
        checkForMatch();
    }
}

/**
 * Check if the two flipped cards match
 */
function checkForMatch() {
    isProcessing = true;
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-front').textContent;
    const symbol2 = card2.querySelector('.card-front').textContent;
    
    if (symbol1 === symbol2) {
        // Cards match
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.setAttribute('aria-label', `Matched card ${symbol1}`);
        card2.setAttribute('aria-label', `Matched card ${symbol2}`);
        matchedCount += 2;
        flippedCards = [];
        isProcessing = false;
        
        // Check if all cards are matched
        if (matchedCount === symbols.length * 2) {
            setTimeout(() => {
                alert(`Congratulations! You matched all cards in ${movesCount} moves!`);
            }, 500);
        }
    } else {
        // Cards don't match, flip them back after a delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

// Event listeners
restartBtn.addEventListener('click', initGame);
window.addEventListener('DOMContentLoaded', initGame);