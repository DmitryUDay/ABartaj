// Все списочки (такие же как в generatorJson.js)
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
    "Oculus quest 2", "Oculus quest 3", "Pico 4 Ultra", "Pico 4", "Pico Neo 3 Link",
    "Nintendo Switch", "Nintendo 3DS",
    "IOS", "Mac OS", "IPad", "Apple Watch",
];

const allLanguages = ["Русский", "Английский", "Китайский", "Испанский", "Хинди", "Арабский", "Португальский", "Французский", "Немецкий", "Японский", "Корейский",
    "Итальянский", "Турецкий", "Индонезийский", "Тайский", "Польский", "Украинский", "Нидерландский", "Шведский", "Казахский", "Белорусский", "Германский",
];

const allCategories = ["Хоррор", "Головоломка", "Экшен", "РПГ", "Приключения", "Открытый мир", "Платформер", "Шутер", "Стратегии", "Гонки", "Спорт", "Казуальные",
    "Выживание", "Жизнь", "Песочница", "Idle", "Симулятор", "Пазлы", "VR", "Музыкальная игра", "Ритм игра",
    "Драйвер", "Социальные сети", "Мессенджеры", "Общение", "Равзлечение", "Фото и видео", "Новости", "Книги и чтение", "Образование", "Бизнес", "Финансы", "Покупки",
    "Еда и напитки", "Путешествия", "Навигация и карты", "Транспорт", "Здоровье и фитнес", "Медицина", "Сопрт", "Производительность", "Инструменты", "Утилиты", "Персонализация",
    "Лом и жилье", "Родители и дети", "Знакомства", "Работа с файлами", "Прошивка", "Драйвер", "Программатор",
];

// Глобальные переменные для хранения данных
let currentProjectId = null;
let projectScreenshots = [];
let selectedFava = [];
let selectedDevices = [];
let selectedLangs = [];
let selectedCategories = [];
let originalProject = null;

// Функция загрузки app.json
async function loadAppJson() {
    try {
        const response = await fetch('app.json');
        if (!response.ok) throw new Error('Не удалось загрузить app.json');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки app.json:', error);
        return [];
    }
}

// Показать все проекты в модальном окне
async function showAllProjects() {
    const listDiv = document.getElementById('projectList');
    const projects = await loadAppJson();
    
    if (projects.length === 0) {
        listDiv.innerHTML = '<p style="color: #ff4444;">Проекты не найдены</p>';
        listDiv.style.display = 'block';
        return;
    }

    listDiv.innerHTML = '';
    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'project-list-item';
        div.innerHTML = `
            <h3>${project.name}</h3>
            <p>ID: ${project.idi}</p>
            <p>Тип: ${project.tip || 'Не указан'} | Версия: ${project.version}</p>
        `;
        div.onclick = () => {
            document.getElementById('projectIdInput').value = project.idi;
            listDiv.style.display = 'none';
            loadProject();
        };
        listDiv.appendChild(div);
    });
    
    listDiv.style.display = 'block';
}

// Загрузка проекта по ID
async function loadProject() {
    const idInput = document.getElementById('projectIdInput');
    const errorP = document.getElementById('modalError');
    const projectId = idInput.value.trim();

    if (!projectId) {
        errorP.textContent = 'Введите ID проекта';
        errorP.style.display = 'block';
        return;
    }

    const projects = await loadAppJson();
    const project = projects.find(p => p.idi === projectId);

    if (!project) {
        errorP.textContent = 'Проект с таким ID не найден';
        errorP.style.display = 'block';
        return;
    }

    errorP.style.display = 'none';
    currentProjectId = project.idi;
    originalProject = JSON.parse(JSON.stringify(project));
    
    // Заполняем форму данными проекта
    populateForm(project);
    
    // Скрываем модалку и показываем редактор
    document.getElementById('idModal').style.display = 'none';
    document.getElementById('editorContainer').style.display = 'block';
    document.getElementById('generateWrapper').style.display = 'flex';
    document.getElementById('currentId').textContent = project.idi;
}

