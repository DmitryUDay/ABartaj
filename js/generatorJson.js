// 
// Все списочки

const allFava = [
    { id: "location", name: "Локация" },
    { id: "search", name: "Поиск" },
    { id: "info", name: "Информация о пользователе" },
    { id: "shop", name: "Покупки" },
    { id: "network", name: "Интернет" },
    { id: "inditificator", name: "Идентификатор" },
    { id: "dataFiles", name: "Файлы" }
];

const allDevices = ["Xbox 360", "Xbox One", "Xbox Series X", "Xbox Series S",
    "PlayStation 1", "PlayStation 2", "PlayStation 3", "PlayStation 4", "PlayStation 5", "PSP", "PSP Vita", "PS VR",
    "Windows xp", "Windows 7", "Windows 8", "Windows 10", "Windows 11",
    "Android",
    "Linux",
    "GitHub",
    "Oculus quest 1", "Oculus quest 2", "Oculus quest pro", "Oculus quest 3", "Pico 4 Ultra", "Pico 4", "Pico Neo 3 Link",
    "Nintendo Switch", "Nintendo 3DS",
    "IOS", "Mac OS", "IPad", "Apple Watch",
];

const allLanguages = ["Русский", "Английский", "Китайский", "Испанский", "Хинди", "Арабский", "Португальский", "Французский", "Немецкий", "Японский", "Корейский",
    "Итальянский", "Турецкий", "Индонезийский", "Тайский", "Польский", "Украинский", "Нидерландский", "Шведский", "Казахский", "Белорусский", "Германский",
 ];
const allCategories = ["Хоррор", "Головоломка", "Экшен", "РПГ", "Приключения", "Открытый мир", "Платформер", "Шутер", "Стратегии", "Гонки", "Спорт", "Казуальные",
    "Выживание", "Жизнь", "Песочница", "Idle", "Симулятор", "Пазлы", "VR", "Музыкальная игра", "Ритм игра",
    "Драйвер",  "Социальные сети","Мессенджеры","Общение","Равзлечение","Фото и видео","Новости","Книги и чтение","Образование","Бизнес","Финансы","Покупки",
    "Еда и напитки","Путешествия","Навигация и карты","Транспорт","Здоровье и фитнес","Медицина","Сопрт","Производительность","Инструменты","Утилиты","Персонализация",
    "Лом и жилье","Родители и дети","Знакомства", "Работа с файлами", "Прошивка", "Драйвер", "Программатор",
];




let projectScreenshots = []; // Массив для хранения URL скриншотов
//




function mrGeneratorID(length = 20) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    return result;
}

let selectedFava = []; // Здесь храним объекты выбранных данных


const fInput = document.getElementById('favaInput');
const fSuggest = document.getElementById('favaSuggestions');
const fContainer = document.getElementById('favaTagsContainer');

// Поиск по списку (срабатывает при клике или вводе)
fInput.addEventListener('focus', showAllFava); // Показать всё при клике на поле
fInput.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    renderFavaSuggestions(q);
});

function showAllFava() {
    renderFavaSuggestions("");
}

function renderFavaSuggestions(query) {
    fSuggest.innerHTML = '';
    const filtered = allFava.filter(item => 
        (item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)) &&
        !selectedFava.find(s => s.id === item.id)
    );

    if (filtered.length > 0) {
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = item.name;
            div.onclick = () => {
                selectedFava.push(item);
                fInput.value = '';
                fSuggest.style.display = 'none';
                renderFavaTags();
            };
            fSuggest.appendChild(div);
        });
        fSuggest.style.display = 'block';
    } else {
        fSuggest.style.display = 'none';
    }
}

// Отрисовка тегов
function renderFavaTags() {
    fContainer.innerHTML = '';
    selectedFava.forEach((item, idx) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.style.background = '#ff9800'; // Сделаем их оранжевыми для отличия
        tag.innerHTML = `${item.name} <span onclick="selectedFava.splice(${idx}, 1); renderFavaTags();" style="cursor:pointer; margin-left:5px;">×</span>`;
        fContainer.appendChild(tag);
    });
}

