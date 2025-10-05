// Datos de ejemplo para los addons
const addonsData = [
    {
        id: 1,
        title: "Better Combat",
        description: "Mejora el sistema de combate de Minecraft con nuevas mecánicas y animaciones. Añade ataques especiales, combos y efectos visuales que transforman completamente la experiencia de combate en el juego.",
        cover_image: "./img/prueba.jpg",
        version: "1.21+",
        download_link: "TU_URL_DE_DESCARGA",
        tags: ["combat", "mechanics", "animations"],
        last_updated: "2025-10-4",
        file_size: "2.4 MB"
    },
    {
        id: 2,
        title: "Epic Structures",
        description: "Añade estructuras épicas y generación de edificios avanzados al mundo de Minecraft. Incluye castillos, ciudades antiguas, templos misteriosos y mucho más para explorar.",
        cover_image: "./img/Rango.jpg",
        version: "1.21+",
        download_link: "TU_URL_DE_DESCARGA",
        tags: ["structures", "worldgen", "exploration"],
        last_updated: "2025-10-4",
        file_size: "5.7 MB"
    }
];

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