// Заполнение формы данными
function populateForm(project) {
    // Основные поля
    document.getElementById('projectName').value = project.name || '';
    document.getElementById('iconPath').value = project.icon || '';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('ageLimit').value = project.age || '0+';
    document.getElementById('version').value = project.version || '';
    document.getElementById('mainLang').value = project.language || 'Русский';
    document.getElementById('alts').value = project.alternatives || '';
    
    // Тип проекта
    const typeMap = {
        'game': 'game',
        'Игры': 'game',
        'bot': 'program',
        'app': 'app',
        'program': 'program',
        'Программы': 'program'
    };
    
    const projectType = typeMap[project.searchKategory] || 'app';
    document.getElementById('projectType').value = projectType;

    // Обработка скриншотов
    projectScreenshots = [];
    if (project.imgScreen) {
        if (Array.isArray(project.imgScreen)) {
            projectScreenshots = [...project.imgScreen];
        } else if (typeof project.imgScreen === 'string') {
            projectScreenshots = project.imgScreen.split(',').map(s => s.trim()).filter(s => s);
        }
    }
    renderScreenshots();

    // Обработка категорий
    selectedCategories = [];
    if (project.kategory) {
        selectedCategories = project.kategory.split(',').map(c => c.trim());
    }
    renderCateTags();

    // Обработка устройств
    selectedDevices = [];
    if (project.device) {
        project.device.forEach(deviceName => {
            const linkKey = deviceName.toLowerCase().replace(/\s+/g, '');
            const link = project.links ? project.links[linkKey] || '' : '';
            selectedDevices.push({ name: deviceName, link: link });
        });
    }
    renderDeviceTags();

    // Обработка языков
    selectedLangs = [];
    if (project.languageKalivan) {
        const match = project.languageKalivan.match(/\d+/);
        if (match && parseInt(match[0]) > 0) {
            // Если указано количество дополнительных языков, но не сами языки,
            // просто отмечаем что они есть
        }
    }
    renderLangTags();

    // Обработка Fava
    selectedFava = [];
    if (project.fava) {
        const favaList = project.fava.split(',').map(f => f.trim());
        favaList.forEach(favaId => {
            const found = allFava.find(f => f.id === favaId);
            if (found) selectedFava.push(found);
        });
    }
    renderFavaTags();

    // URL и дополнительные поля
    document.getElementById('devSite').value = project.siteDeveloper || '';
    document.getElementById('tehSupport').value = project.supported || '';
    document.getElementById('polly').value = project.policy || '';
    document.getElementById('sourceLink').value = project.allCode || '';
    
    // Интернет
    document.getElementById('inetToggle').checked = project.inet === 'yes';

    // Поля отладки
    document.getElementById('razrab').value = project.developer || '';
    document.getElementById('resizee').value = project.size || '';
    document.getElementById('otzivInput').value = project.otziv || '0';
    document.getElementById('starInput').value = project.star || '0';
    document.getElementById('updateTextInput').value = project.updateText || '';
    document.getElementById('updatedInput').value = project.updated || '';

    // Превью иконки
    updateIconPreview(project.icon);
}

// Обновление превью иконки
function updateIconPreview(url) {
    const preview = document.getElementById('iconPreview');
    preview.innerHTML = '';
    if (url) {
        const wrap = document.createElement('div');
        wrap.className = 'img-wrapper';
        wrap.style.position = 'relative';
        wrap.innerHTML = `
            <img src="${url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; border: 2px solid #ffd54f;">
        `;
        preview.appendChild(wrap);
    }
}

// СЛУШАТЕЛЬ ДЛЯ ПРЕВЬЮ ИКОНКИ
document.getElementById('iconPath').addEventListener('input', function() {
    updateIconPreview(this.value.trim());
});

// ФУНКЦИЯ ГЕНЕРАЦИИ ID
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

// --- УПРАВЛЕНИЕ СКРИНШОТАМИ ---
function addScreenshot() {
    const input = document.getElementById('screenshotInput');
    const url = input.value.trim();
    if (url) {
        projectScreenshots.push(url);
        input.value = '';
        renderScreenshots();
    }
}

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
        wrap.className = 'img-wrapper';
        wrap.style.position = 'relative';
        wrap.innerHTML = `
            <img src="${url}" style="width:100px; height:60px; object-fit:cover; border-radius:10px; border: 2px solid #ffd54f;">
            <button onclick="removeScreenshot(${idx})" style="position: absolute; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; cursor: pointer; width: 20px; height: 20px; top: -5px; right: -5px;">×</button>
        `;
        container.appendChild(wrap);
    });
}

function removeScreenshot(index) {
    projectScreenshots.splice(index, 1);
    renderScreenshots();
}

// --- ЛОГИКА FAVA ---
const fInput = document.getElementById('favaInput');
const fSuggest = document.getElementById('favaSuggestions');
const fContainer = document.getElementById('favaTagsContainer');

