function goBack() {
    if (document.referrer) {
        // Если есть предыдущая страница в истории
        window.history.back();
    } else {
        // Если нет истории — перенаправляем на главную
        window.location.href = "index.html";
    }
}