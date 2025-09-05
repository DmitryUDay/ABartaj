window.addEventListener('scroll', function() {
    const textElement = document.querySelector('.text-element');
    const body = document.querySelector('body');
    
    if (window.scrollY > 10) { // Измените это значение по необходимости
    body.classList.add('scrolled');
    } else {
    body.classList.remove('scrolled');
    }
});