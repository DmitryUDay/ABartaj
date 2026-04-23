// --- Подгрузка Json ---
function paintStars(ratingStr) {
    try{
        let normalized = ratingStr.replace(',', '.');
        let starsValue = parseFloat(normalized);
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, idx) => {
            const starIndex = idx + 1;
            let rawFill = starsValue - starIndex + 1;
            let clamped = Math.min(Math.max(rawFill, 0), 1);
            let fillPercent = clamped * 100;
            star.style.setProperty('--fill', fillPercent + '%');
        });
    }catch(err){
        //типо заглушка
    }
}
// --- Картинки ---

let ptc = 0;
let imgPatch = [];
const modal = document.getElementById("zoomModal");
const modalImg = document.getElementById("zoomImage");

function openZoom(src) {
modalImg.src = src;
modal.classList.add("show");
document.body.style.overflow = "hidden";
}

function closeZoom() {
modal.classList.remove("show");
setTimeout(() => {
    modalImg.src = "";
    document.body.style.overflow = "auto";
}, 300);
}

modal.addEventListener("click", (e) => {
if (e.target === modal || e.target === modalImg) closeZoom();
});


function setimg(src) {
    const container = document.getElementById("imaga");
    
    // Если контейнера нет в DOM, выходим, чтобы не плодить ошибки
    if (!container) {
        console.error("Контейнер #imaga не найден!");
        return;
    }

    // Чистим старое содержимое
    container.innerHTML = '';
    container.classList.remove('video-bg');

    // ЛЕЧИМ ОШИБКУ: Проверяем, что src вообще пришел и это строка
    if (!src || typeof src !== 'string') {
        console.warn("В setimg пришла пустая ссылка или не строка:", src);
        return; 
    }

    const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
    const isVK = src.includes("vk.com/video");

    if (isYouTube || isVK) {
        container.classList.add('video-bg');

        let iframe = document.createElement("iframe");
        
        // Маленький хак для YouTube: если ссылка обычная, лучше её конвертнуть в /embed/
        let finalSrc = src;
        if (isYouTube && !src.includes("embed")) {
            const videoId = src.split('v=')[1] || src.split('/').pop();
            finalSrc = `https://www.youtube.com/embed/${videoId}`;
        }

        iframe.src = finalSrc;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        // Делаем адаптивно
        iframe.style.width = "100%"; 
        iframe.style.maxWidth = "470px";
        iframe.style.height = "265px"; // Стандарт для 16:9 при такой ширине

        container.appendChild(iframe);
    } else {
        // Логика для обычных картинок
        let newImg = document.createElement("img");
        newImg.alt = "Превью";
        newImg.style.opacity = "0";
        newImg.style.transform = "scale(0.8)";
        newImg.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        newImg.classList.add('zoomable');
        newImg.style.cursor = 'pointer';
        
        // Проверяем наличие функции openZoom перед добавлением слушателя
        newImg.addEventListener('click', () => {
            if (typeof openZoom === 'function') {
                openZoom(newImg.src);
            } else {
                console.log("Функция openZoom не найдена");
            }
        });

        container.appendChild(newImg);

        // Добавляем лоадер
        let loader = document.createElement("div");
        loader.classList.add("loader");
        container.appendChild(loader);

        newImg.src = src;
        newImg.onload = () => {
            loader.remove();
            requestAnimationFrame(() => {
                newImg.style.opacity = "1";
                newImg.style.transform = "scale(1)";
            });
        };

        newImg.onerror = () => {
            loader.remove();
            console.error("Не удалось загрузить картинку по адресу:", src);
        };
    }
}


function nxt() {
    ptc = (ptc + 1) % imgPatch.length;
    setimg(imgPatch[ptc]);
}

function bck() {
    ptc = (ptc - 1 + imgPatch.length) % imgPatch.length;
    setimg(imgPatch[ptc]);
}









let scale = 1;
let startDistance = 0;

modalImg.addEventListener("wheel", (e) => {
e.preventDefault();
scale += e.deltaY * -0.001;
scale = Math.min(Math.max(1, scale), 4);
modalImg.style.transform = `scale(${scale})`;
});

modalImg.addEventListener("touchstart", (e) => {
if (e.touches.length === 2) {
    const dx = e.touches[0].pageX - e.touches[1].pageX;
    const dy = e.touches[0].pageY - e.touches[1].pageY;
    startDistance = Math.hypot(dx, dy);
}
}, { passive: false });

