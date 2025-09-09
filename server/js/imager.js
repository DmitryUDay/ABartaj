function goBack() {
    if (document.referrer) {
        window.history.back();
    } else {
        // Перейти на index.html с полной перезагрузкой
        window.location.replace("index.html");
    }
}