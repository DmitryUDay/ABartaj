function renderRecs(currentApp, allData) {
    const container = document.getElementById("recommendationsBox");
    if (!container) return;

    const targetCat = currentApp.tip.toLowerCase().trim();

    // Фильтруем похожие
    let recs = allData.filter(item => {
        const isNotSame = item.idi !== currentApp.idi;
        const itemCat = item.tip.toLowerCase().trim();
        // Ищем совпадение жанров
        return isNotSame && (itemCat.includes(targetCat) || targetCat.includes(itemCat));
    }).slice(0, 10);

    // Если по жанру пусто — да пошло оно нахер, берем любые другие 5 штук
    if (recs.length === 0) {
        recs = allData.filter(item => item.idi !== currentApp.idi).sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    container.innerHTML = '';

    recs.forEach(item => {
        // Формируем ссылку: Имя%ID
        const link = `MrBuilder.html?project=${encodeURIComponent(item.name)}%${item.idi}`;

        const card = document.createElement('a');
        card.href = link;
        card.className = 'mini-card';
        card.innerHTML = `
            <img src="${item.icon}" alt="${item.name}" onerror="this.src='server/userIcon.png'">
            <div class="name">${item.name}</div>
            <div class="rating">★ ${item.star}</div>
        `;
        container.appendChild(card);
    });
}