const favBtn = document.querySelector('.btn-fav');

function getFavorites() {
    const favs = localStorage.getItem('myFavorites');
    return favs ? favs.split(',') : [];
}

function checkFavStatus() {
    if (!idi) return; // Если айди нет, выходим
    
    const favorites = getFavorites();
    if (favorites.includes(idi)) {
        favBtn.classList.add('active');
        favBtn.textContent = '★'; // Закрашенная
    } else {
        favBtn.classList.remove('active');
        favBtn.textContent = '☆'; // Пустая
    }
}

function toggleFavorite() {
    if (!idi) return;

    let favorites = getFavorites();

    if (favorites.includes(idi)) {
        favorites = favorites.filter(id => id !== idi);
        favBtn.classList.remove('active');
        favBtn.textContent = '☆';
        console.log("Удалено из избранного");
    } else {
        // Если нет — добавляем
        favorites.push(idi);
        favBtn.classList.add('active');
        favBtn.textContent = '★';
        console.log("Добавлено в избранное");
    }

    localStorage.setItem('myFavorites', favorites.join(','));
}

if (favBtn) {
    favBtn.onclick = toggleFavorite;
}