// Закрытие списка если кликнули мимо
document.addEventListener('click', (e) => {
    if (!fInput.contains(e.target) && !fSuggest.contains(e.target)) {
        fSuggest.style.display = 'none';
    }
});

// ГЛОБАЛЬНЫЕ ДАННЫЕ
let selectedDevices = []; // Массив объектов {name, link}
let selectedLangs = [];
let selectedCategories = [];

/**
 * СБОР ДАННЫХ И КОПИРОВАНИЕ
 */
function buildAndCopyJSON() {
    const getV = id => document.getElementById(id)?.value.trim() || "";
    const inetCheckbox = document.getElementById('inetToggle');
    const inetValue = inetCheckbox && inetCheckbox.checked ? "yes" : "no";




    let searchVal = "";
    let filterTypeDisplay = ""; // Переименовал, чтобы не путать с инпутами
    const pType = getV('projectType');

    if (pType === 'game') {
        searchVal = 'game';
        filterTypeDisplay = 'Игры';
    } else if (pType === 'app') {
        searchVal = 'app';
        filterTypeDisplay = 'Утилиты';
    } else if (pType === 'bot') {
        searchVal = 'bot';
        filterTypeDisplay = 'Бот';
    } else if (pType === 'program') {
        searchVal = 'program';
        filterTypeDisplay = 'Программы';
    }


    const projectData = {
        idi: mrGeneratorID(20),
        name: getV('projectName'),
        description: getV('projectDescription'),
        icon: getV('iconPath'),
        imgScreen: projectScreenshots,
        buttonType: ['site', 'bot', 'web_app'].includes(getV('projectType')) ? 'Открыть' : 'Скачать',
        otziv: "0",
        star: "0",
        age: getV('ageLimit'),
        // developer: 'Guest',
        language: getV('mainLang'),
        languageKalivan: selectedLangs.length > 0 ? `+${selectedLangs.length} других` : "",
        version: getV('version'),
        // size: '???',
        sertificate: 'Да',
        siteDeveloper: getV('devSite'),
        policy: getV('polly'),
        supported: getV('tehSupport'),
        inet: 'no',
        alternatives: getV('alts').split(',').map(s => s.trim()).filter(s => s).join(', '),
        searchKategory: searchVal,
        tip: filterTypeDisplay,
        inet: inetValue,


        // Отладочные поля
        developer: getV('razrab'),
        size: getV('resizee'),



    };


    if (selectedFava.length > 0) {
        // Берем только ID (location, search...) и соединяем их
        projectData.fava = selectedFava.map(item => item.id).join(', ');
    }

    // ОБРАБОТКА УСТРОЙСТВ И ССЫЛОК
    if (selectedDevices.length > 0) {
        // deviceTy - строка через запятую
        projectData.deviceTy = selectedDevices.map(d => d.name).join(', ');

        // links - объект { "windows": "url" }
        projectData.links = {};
        selectedDevices.forEach(d => {
            const key = d.name.toLowerCase().replace(/\s+/g, ''); 
            projectData.links[key] = d.link || ""; 
        });
    }

    // КАТЕГОРИИ
    if (selectedCategories.length > 0) {
        projectData.kategory = selectedCategories.join(', ');
    }

    // ИСХОДНЫЙ КОД
    const sourceLinkValue = getV('sourceLink');
    if (sourceLinkValue) projectData.allCode = sourceLinkValue;

    // ОЧИСТКА ОТ ПУСТОТЫ
    Object.keys(projectData).forEach(key => {
        const val = projectData[key];
        if (val === "" || (Array.isArray(val) && val.length === 0)) {
            delete projectData[key];
        }
    });

    const finalJson = JSON.stringify(projectData, null, 4);

    navigator.clipboard.writeText(finalJson).then(() => {
        const status = document.getElementById('status');
        if (status) {
            status.style.color = '#00ff00';
            status.innerText = '✅ JSON скопирован!';
            setTimeout(() => { status.innerText = ''; }, 3000);
        }
    }).catch(err => alert('Ошибка: ' + err));
}

