const userAvatar = document.querySelector(".client img");

if (userAvatar) {
    userAvatar.addEventListener("click", () => {
        // Если уже есть уведомление — не создаём новое
        if (document.querySelector(".guest-popup")) return;

        const popup = document.createElement("div");
        popup.className = "guest-popup";
        popup.innerHTML = `
            Да, это вы, <strong>Гость!</strong><br>
            Вы выглядите прекрасно сегодня!
        `;
        document.body.appendChild(popup);

        // Автоматически скрывается через 3 секунды
        setTimeout(() => {
            popup.classList.add("fade-out");
            setTimeout(() => popup.remove(), 400);
        }, 3000);
    });
}