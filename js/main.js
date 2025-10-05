// Función para renderizar los addons
function renderAddons(addons) {
    const container = document.getElementById('addonsContainer');
    
    if (addons.length === 0) {
        container.innerHTML = `
            <div class="no-addons">
                <p>No se encontraron addons.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = addons.map(addon => `
        <div class="addon-card" onclick="viewAddon(${addon.id})">
            <img src="${addon.cover_image}" alt="Portada del addon" class="addon-cover">
            <div class="addon-info">
                <h3 class="addon-title">${addon.title}</h3>
                <p class="addon-description">${addon.description}</p>
                
                <div class="addon-footer">
                    <span class="addon-version">${addon.version}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Función para navegar a la página de detalles del addon
function viewAddon(id) {
    window.location.href = `view.html?id=${id}`;
}

// Función para descargar un addon
function downloadAddon(id) {
    const addon = getAddonById(id);
    if (addon) {
        alert(`Descargando: ${addon.title}`);
        // Aquí iría la lógica real de descarga
    }
}

// Funcionalidad del menú hamburguesa
function setupHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    
    function toggleMenu() {
        const isActive = dropdownMenu.classList.contains('active');
        
        if (isActive) {
            // Cerrar menú
            hamburgerMenu.classList.remove('active');
            dropdownMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Abrir menú
            hamburgerMenu.classList.add('active');
            dropdownMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMenuFunction() {
        hamburgerMenu.classList.remove('active');
        dropdownMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    hamburgerMenu.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenuFunction);
    closeMenu.addEventListener('click', closeMenuFunction);
    
    // Cerrar menú al hacer clic en un enlace interno
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === 'URL_DISCORD' || href === 'URL_YOUTUBE') {
                e.preventDefault();
                // Para enlaces externos placeholder, no hacer nada
                closeMenuFunction();
            } else if (href === '#') {
                e.preventDefault();
                // Para Licencia, no hacer nada pero cerrar menú
                closeMenuFunction();
            } else if (href === 'index.html') {
                // Para Inicio, permitir navegación normal y cerrar menú
                closeMenuFunction();
            }
        });
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
            closeMenuFunction();
        }
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar todos los addons al cargar la página
    renderAddons(getAllAddons());
    
    // Configurar el formulario de búsqueda
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        const results = searchAddons(query);
        renderAddons(results);
        
        // Actualizar el título si hay búsqueda
        const pageTitle = document.querySelector('.page-title');
        if (query) {
            pageTitle.textContent = `Resultados para: "${query}"`;
            
            // Añadir botón para limpiar búsqueda
            if (!document.querySelector('.clear-search')) {
                const clearBtn = document.createElement('a');
                clearBtn.href = '#';
                clearBtn.className = 'clear-search';
                clearBtn.textContent = 'Mostrar todos';
                clearBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    searchInput.value = '';
                    renderAddons(getAllAddons());
                    pageTitle.textContent = 'Últimos Addons';
                    clearBtn.remove();
                });
                pageTitle.parentNode.insertBefore(clearBtn, pageTitle.nextSibling);
            }
        } else {
            pageTitle.textContent = 'Últimos Addons';
            const clearBtn = document.querySelector('.clear-search');
            if (clearBtn) clearBtn.remove();
        }
    });
    
    // Configurar el menú hamburguesa
    setupHamburgerMenu();
});