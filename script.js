document.addEventListener("DOMContentLoaded", function () {
    console.log("Página cargada correctamente");
});

// Función para mostrar/ocultar el menú desplegable
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

// Animacion entre secciones 
document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    // Cargar datos almacenados previamente
    let storedCards = JSON.parse(localStorage.getItem("storedCards")) || {};

    cards.forEach((card, index) => {
        const title = card.querySelector(".card-title").innerText;
        const link = card.querySelector(".download-btn").href;
        const cardId = `card-${index}`;

        // Si la Card es nueva
        if (!storedCards[cardId]) {
            storedCards[cardId] = { title, link, createdAt: Date.now(), modifiedAt: null };
            updateStatusIcon(card, "new");
        } else {
            // Si hay cambios en título o link, marcar como "actualizado"
            if (storedCards[cardId].title !== title || storedCards[cardId].link !== link) {
                storedCards[cardId].title = title;
                storedCards[cardId].link = link;
                storedCards[cardId].modifiedAt = Date.now();
                updateStatusIcon(card, "updated"); // Cambia el icono a "actualizado"
            }
        }

        // Verificar si ya pasaron 5 días para eliminar iconos
        const now = Date.now();
        const fiveDays = 5 * 24 * 60 * 60 * 1000;

        if (storedCards[cardId].createdAt && now - storedCards[cardId].createdAt > fiveDays) {
            delete storedCards[cardId].createdAt;
            removeStatusIcon(card);
        }

        if (storedCards[cardId].modifiedAt && now - storedCards[cardId].modifiedAt > fiveDays) {
            delete storedCards[cardId].modifiedAt;
            removeStatusIcon(card);
        }
    });

    localStorage.setItem("storedCards", JSON.stringify(storedCards));

    // Función para actualizar el icono en la esquina superior derecha
    function updateStatusIcon(card, type) {
        removeStatusIcon(card); // Elimina iconos previos

        const iconUrl =
            type === "new"
                ? "https://i.ibb.co/tT1fmyZp/10786060.png"  // Icono de nueva Card
                : "https://i.ibb.co/ZsmfKNK/13707423.png";  // Icono de actualización

        const icon = document.createElement("img");
        icon.src = iconUrl;
        icon.classList.add("card-status-icon");
        card.appendChild(icon);
    }

    // Función para eliminar iconos anteriores
    function removeStatusIcon(card) {
        const existingIcon = card.querySelector(".card-status-icon");
        if (existingIcon) {
            existingIcon.remove();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const newAddonsContainer = document.querySelector(".new-addons-container");
    const allAddonsContainer = document.querySelector(".cards-container");

    // Obtener las cards desde el index.html
    fetch("../index.html")
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const cards = doc.querySelectorAll(".card");

            let storedAddons = JSON.parse(localStorage.getItem("addons")) || [];
            let newAddons = [];

            cards.forEach(card => {
                const title = card.querySelector(".card-title").textContent.trim();
                const link = card.querySelector(".download-btn").href;

                // Verificar si es una nueva card
                const exists = storedAddons.some(addon => addon.title === title);
                if (!exists) {
                    newAddons.push({ title, link, html: card.outerHTML, date: Date.now() });
                }
            });

            // Mantener solo los últimos 7 addons
            storedAddons = [...newAddons, ...storedAddons].slice(0, 7);
            localStorage.setItem("addons", JSON.stringify(storedAddons));

            // Insertar los nuevos addons
            storedAddons.forEach(addon => {
                newAddonsContainer.innerHTML += addon.html;
            });

            // Insertar todos los addons en la lista completa
            cards.forEach(card => {
                allAddonsContainer.appendChild(card.cloneNode(true));
            });
        });
});
