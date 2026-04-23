function copyLink() {
    const url = window.location.href;
    const tempInput = document.createElement("textarea");
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
        document.execCommand("copy");
        
        const toast = document.getElementById("copyToast");
        const progress = document.getElementById("progressLine");

        // Показываем плашку
        toast.classList.add("show");

        // Запускаем полоску (3 секунды)
        if (progress) {
            progress.style.animation = 'none';
            progress.offsetHeight; // Хайп для перезапуска анимации
            progress.style.animation = 'progress-burn 3s linear forwards';
        }

        // Скрываем через 3 секунды без редиректа
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);

    } catch (err) {
        console.error("Ошибка копирования:", err);
    }

    document.body.removeChild(tempInput);
}