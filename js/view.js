// Función para renderizar los detalles del addon
async function renderAddonDetails(addon) {
    const container = document.getElementById('addonDetails');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!addon) {
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">!</div>
                <h3 class="error-text">Addon no encontrado</h3>
                <p class="error-details">El addon que buscas no existe o ha sido eliminado.</p>
                <a href="index.html" class="clear-search">Volver al inicio</a>
            </div>
        `;
        return;
    }
    
    const reviews = await getReviewsForAddon(addon.id);
    const averageRating = calculateAverageRating(reviews);
    const userReview = await getUserReviewForAddon(addon.id);
    
    // Actualizar título de la página con stickers
    pageTitle.innerHTML = `${processTextWithStickersInTitles(addon.title)} - EdwardMC`;
    
    container.innerHTML = `
        <div class="addon-header">
            <img src="${addon.cover_image}" alt="Portada del addon" class="addon-cover">
            <h1 class="addon-title sticker-content">${processTextWithStickersInTitles(addon.title)}</h1>
            
            <div class="addon-meta">
                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Actualizado: ${formatDate(addon.last_updated)}</span>
                </div>
                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Minecraft ${addon.version}</span>
                </div>
                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>${addon.file_size}</span>
                </div>
            </div>
            
            <div class="addon-tags">
                ${addon.tags.map(tag => `<span class="addon-tag">${tag}</span>`).join('')}
            </div>
            
            <p class="addon-description sticker-content">${processTextWithStickers(addon.description)}</p>
            
            <button class="download-btn" onclick="downloadAddon(${addon.id})">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
            </button>
        </div>
        
        <div class="reviews-section">
            <div class="reviews-header">
                <h2 class="reviews-title">Reseñas</h2>
                <div class="overall-rating">
                    <div class="rating-display">
                        <div class="rating-stars">
                            ${renderStars(averageRating)}
                        </div>
                        <div class="rating-score">${averageRating}</div>
                        <div class="rating-count">${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            </div>
            
            ${renderReviewForm(addon.id, userReview)}
            ${renderReviewsList(reviews, userReview)}
        </div>
    `;
    
    setupReviewForm(addon.id);
}

// Función para renderizar el formulario de reseña
function renderReviewForm(addonId, userReview) {
    if (userReview) {
        return `
            <div class="user-review">
                <div class="user-review-header">
                    <div class="user-review-info">
                        <img src="${getUserProfilePicture()}" alt="Tu foto de perfil" class="profile-picture">
                        <div>
                            <div class="user-review-rating">
                                <span>Tu calificación:</span>
                                ${renderStars(userReview.rating)}
                            </div>
                            <div class="user-review-date">${formatDate(userReview.timestamp)}</div>
                        </div>
                    </div>
                    <button class="delete-review-btn" onclick="deleteUserReview(${addonId})">
                        Eliminar reseña
                    </button>
                </div>
                <p class="user-review-comment sticker-content">${processTextWithStickers(userReview.comment)}</p>
            </div>
        `;
    } else {
        return `
            <div class="add-review-form">
                <h3 class="form-title">Añadir reseña</h3>
                <form id="reviewForm">
                    <div class="rating-input">
                        <label>Calificación:</label>
                        ${renderStars(0, true)}
                    </div>
                    <div class="comment-input">
                        <label for="reviewComment">Comentario:</label>
                        <textarea id="reviewComment" placeholder="Comparte tu experiencia con este addon... $fire $heart" required></textarea>
                        <div class="sticker-help">
                            <small>Usa $1, $2, $fire, $heart, etc. para añadir stickers</small>
                        </div>
                    </div>
                    <div class="review-actions">
                        <button type="submit" class="submit-review-btn">
                            Enviar reseña
                        </button>
                        <button type="button" class="sticker-picker-toggle" onclick="toggleStickerPicker('reviewComment')">
                            😊 Añadir Sticker
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
}

// Función para renderizar la lista de reseñas
function renderReviewsList(reviews, userReview) {
    const otherReviews = reviews.filter(review => 
        !userReview || review.userId !== userReview.userId
    );
    
    if (otherReviews.length === 0) {
        return `
            <div class="all-reviews">
                <h3>Todas las reseñas</h3>
                <div class="no-reviews">
                    <p>Aún no hay reseñas para este addon.</p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="all-reviews">
            <h3>Todas las reseñas</h3>
            <div class="reviews-list">
                ${otherReviews.map(review => `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-user-info">
                                <img src="${getUserProfilePicture()}" alt="Foto de perfil" class="profile-picture">
                                <div class="review-user">Usuario</div>
                            </div>
                            <div class="review-rating">
                                ${renderStars(review.rating, false, 'small')}
                                <span class="review-date">${formatDate(review.timestamp)}</span>
                            </div>
                        </div>
                        <p class="review-comment sticker-content">${processTextWithStickers(review.comment)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Configurar el formulario de reseña
function setupReviewForm(addonId) {
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.stars.interactive .star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const comment = document.getElementById('reviewComment').value.trim();
            
            if (selectedRating === 0) {
                alert('Por favor, selecciona una calificación');
                return;
            }
            
            if (!comment) {
                alert('Por favor, escribe un comentario');
                return;
            }
            
            try {
                await addOrUpdateReview(addonId, selectedRating, comment);
                location.reload();
            } catch (error) {
                alert('Error al enviar la reseña. Inténtalo de nuevo.');
            }
        });
    }
}

// Eliminar reseña del usuario
async function deleteUserReview(addonId) {
    if (confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
        try {
            await deleteReview(addonId);
            location.reload();
        } catch (error) {
            alert('Error al eliminar la reseña. Inténtalo de nuevo.');
        }
    }
}

// Función para descargar el addon
function downloadAddon(addonId) {
    const addon = getAddonById(addonId);
    if (addon && addon.download_link) {
        window.open(addon.download_link, '_blank');
    } else {
        alert('Error: No se pudo encontrar el enlace de descarga para este addon.');
    }
}

// Función para mostrar/ocultar el selector de stickers
function toggleStickerPicker(textareaId) {
    if (typeof window.StickerSystem !== 'undefined') {
        window.StickerSystem.toggleStickerPicker(textareaId);
    }
}

// Inicializar la página de detalles
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    
    const urlParams = new URLSearchParams(window.location.search);
    const addonId = urlParams.get('id');
    
    if (addonId) {
        const addon = getAddonById(addonId);
        renderAddonDetails(addon).then(() => {
            hideLoading();
        });
    } else {
        renderAddonDetails(null);
        hideLoading();
    }
});

