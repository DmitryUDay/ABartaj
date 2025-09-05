document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('inputPole');
    const sendButton = document.getElementById('getRes');

    // Обработчик события при нажатии Enter
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            showAlert();
        }
    });

    // Обработчик события при клике на кнопку
    sendButton.addEventListener('click', showAlert);

    function showAlert() {
        const value = searchInput.value.trim(); // Получаем значение из инпута и убираем лишние пробелы
        if (value !== '') {
            alert(`Не удалось подлючится к службам UCloud`); // Выводим значение в алерт
        } else {
            alert('Для начала давайте введем, что будем искать'); // Если поле пустое, выводим сообщение об ошибке
        }
    }
});