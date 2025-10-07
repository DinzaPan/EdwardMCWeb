// Sistema de stickers personalizados para EdwardMC
const stickersConfig = {
    "1": "./img/stikers/1.jpeg",
    "heart": "./img/stikers/heart.png",
    "pollo": "./img/stikers/pollo.png",
    "fire": "./img/stikers/fire.gif",
    "minecraft": "./img/stikers/minecraft.png"
};

// Función para procesar texto y convertir códigos de stickers en imágenes
function processStickers(text) {
    if (!text) return '';
    
    // Expresión regular para encontrar patrones $1, $2, $heart, etc.
    const stickerRegex = /\$([a-zA-Z0-9]+)/g;
    
    return text.replace(stickerRegex, (match, stickerId) => {
        const stickerUrl = stickersConfig[stickerId];
        if (stickerUrl) {
            return `<img src="${stickerUrl}" alt="Sticker ${stickerId}" class="custom-sticker" data-sticker="${stickerId}">`;
        }
        return match; // Si no encuentra el sticker, devuelve el texto original
    });
}

// Función para procesar stickers en títulos (con tamaño diferente)
function processStickersInTitles(text) {
    if (!text) return '';
    
    const stickerRegex = /\$([a-zA-Z0-9]+)/g;
    
    return text.replace(stickerRegex, (match, stickerId) => {
        const stickerUrl = stickersConfig[stickerId];
        if (stickerUrl) {
            return `<img src="${stickerUrl}" alt="Sticker ${stickerId}" class="custom-sticker title-sticker" data-sticker="${stickerId}">`;
        }
        return match;
    });
}

// Función para obtener la lista de stickers disponibles
function getAvailableStickers() {
    return Object.keys(stickersConfig).map(key => ({
        code: `$${key}`,
        url: stickersConfig[key],
        preview: stickersConfig[key]
    }));
}

// Función para añadir un sticker al texto
function addStickerToText(textarea, stickerCode) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const sticker = ` ${stickerCode} `;
    
    textarea.value = text.substring(0, start) + sticker + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + sticker.length;
    
    // Disparar evento de cambio
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
}

// Función para crear un selector de stickers
function createStickerPicker(textareaId) {
    const stickers = getAvailableStickers();
    const container = document.createElement('div');
    container.className = 'sticker-picker';
    
    const pickerHeader = document.createElement('div');
    pickerHeader.className = 'sticker-picker-header';
    pickerHeader.innerHTML = '<h4>Stickers Disponibles</h4>';
    container.appendChild(pickerHeader);
    
    const stickersGrid = document.createElement('div');
    stickersGrid.className = 'stickers-grid';
    
    stickers.forEach(sticker => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-item';
        stickerItem.innerHTML = `
            <img src="${sticker.preview}" alt="${sticker.code}" class="sticker-preview">
            <span class="sticker-code">${sticker.code}</span>
        `;
        
        stickerItem.addEventListener('click', () => {
            const textarea = document.getElementById(textareaId);
            if (textarea) {
                addStickerToText(textarea, sticker.code);
            }
        });
        
        stickersGrid.appendChild(stickerItem);
    });
    
    container.appendChild(stickersGrid);
    return container;
}

// Inicializar sistema de stickers en elementos específicos
function initStickersForElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Procesar stickers en el contenido inicial
    if (element.innerHTML) {
        // Determinar si es un título para aplicar clase diferente
        if (element.classList.contains('addon-title') || element.classList.contains('page-title')) {
            element.innerHTML = processStickersInTitles(element.innerHTML);
        } else {
            element.innerHTML = processStickers(element.innerHTML);
        }
    }
    
    // Para textareas, procesar en tiempo real
    if (element.tagName === 'TEXTAREA') {
        // Añadir botón de stickers si no existe
        const parent = element.parentElement;
        if (parent && !parent.querySelector('.sticker-picker-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'sticker-picker-toggle';
            toggleBtn.innerHTML = '😊';
            toggleBtn.title = 'Añadir sticker';
            
            toggleBtn.addEventListener('click', () => {
                const existingPicker = parent.querySelector('.sticker-picker');
                if (existingPicker) {
                    existingPicker.remove();
                } else {
                    const picker = createStickerPicker(elementId);
                    parent.appendChild(picker);
                }
            });
            
            parent.style.position = 'relative';
            parent.appendChild(toggleBtn);
        }
    }
}

// Función para procesar todo el documento
function processAllStickers() {
    // Procesar elementos con clase específica
    const elements = document.querySelectorAll('.sticker-content, .addon-description, .review-comment, .user-review-comment');
    
    elements.forEach(element => {
        if (element.innerHTML && !element.classList.contains('sticker-processed')) {
            element.innerHTML = processStickers(element.innerHTML);
            element.classList.add('sticker-processed');
        }
    });
    
    // Procesar títulos
    const titleElements = document.querySelectorAll('.addon-title, .page-title');
    
    titleElements.forEach(element => {
        if (element.innerHTML && !element.classList.contains('sticker-processed')) {
            element.innerHTML = processStickersInTitles(element.innerHTML);
            element.classList.add('sticker-processed');
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    processAllStickers();
    
    // También procesar después de cargar contenido dinámico
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                processAllStickers();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Exportar funciones para uso global
window.StickerSystem = {
    processStickers,
    processStickersInTitles,
    getAvailableStickers,
    addStickerToText,
    createStickerPicker,
    initStickersForElement,
    processAllStickers
};