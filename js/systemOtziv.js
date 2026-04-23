const openBtn = document.getElementById('openBubble');
const closeBtn = document.getElementById('closeBubble');
const bubble = document.getElementById('bubbleForm');

openBtn.addEventListener('click', () => {
    bubble.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    bubble.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === bubble) {
    bubble.classList.remove('active');
    }
});

document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Спасибо за отзыв!");
    bubble.classList.remove('active');
    e.target.reset();
});