modalImg.addEventListener("touchmove", (e) => {
if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].pageX - e.touches[1].pageX;
    const dy = e.touches[0].pageY - e.touches[1].pageY;
    const newDistance = Math.hypot(dx, dy);
    const diff = newDistance - startDistance;

    scale += diff * 0.005;
    scale = Math.min(Math.max(1, scale), 4);
    modalImg.style.transform = `scale(${scale})`;

    startDistance = newDistance;
}
}, { passive: false });



const params = new URLSearchParams(window.location.search);
const project = params.get("project");

let name = null;
let idi = null;

if (project) {
    const parts = project.split("%");
    name = parts[0] || null;
    idi = parts[1] || null;
}
// --- Загружаем JSON ---
fetch("app.json")
    .then(res => res.json())
    .then(data => {
        const app = data.find(a => a.idi === idi);

        if (!app) {
            window.location.href = "404.html";
            return;
        }


        const btn = document.getElementById("contentButton"); // Кнопка действия
        const btnText = document.getElementById("buttonType"); // Текст на кнопке


        const ua = navigator.userAgent;
        if (app) {

            if (!app.buttonType || app.buttonType.trim() === '') {
                btn.style.display = "none";
            }
            else {
                btn.style.display = "block"; // Показываем кнопку

                // 2. ВТОРАЯ ПРОВЕРКА: Анонс (приоритет №1)
                if (app.anonsy && app.anonsy !== "no") {
                    btnText.textContent = 'Скоро';
                    btn.href = app.anonsy; // Ссылка на пост с анонсом или типа того
                    // Убираем старые слушатели, чтобы модалка не прыгала
                    btn.replaceWith(btn.cloneNode(true)); 
                    const newBtn = document.getElementById("contentButton");
                    newBtn.addEventListener("click", () => {
                        window.location.href = app.anonsy;
                    });
                } 
                // 3. ТРЕТЬЯ ПРОВЕРКА: Обычное поведение
                else {
                    btnText.textContent = app.buttonType; // "Открыть" или "Скачать"

                    if (app.buttonType === "Открыть") {
                        btn.onclick = () => {
                            window.location.href = app.content;
                        };
                    } 
                    else if (app.buttonType === "Скачать") {
                        btn.onclick = (e) => {
                            e.preventDefault();
                            showDownloadModal(app); // Вызываем ту самую функцию модалки
                        };
                    }
                }
            }

            // Исправляем логику скриншотов: проверяем, массив это или строка
            if (Array.isArray(app.imgScreen)) {
                imgPatch = app.imgScreen; // Если уже массив (из твоего нового генератора)
            } else if (typeof app.imgScreen === 'string') {
                imgPatch = app.imgScreen.split(",").map(item => item.trim()); // Если старая строка
            } else {
                imgPatch = []; // На всякий случай
            }




            document.getElementById("nameApp").textContent = app.name;
            document.getElementById("nameAppDublicate").textContent = app.name;
            document.getElementById("contents").textContent = `ABartaj || ${app.name}`;
            document.getElementById("buttonType").textContent = app.buttonType;
            document.getElementById("IconApp").src = app.icon;
            document.getElementById("kalivanRaitingDublicate1").textContent = `${app.otziv} отзывов`;
            document.getElementById("starKalivanDublicate1").textContent = `${app.star}`;


            document.getElementById("raiting").style.display = 'block';
            document.getElementById("ageKalivan").textContent = app.age;
            document.getElementById("idApp").textContent = app.idi;
            document.getElementById("developer").textContent = app.developer;
            document.getElementById("developerDublicate1").textContent = app.developer;
            document.getElementById("developerDublicate2").textContent = app.developer;
            document.getElementById("defoultLanguage").textContent = app.language;
            if (!app.languageKalivan) {
                document.getElementById("dopingLanguage").textContent = app.languageKalivan;
            }
            document.getElementById("getVersionApp").textContent = app.version;
            document.getElementById("sizess").textContent = app.size;
            document.getElementById("descryMAX").textContent = app.description;
            document.getElementById("category").textContent = app.kategory;
            document.getElementById("tipok").textContent = app.tip;
            document.getElementById("deviTY").textContent = app.deviceTy;

            document.getElementById("inet").textContent = app.inet;


            if (app.inet == 'yes'){
                document.getElementById("inet").textContent = 'Требуется подключение к интернету'
            }else{
                document.getElementById("inet").textContent = 'Подключение к интернету не требуется'

            }

            if (app.size != 'Онлайн'){
                document.getElementById("obj").textContent = app.size;
            }else{
                const btnObj1 = document.getElementById("objem1");
                btnObj1.style.display = "none";
                const btnObj2 = document.getElementById("objem2");
                btnObj2.style.display = "none";
            }

            document.getElementById("sertificate").textContent = app.sertificate;

            if (!app.languageKalivan) {
                document.getElementById("lana").textContent = `${app.language} ${app.languageKalivan}`;
                
            }else{
                document.getElementById("lana").textContent = `${app.language}`;
            }

            document.getElementById("selfDeveloop").href = app.siteDeveloper;
            document.getElementById("selfDeveloopDublicate1").href = app.siteDeveloper;
            document.getElementById("developerDublicate3").href = app.siteDeveloper;
            document.getElementById("polyci").href = app.policy;
            document.getElementById("ICONMR").href = app.icon;

            document.getElementById("problems").href = `GrandAlert.html?project=${encodeURIComponent(app.name + '%' + app.idi)}`;

            const updatesElement = document.getElementById("contentUpdates");
            const mwsBlock = document.getElementById("mws");
            const supportBlock = document.getElementById("support");
            const btnCode = document.getElementById("IICode");


            paintStars(app.star);


            if (!("supported" in app)) {
                supportBlock.style.display = "none";
            }else{
                document.getElementById("support").href = app.supported;
            }




            if (app.updateText && app.updateText.trim() !== "") {
                updatesElement.textContent = app.updateText;
                mwsBlock.style.display = "block";
            } else {
                mwsBlock.style.display = "none";
            }


            if (app.allCode && app.allCode.trim() !== ""){
                btnCode.style.display = 'block';
                document.getElementById("IICode").href = app.allCode;
            }else{
                btnCode.style.display = 'none';
            }



            setimg(imgPatch[ptc]);


            if (app.fava && app.fava.trim() !== "") {
                const allowed = app.fava.split(",");
                document.querySelectorAll(".block").forEach(el => {
                    if (!allowed.includes(el.classList[1])) {
                        el.style.display = "none";
                    }
                    document.getElementById("Neurconfiggg").style.display = "none";
                });
            }else{
                document.getElementById("configgg").style.display = "none";
                document.getElementById("Neurconfiggg").style.display = "block";
            }
        
            // --- Логика кнопки с учётом anonsy ---
            // const btn = document.getElementById("contentButton");

            // if (app.anonsy && app.anonsy !== "no") {
            //     // если есть анонс
            //     btn.href = app.anonsy;
            //     btn.style.display = "block";
            //     document.getElementById("buttonType").textContent = 'Скоро';
            // } else {
            //     btn.style.display = "block";
            //     // обычное поведение
            //     if (app.buttonType === "Открыть") {
            //         btn.href = app.content;
            //         btn.addEventListener("click", () => {
            //             window.location.href = app.content;
            //         });
            //     } else if (app.buttonType === "Скачать") {
            //         btn.href = "#"; // чтобы не переходил сразу
            //         btn.addEventListener("click", (e) => {
            //             e.preventDefault();
            //             showDownloadModal(app);
            //         });
            //     }
            // }
            // if (app.buttonType.trim()==''){
            //     document.getElementById("contentButton").style.display = "none";
            // }


        }
        renderRecs(app, data);
        checkFavStatus();
});




