document.addEventListener("DOMContentLoaded", () => {
    // --- Меню ---
    const openBtn = document.getElementById('menu-open');
    const closeBtn = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');

    if (openBtn && closeBtn && sideMenu) {
        openBtn.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });
        closeBtn.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });
    }

    // --- Подсказки с эффектом печати ---
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const phrases = [
        "Что будем искать?",
        "DUGA",
        "Мореход",
        "Бот рудольф",
        "Порт салли фейс",
        "Рус линк",
        "UOS-dev",
        "iso2god",

    ];
    let index = 0;
    let charIndex = 0;
    let typingSpeed = 100;
    let delayBetweenPhrases = 1500;

    function typePhrase() {
        const currentPhrase = phrases[index];
        if (!searchInput.value) searchInput.placeholder = currentPhrase.substring(0, charIndex);
        charIndex++;
        if (charIndex <= currentPhrase.length) {
            setTimeout(typePhrase, typingSpeed);
        } else {
            setTimeout(erasePhrase, delayBetweenPhrases);
        }
    }
    function erasePhrase() {
        const currentPhrase = phrases[index];
        charIndex--;
        if (!searchInput.value) searchInput.placeholder = currentPhrase.substring(0, charIndex);
        if (charIndex > 0) {
            setTimeout(erasePhrase, typingSpeed / 2);
        } else {
            index = (index + 1) % phrases.length;
            setTimeout(typePhrase, typingSpeed);
        }
    }
    typePhrase();

    // --- Подгрузка карточек ---
    let allApps = [];
let visibleCount = 4;
const increment = 1;

const container = document.getElementById("projectsContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// Загружаем JSON
fetch("app.json")
  .then(res => res.json())
  .then(data => {
    allApps = data;
    renderCategories();
  });

function renderCategories() {
  container.innerHTML = "";

  const grouped = {};
  allApps.forEach(app => {
    const cat = app.searchKategory || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(app);
  });

  const catNames = {
    game: "Игры",
    program: "Програмное обеспечение",
    bot: "Боты",
    app: "Программы",
    shev: "Веб приложения",
    sites: "Сайты",
    plug: "Плагины",
    runFile: "Исполняемые файлы",
    other: "Другое"
  };

  Object.keys(grouped).forEach(category => {
    const apps = grouped[category].slice(0, 20);

    const categoryBlock = document.createElement("div");
    categoryBlock.className = "category-block";

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = (catNames[category] || category) + " >";

    // 🔗 Клик по категории = переход на madamaBuilder.html
    title.addEventListener("click", () => {
      window.location.href = `madamaBuilder.html?category=${encodeURIComponent(category)}`;
    });

    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "scroll-wrapper";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "category-scroll";

    // Стрелки
    const btnLeft = document.createElement("button");
    btnLeft.className = "scroll-btn left";
    btnLeft.innerHTML = "&#9664;";

    const btnRight = document.createElement("button");
    btnRight.className = "scroll-btn right";
    btnRight.innerHTML = "&#9654;";

    // Добавляем карточки
    apps.forEach(app => {
        const card = document.createElement("div");
        card.className = "project-card";

        // Оборачиваем ВООБЩЕ ВСЁ содержимое в один <a>
        card.innerHTML = `
            <a href="MrBuilder.html?project=${encodeURIComponent(app.name + '%' + app.idi)}" class="card-link">
                <div class="icon-blur-bg" style="background-image: url('${app.icon}')"></div>
                <img class="icon" src="${app.icon}" alt="${app.name}" onerror="this.onerror=null; this.src='server/404.png';">
                <div class="card-text">
                    <b><h3>${app.name}</h3></b>
                    <p style="color: gray;">${app.description}</p>
                </div>
                <div class="project-info">
                    <span>©${app.developer.replace(/©/g, '')}</span>
                    <span>${app.age}</span>
                </div>
            </a>
        `;
        scrollContainer.appendChild(card);
    });

    // Собираем всё
    scrollWrapper.appendChild(btnLeft);
    scrollWrapper.appendChild(scrollContainer);
    scrollWrapper.appendChild(btnRight);
    categoryBlock.appendChild(title);
    categoryBlock.appendChild(scrollWrapper);
    container.appendChild(categoryBlock);

    // Функция проверки: нужно ли показывать стрелки
    function updateArrowVisibility() {
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        const scrollLeft = scrollContainer.scrollLeft;

        // Контента меньше или ровно столько же — стрелки не нужны
        const needArrows = scrollWidth > clientWidth + 1;

        if (!needArrows) {
            btnLeft.classList.remove("show");
            btnRight.classList.remove("show");
            return;
        }

        // Показывать левую стрелку, если есть куда скроллить влево
        btnLeft.classList.toggle("show", scrollLeft > 10);

        // Показывать правую стрелку, если есть куда скроллить вправо
        btnRight.classList.toggle(
            "show",
            scrollLeft + clientWidth < scrollWidth - 10
        );
    }

    // Добавляем события на стрелки
    btnLeft.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
    });
    btnRight.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
    });

    // Обновляем стрелки при прокрутке и изменении размера окна
    scrollContainer.addEventListener("scroll", updateArrowVisibility);
    window.addEventListener("resize", updateArrowVisibility);

    // Первый вызов после отрисовки
    setTimeout(updateArrowVisibility, 200);

    // Небольшой сдвиг влево на телефонах
    if (window.innerWidth < 768) {
      setTimeout(() => {
        scrollContainer.scrollLeft = 30;
        updateArrowVisibility();
      }, 250);
    }
  });
}