// --- ЛОГИКА ДЕВАЙСОВ ---

const dInput = document.getElementById('deviceInput');
const dSuggest = document.getElementById('searchSuggestions');
const dContainer = document.getElementById('deviceTagsContainer');

// Функция для сохранения введенных ссылок в массив ПЕРЕД перерисовкой
function syncDeviceLinks() {
    const inputs = dContainer.querySelectorAll('input[type="url"]');
    inputs.forEach((input, idx) => {
        if (selectedDevices[idx]) {
            selectedDevices[idx].link = input.value;
        }
    });
}

dInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    dSuggest.innerHTML = '';
    if (query.length < 2) { dSuggest.style.display = 'none'; return; }

    const filtered = allDevices.filter(d => 
        d.toLowerCase().includes(query) && !selectedDevices.find(sd => sd.name === d)
    );

    if (filtered.length > 0) {
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = item;
            div.onclick = () => addDeviceTag(item);
            dSuggest.appendChild(div);
        });
        dSuggest.style.display = 'block';
    } else { dSuggest.style.display = 'none'; }
});

function addDeviceTag(name) {
    syncDeviceLinks(); // СОХРАНЯЕМ ДАННЫЕ ПЕРЕД ДОБАВЛЕНИЕМ НОВОГО
    selectedDevices.push({ name: name, link: "" }); // ПУШИМ ОБЪЕКТ, А НЕ СТРОКУ
    dInput.value = '';
    dSuggest.style.display = 'none';
    renderDeviceTags();
}

function renderFavaTags() {
    fContainer.innerHTML = '';
    selectedFava.forEach((item, idx) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.style.background = '#ff9800'; // Оранжевый цвет для Fava
        tag.innerHTML = `${item.name} <span onclick="selectedFava.splice(${idx}, 1); renderFavaTags();" style="cursor:pointer; margin-left:5px;">×</span>`;
        fContainer.appendChild(tag);
    });

    // Если нужно сделать поле обязательным, раскомментируй строку ниже:
    // document.getElementById('favaValidator').value = selectedFava.length > 0 ? "ok" : "";
}

function renderDeviceTags() {
    dContainer.innerHTML = '';
    selectedDevices.forEach((dev, idx) => {
        const wrap = document.createElement('div');
        wrap.style = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px; background: #333; padding: 8px; border-radius: 8px; border: 1px solid #444;";
        wrap.innerHTML = `
            <div class="tag" style="margin:0; min-width: 140px; justify-content: center; background: #6231ff; color: white; padding: 5px; border-radius: 5px;">${dev.name}</div>
            <input type="url" placeholder="Ссылка для ${dev.name}" 
                   value="${dev.link || ''}" 
                   oninput="selectedDevices[${idx}].link = this.value"
                   style="flex-grow: 1; padding: 8px; background: #222; color: #fff; border: 1px solid #555; border-radius: 5px;">
            <span onclick="removeDeviceTag(${idx})" style="cursor:pointer; color: #ff4d4d; font-weight:bold; font-size: 20px;">×</span>
        `;
        dContainer.appendChild(wrap);
    });
}

function removeDeviceTag(idx) {
    syncDeviceLinks(); // СОХРАНЯЕМ ДАННЫЕ ПЕРЕД УДАЛЕНИЕМ
    selectedDevices.splice(idx, 1);
    renderDeviceTags();
}















// --- ЛОГИКА ЯЗЫКОВ ---
const lInput = document.getElementById('langInput');
const lSuggest = document.getElementById('langSuggestions');
const lContainer = document.getElementById('langTagsContainer');