//Модалка для скачивания

function showDownloadModal(app) {
    // 1. Собираем список из ключей в links
    const devices = app.links ? Object.keys(app.links) : [];

    if (devices.length === 0) {
        alert("Не нашлось доступных платформ");
        return;
    }

    const modal = document.getElementById("downloadModal");
    const list = document.getElementById("downloadList");
    
    if (!modal || !list) {
        console.error("Не найдены ID: downloadModal или downloadList");
        return;
    }

    list.innerHTML = ""; // Чистим список

    devices.forEach(devKey => {
        const link = app.links[devKey];
        // Важно: переводим в нижний регистр только для сравнения, чтобы не гадать с буквами
        const k = devKey.toLowerCase().trim(); 

        let platformName = "";
        let iconSrc = "server/icons/default.png";
        
        // --- ТВОИ 1 000 000 УСЛОВИЙ (СТРОГОЕ СООТВЕТСТВИЕ) ---
        if (k === "xbox360") { 
            platformName = "Xbox 360"; iconSrc = "server/xbox.png"; 
        }
        else if (k === "xboxone") { 
            platformName = "Xbox one"; iconSrc = "server/xbox.png"; 
        }
        else if (k === "xboxseriesx") { 
            platformName = "Xbox Series X"; iconSrc = "server/xbox.png"; 
        }
        else if (k === "xboxseriess") { 
            platformName = "Xbox Series S"; iconSrc = "server/xbox.png"; 
        }


        else if (k === "playstation1") { 
            platformName = "PlayStation 1"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "playstation2") { 
            platformName = "PlayStation 2"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "playstation3") { 
            platformName = "PlayStation 3"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "playstation4") { 
            platformName = "PlayStation 4"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "playstation5") { 
            platformName = "PlayStation 5"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "pspvita") { 
            platformName = "PSP Vita"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "psp") { 
            platformName = "PSP"; iconSrc = "server/playStation.png"; 
        }
        else if (k === "psvr") { 
            platformName = "PS VR"; iconSrc = "server/playStation.png"; 
        }


        else if (k === "windowsxp") { 
            platformName = "Windows xp"; iconSrc = "server/windows.png"; 
        }
        else if (k === "windows7") { 
            platformName = "Windows 7"; iconSrc = "server/windows.png"; 
        }
        else if (k === "windows8") { 
            platformName = "Windows 8"; iconSrc = "server/windows.png"; 
        }
        else if (k === "windows10") { 
            platformName = "Windows 10"; iconSrc = "server/windows.png"; 
        }
        else if (k === "windows11") { 
            platformName = "Windows 11"; iconSrc = "server/windows.png"; 
        }
        
        else if (k === "android") { 
            platformName = "Android"; iconSrc = "server/android.png"; 
        }


        else if (k === "oculusquest1") { 
            platformName = "Oculus Quest 1"; iconSrc = "server/oculus.png"; 
        }
        else if (k === "oculusquestpro") { 
            platformName = "Oculus Quest pro"; iconSrc = "server/oculus.png"; 
        }
        else if (k === "oculusquest2") { 
            platformName = "Oculus Quest 2"; iconSrc = "server/oculus.png"; 
        }
        else if (k === "oculusquest3") { 
            platformName = "Oculus Quest 3"; iconSrc = "server/oculus.png"; 
        }
        

        else if (k === "pico4") { 
            platformName = "Pico 4"; iconSrc = "server/pico.png"; 
        }
        else if (k === "pico4ultra") { 
            platformName = "Pico 4 Ultra"; iconSrc = "server/pico.png"; 
        }
        else if (k === "piconeo3link") { 
            platformName = "Pico Neo 3 Link"; iconSrc = "server/pico.png"; 
        }

        
        
        else if (k === "nintendoswitch") { 
            platformName = "Nintendo Switch"; iconSrc = "server/nintendo.png"; 
        }
        else if (k === "nintendo3ds") { 
            platformName = "Nintendo 3DS"; iconSrc = "server/nintendo.png"; 
        }


        else if (k === "ios") { 
            platformName = "IOS"; iconSrc = "server/apple.png"; 
        }
        else if (k === "macos") { 
            platformName = "Mac OS"; iconSrc = "server/apple.png"; 
        }
        else if (k === "ipad") { 
            platformName = "IPad"; iconSrc = "server/apple.png"; 
        }
        else if (k === "applewatch") { 
            platformName = "Apple Watch"; iconSrc = "server/apple.png"; 
        }


        else if (k === "linux") { 
            platformName = "Unix"; iconSrc = "server/unix.png"; 
        }

        else if (k === "github") { 
            platformName = "GitHub"; iconSrc = "server/github.png"; 
        }

        // Если условие не прописано — выводим как есть в ключе
        else {
            platformName = devKey;
            iconSrc = "server/404.png";
        }

        // --- СОЗДАНИЕ КНОПКИ В МОДАЛКЕ ---
        const item = document.createElement("div");
        item.classList.add("download-item");
        // Цвет текста черный, как ты просил в коде
        item.innerHTML = `<span><img src="${iconSrc}" alt="${platformName}" onerror="this.src='server/icons/default.png'"><p style="color:#000;">${platformName}</p></span>`;

        item.addEventListener("click", () => {
            window.location.href = link;
        });

        list.appendChild(item);
    });

    modal.style.display = "flex";
}

const cbtn = document.getElementById("closeDownloadModal");
if (cbtn) {
    cbtn.onclick = function() {
        document.getElementById("downloadModal").style.display = "none";
    };
}

window.onclick = function(event) {
    const modal = document.getElementById("downloadModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};