// // Обработчик кнопки "Показать ещё"
// loadMoreBtn.addEventListener("click", () => {
//     visibleCount += increment;
//     renderCards();
// });

    // --- Поиск ---
    const searchResultsContainer = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    
    // Очищаем результаты сразу, чтобы старые данные не висели
    searchResultsContainer.innerHTML = "";

    // --- НАШЕ ОГРАНИЧЕНИЕ ---
    // Если введено меньше 2 символов — скрываем контейнер и выходим из функции
    if (query.length < 2) {
        searchResultsContainer.style.display = "none";
        return;
    }

    // Фильтруем проекты с учетом alternatives
    const matchedApps = allApps.filter(app => {
        const options = app.alternatives
            ? app.alternatives.split(",").map(s => s.trim().toLowerCase())
            : [];
        options.push(app.name.toLowerCase());
        return options.some(opt => opt.includes(query));
    });

    const limit = 4;

    if (matchedApps.length === 0) {
        searchResultsContainer.innerHTML = `<p style="color:black; padding: 10px;">Не нашлось подходящих результатов</p>`;
    } else {
        matchedApps.slice(0, limit).forEach(app => {
            const resultItem = document.createElement("div");
            resultItem.className = "search-result-item";

            resultItem.innerHTML = `
                <div class="result-inner">
                    <img src="${app.icon}" alt="${app.name}" class="result-icon">
                    <span class="result-text">${app.name}</span>
                </div>
            `;

            resultItem.addEventListener("click", () => {
                window.location.href = `MrBuilder.html?project=${encodeURIComponent(app.name + '%' + app.idi)}`;
            });

            searchResultsContainer.appendChild(resultItem);
        });

        // Кнопка "Показать ещё", если результатов больше лимита
        if (matchedApps.length > limit) {
            const remaining = matchedApps.length - limit;
            const showMoreBtn = document.createElement("button");
            showMoreBtn.textContent = `Показать ещё +${remaining}`;
            showMoreBtn.classList.add("show-more-btn");
            showMoreBtn.style.margin = "10px auto"; // Немного стилей для красоты
            showMoreBtn.addEventListener("click", () => {
                // Тут можно либо открыть страницу поиска, либо вывести все результаты
                window.location.href = `madamaBuilder.html?search=${encodeURIComponent(query)}`;
            });
            searchResultsContainer.appendChild(showMoreBtn);
        }
    }

    searchResultsContainer.style.display = "block";
});
});





//Скрывает кнопку добавления на носимых девайсах
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
const button = document.getElementById('btnADD');
if (isMobile()) {
    button.style.display = 'none';
} else {
    button.style.display = 'block';
}




//Отвечает за блюр и прозрачность шапки сайта при прокручивании
window.addEventListener("scroll", () => {
  const header = document.querySelector(".homebrew");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});