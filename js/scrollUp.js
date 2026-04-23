const btn = document.getElementById("toTopBtn");

// Показывать кнопку при прокрутке вниз более чем на 200px
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
});

// Плавный скролл вверх
btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});