lInput.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    lSuggest.innerHTML = '';
    if (q.length < 2) { lSuggest.style.display = 'none'; return; }
    const filtered = allLanguages.filter(l => l.toLowerCase().includes(q) && !selectedLangs.includes(l));
    filtered.forEach(lang => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = lang;
        div.onclick = () => { selectedLangs.push(lang); lInput.value = ''; lSuggest.style.display = 'none'; renderLangTags(); };
        lSuggest.appendChild(div);
    });
    lSuggest.style.display = filtered.length > 0 ? 'block' : 'none';
});

function renderLangTags() {
    lContainer.innerHTML = '';
    selectedLangs.forEach((lang, idx) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `${lang} <span onclick="selectedLangs.splice(${idx}, 1); renderLangTags();" style="cursor:pointer; color:red;">×</span>`;
        lContainer.appendChild(tag);
    });
}

// --- ЛОГИКА КАТЕГОРИЙ ---
const cInput = document.getElementById('cateInput');
const cSuggest = document.getElementById('cateSuggestions');
const cContainer = document.getElementById('cateTagsContainer');

cInput.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    cSuggest.innerHTML = '';
    if (q.length < 2) { cSuggest.style.display = 'none'; return; }
    const filtered = allCategories.filter(cat => cat.toLowerCase().includes(q) && !selectedCategories.includes(cat));
    filtered.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = cat;
        div.onclick = () => { selectedCategories.push(cat); cInput.value = ''; cSuggest.style.display = 'none'; renderCateTags(); };
        cSuggest.appendChild(div);
    });
    cSuggest.style.display = filtered.length > 0 ? 'block' : 'none';
});

function renderCateTags() {
    cContainer.innerHTML = '';
    selectedCategories.forEach((cat, idx) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `${cat} <span onclick="selectedCategories.splice(${idx}, 1); renderCateTags();" style="cursor:pointer; color:red;">×</span>`;
        cContainer.appendChild(tag);
    });
}

// ПРЕВЬЮ
function setupPreviews() {
    const iconInput = document.getElementById('iconPath');
    const iconPreview = document.getElementById('iconPreview');
    const imagesInput = document.getElementById('imagePaths');
    const imagesPreview = document.getElementById('imagesPreview');

    const createImg = (url, container) => {
        if (!url) return;
        const wrap = document.createElement('div');
        wrap.className = 'img-wrapper';
        // Добавляем класс delete-btn кнопке!
        wrap.innerHTML = `
            <img src="${url}">
            <button class="delete-btn" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(wrap);
    };

    iconInput.addEventListener('input', () => { iconPreview.innerHTML = ''; createImg(iconInput.value.trim(), iconPreview); });
    imagesInput.addEventListener('input', () => {
        imagesPreview.innerHTML = '';
        imagesInput.value.split(',').forEach(u => createImg(u.trim(), imagesPreview));
    });
}
setupPreviews();




function addScreenshot() {
    const input = document.getElementById('screenshotInput');
    const url = input.value.trim();

    if (url) {
        projectScreenshots.push(url);
        input.value = ''; // Очищаем поле
        renderScreenshots();
    }
}

// Позволяем добавлять по нажатию Enter
document.getElementById('screenshotInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addScreenshot();
    }
});

function renderScreenshots() {
    const container = document.getElementById('screenshotsWrapper');
    container.innerHTML = '';

    projectScreenshots.forEach((url, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'img-wrapper'; // Используем твой стиль из CSS
        wrap.innerHTML = `
            <img src="${url}" style="width:100px; height:60px; object-fit:cover; border-radius:10px; border: 2px solid #ffd54f;">
            <button class="delete-btn" onclick="removeScreenshot(${idx})" style="position: absolute; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; cursor: pointer; width: 20px; height: 20px; top: -5px; right: -5px;">×</button>
        `;
        wrap.style.position = 'relative';
        container.appendChild(wrap);
    });
}

function removeScreenshot(index) {
    projectScreenshots.splice(index, 1);
    renderScreenshots();
}