// Sistema de carga
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1000);
    }
}

// Función para obtener un addon por ID
function getAddonById(id) {
    return addonsData.find(addon => addon.id === parseInt(id));
}

// Función para obtener todos los addons
function getAllAddons() {
    return addonsData;
}

// Función para buscar addons
function searchAddons(query) {
    if (!query) {
        return addonsData;
    }
    
    const lowerQuery = query.toLowerCase();
    return addonsData.filter(addon => 
        addon.title.toLowerCase().includes(lowerQuery) ||
        addon.description.toLowerCase().includes(lowerQuery) ||
        addon.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// Función para formatear fechas
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Sistema de reseñas
async function fetchReviews() {
    try {
        const response = await fetch(`${JSONBIN_BASE_URL}/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': MASTER_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar las reseñas');
        }
        
        const data = await response.json();
        return data.record || {};
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        return {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": []
        };
    }
}

async function saveReviews(reviews) {
    try {
        const response = await fetch(`${JSONBIN_BASE_URL}/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(reviews)
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar las reseñas');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al guardar reseñas:', error);
        throw error;
    }
}

// Obtener reseñas de un addon específico
async function getReviewsForAddon(addonId) {
    const reviews = await fetchReviews();
    return reviews[addonId] || [];
}

// Obtener reseña del usuario actual para un addon
async function getUserReviewForAddon(addonId) {
    const reviews = await getReviewsForAddon(addonId);
    const userId = getUserId();
    return reviews.find(review => review.userId === userId);
}

// Añadir o actualizar reseña (ACTUALIZADA para procesar stickers)
async function addOrUpdateReview(addonId, rating, comment) {
    const reviews = await fetchReviews();
    const userId = getUserId();
    
    if (!reviews[addonId]) {
        reviews[addonId] = [];
    }
    
    const existingReviewIndex = reviews[addonId].findIndex(review => review.userId === userId);
    
    if (existingReviewIndex !== -1) {
        reviews[addonId][existingReviewIndex] = {
            userId,
            rating,
            comment, // El comentario con códigos de stickers
            timestamp: new Date().toISOString()
        };
    } else {
        reviews[addonId].push({
            userId,
            rating,
            comment, // El comentario con códigos de stickers
            timestamp: new Date().toISOString()
        });
    }
    
    await saveReviews(reviews);
    return reviews[addonId];
}

// Eliminar reseña
async function deleteReview(addonId) {
    const reviews = await fetchReviews();
    const userId = getUserId();
    
    if (reviews[addonId]) {
        reviews[addonId] = reviews[addonId].filter(review => review.userId !== userId);
        await saveReviews(reviews);
    }
    
    return reviews[addonId] || [];
}

// Calcular promedio de calificaciones
function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

// Generar ID único para usuario (simulado)
function getUserId() {
    let userId = localStorage.getItem('edwardmc_userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('edwardmc_userId', userId);
    }
    return userId;
}

// Renderizar estrellas
function renderStars(rating, interactive = false, size = 'medium') {
    const starSize = size === 'small' ? '1rem' : '1.5rem';
    let starsHtml = '';
    
    for (let i = 1; i <= 5; i++) {
        if (interactive) {
            starsHtml += `
                <span class="star ${i <= rating ? 'active' : ''}" data-rating="${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="${starSize}" height="${starSize}" viewBox="0 0 24 24" fill="${i <= rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </span>
            `;
        } else {
            starsHtml += `
                <span class="star ${i <= rating ? 'active' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="${starSize}" height="${starSize}" viewBox="0 0 24 24" fill="${i <= rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </span>
            `;
        }
    }
    
    return `<div class="stars ${interactive ? 'interactive' : ''} ${size}">${starsHtml}</div>`;
}

// Función para obtener foto de perfil del usuario
function getUserProfilePicture() {
    return "./img/profile/p1.jpg";
}

// Función para procesar texto con stickers (compatibilidad)
function processTextWithStickers(text) {
    if (typeof window.StickerSystem !== 'undefined') {
        return window.StickerSystem.processStickers(text);
    }
    return text;
}

// Función para procesar texto con stickers en títulos (compatibilidad)
function processTextWithStickersInTitles(text) {
    if (typeof window.StickerSystem !== 'undefined') {
        return window.StickerSystem.processStickersInTitles(text);
    }
    return text;
}
