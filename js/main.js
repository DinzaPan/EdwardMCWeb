// Función para renderizar los addons
async function renderAddons(addons) {
    const container = document.getElementById('addonsContainer');
    
    if (addons.length === 0) {
        container.innerHTML = `
            <div class="no-addons">
                <p>No se encontraron addons.</p>
            </div>
        `;
        return;
    }
    
    const addonsWithRatings = await Promise.all(
        addons.map(async (addon) => {
            const reviews = await getReviewsForAddon(addon.id);
            const averageRating = calculateAverageRating(reviews);
            return {
                ...addon,
                averageRating,
                reviewsCount: reviews.length
            };
        })
    );
    
    container.innerHTML = addonsWithRatings.map(addon => `
        <div class="addon-card" onclick="viewAddon(${addon.id})">
            <img src="${addon.cover_image}" alt="Portada del addon" class="addon-cover">
            <div class="addon-info">
                <h3 class="addon-title sticker-content">${processTextWithStickersInTitles(addon.title)}</h3>
                <div class="addon-rating">
                    ${renderStars(addon.averageRating, false, 'small')}
                    <span class="rating-value">${addon.averageRating}</span>
                    <span class="reviews-count">(${addon.reviewsCount})</span>
                </div>
                <p class="addon-description sticker-content">${processTextWithStickers(addon.description)}</p>
                
                <div class="addon-footer">
                    <span class="addon-version">${addon.version}</span>
                    <span class="publish-date">${formatDate(addon.last_updated)}</span>
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
            hamburgerMenu.classList.remove('active');
            dropdownMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
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
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.includes('discord.gg') || href.includes('youtube.com')) {
                closeMenuFunction();
            } else if (href === './sc/licencia.html') {
                closeMenuFunction();
            } else if (href === 'index.html') {
                closeMenuFunction();
            } else {
                e.preventDefault();
                closeMenuFunction();
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
            closeMenuFunction();
        }
    });
}

// Función para renderizar los filtros
function renderFilters() {
    const searchSection = document.querySelector('.search-section');
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    filtersContainer.innerHTML = `
        <div class="filters-scroll">
            <div class="filters-wrapper">
                <button class="filter-btn active" data-category="Todos">
                    <span>Todos</span>
                </button>
                <button class="filter-btn" data-category="Add-ons">
                    <span>Add-ons</span>
                </button>
                <button class="filter-btn" data-category="Texturas">
                    <span>Texturas</span>
                </button>
                <button class="filter-btn" data-category="Maps">
                    <span>Maps</span>
                </button>
                <button class="filter-btn" data-category="Mejor Valorados">
                    <span>Mejor Valorados</span>
                </button>
            </div>
        </div>
    `;
    
    // Insertar después del search container
    const searchContainer = searchSection.querySelector('.search-container');
    searchSection.insertBefore(filtersContainer, searchContainer.nextSibling);
    
    // Agregar event listeners a los botones de filtro
    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            let filteredAddons;
            if (category === 'Mejor Valorados') {
                filteredAddons = await getBestRatedAddons();
            } else {
                filteredAddons = filterAddonsByCategory(category);
            }
            
            await renderAddons(filteredAddons);
            
            // Actualizar título de la página
            const pageTitle = document.querySelector('.page-title');
            if (category === 'Todos') {
                pageTitle.textContent = 'Últimos Addons';
            } else {
                pageTitle.textContent = category;
            }
            
            // Limpiar búsqueda si existe
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar filtros
    renderFilters();
    
    // Renderizar todos los addons inicialmente
    renderAddons(getAllAddons());
    
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        const results = searchAddons(query);
        renderAddons(results);
        
        const pageTitle = document.querySelector('.page-title');
        if (query) {
            pageTitle.textContent = `Resultados para: "${query}"`;
            
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
    
    setupHamburgerMenu();
});
