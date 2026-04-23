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