fInput.addEventListener('focus', showAllFava);
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

function renderFavaTags() {
    fContainer.innerHTML = '';
    selectedFava.forEach((item, idx) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.style.background = '#ff9800';
        tag.innerHTML = `${item.name} <span onclick="selectedFava.splice(${idx}, 1); renderFavaTags();" style="cursor:pointer; margin-left:5px;">×</span>`;
        fContainer.appendChild(tag);
    });
}

document.addEventListener('click', (e) => {
    if (!fInput.contains(e.target) && !fSuggest.contains(e.target)) {
        fSuggest.style.display = 'none';
    }
});

// --- ЛОГИКА ДЕВАЙСОВ ---
const dInput = document.getElementById('deviceInput');
const dSuggest = document.getElementById('searchSuggestions');
const dContainer = document.getElementById('deviceTagsContainer');

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
    syncDeviceLinks();
    selectedDevices.push({ name: name, link: "" });
    dInput.value = '';
    dSuggest.style.display = 'none';
    renderDeviceTags();
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
    syncDeviceLinks();
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

// --- ГЕНЕРАЦИЯ И КОПИРОВАНИЕ JSON ---
function buildAndCopyJSON() {
    const getV = id => document.getElementById(id)?.value.trim() || "";
    const inetCheckbox = document.getElementById('inetToggle');
    const inetValue = inetCheckbox && inetCheckbox.checked ? "yes" : "no";

    let searchVal = "";
    let filterTypeDisplay = "";
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

    // Сохраняем ID оригинального проекта
    const projectData = {
        idi: currentProjectId || mrGeneratorID(20),
        name: getV('projectName'),
        description: getV('projectDescription'),
        icon: getV('iconPath'),
        imgScreen: projectScreenshots,
        buttonType: ['site', 'bot', 'web_app'].includes(getV('projectType')) ? 'Открыть' : 'Скачать',
        otziv: getV('otzivInput') || "0",
        star: getV('starInput') || "0",
        age: getV('ageLimit'),
        language: getV('mainLang'),
        languageKalivan: selectedLangs.length > 0 ? `+${selectedLangs.length} других` : "",
        version: getV('version'),
        sertificate: 'Да',
        siteDeveloper: getV('devSite'),
        policy: getV('polly'),
        supported: getV('tehSupport'),
        alternatives: getV('alts').split(',').map(s => s.trim()).filter(s => s).join(', '),
        searchKategory: searchVal,
        tip: filterTypeDisplay,
        inet: inetValue,
        developer: getV('razrab'),
        size: getV('resizee'),
        updated: getV('updatedInput'),
        updateText: getV('updateTextInput'),
    };

    // Добавляем fava
    if (selectedFava.length > 0) {
        projectData.fava = selectedFava.map(item => item.id).join(',');
    }

    // Добавляем устройства и ссылки
    if (selectedDevices.length > 0) {
        projectData.deviceTy = selectedDevices.map(d => d.name).join(', ');
        projectData.device = selectedDevices.map(d => d.name);
        projectData.links = {};
        selectedDevices.forEach(d => {
            const key = d.name.toLowerCase().replace(/\s+/g, '');
            if (d.link) {
                projectData.links[key] = d.link;
            }
        });
        
        // Если нет ссылок, удаляем объект links
        if (Object.keys(projectData.links).length === 0) {
            delete projectData.links;
        }
    }

    // Добавляем категории
    if (selectedCategories.length > 0) {
        projectData.kategory = selectedCategories.join(', ');
    }

    // Исходный код
    const sourceLinkValue = getV('sourceLink');
    if (sourceLinkValue) projectData.allCode = sourceLinkValue;

    // Очистка от пустых полей
    Object.keys(projectData).forEach(key => {
        const val = projectData[key];
        if (val === "" || val === undefined || val === null || (Array.isArray(val) && val.length === 0)) {
            delete projectData[key];
        }
    });

    const finalJson = JSON.stringify(projectData, null, 4);

    navigator.clipboard.writeText(finalJson).then(() => {
        alert('✅ Обновлённый JSON скопирован в буфер обмена!');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        // Создаем временное текстовое поле для копирования
        const textarea = document.createElement('textarea');
        textarea.value = finalJson;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ JSON скопирован (альтернативный метод)');
    });
}

// Показываем модальное окно при загрузке
document.getElementById('idModal').style.display = 'flex';