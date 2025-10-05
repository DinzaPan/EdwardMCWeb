// Datos de ejemplo para los addons
const addonsData = [
    {
        id: 1,
        title: "Custom Command V6.4",
        description: "🌟¡🎃Descubre Command Personalizados Para Tu Servidor De Minecraft Bedrock Variedad de Comandos Personalizados Para Que Sea Fácil Hacerte Tp Hacia Otros Lobby Etc.🚀🌍 ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ➡️🎃Como Funciona Este Addon Es Fácil Al Implementar El Addon A Tu Mundo o Servidor Verifique !help Con este Comand Si Le Funciona También Puede Hacerte Tp Como Con El !lobby Como Modificar Las Coordenada ? Fácil Lendo Alos Archivo Del Addon Script y Depues En index.js Tutorial Completo En Mi Canal De Youtube : Edward Gamer Addon",
        cover_image: "./img/Commd.jpg",
        version: "1.21.111",
        download_link: "https://cuty.io/fNeu4l",
        tags: ["custom", "command", "personalizado"],
        last_updated: "2025-10-5",
        file_size: "196.89 KB"
    },
    {
        id: 2,
        title: "Welcome System V3.7",
        description: "➡️🎃Bienvenido al Addon Welcome System. Dale la bienvenida a tus amigos y jugadores con un sistema. Al unirse a tu mundo, Recibirán Una Bienvenida Perfecto Para Tu Servidor De Minecraft Bedrock. ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ➡️Como Modificar El Script Para Que Sea A Tu Gusto Valla Al Los Archivos Del Addon En Script y Depues En main.js Sino Saves Como En Mi Canal De Youtube Esta El Tuturial YT : Edward Gamer Addon.",
        cover_image: "./img/Welcome.jpg",
        version: "1.21.111",
        download_link: "https://cuty.io/slCCvU",
        tags: ["Bienvenida", "Mensaje", "servidores"],
        last_updated: "2025-10-5",
        file_size: "207.97 KB"
    },
    {
        id: 3,
        title: "Shop UI V1.5",
        description: "➡️🎃Añade una Tienda a Tu Servidor de Minecraft que te Permite Comprar items en Menu UI increíble, Creador Y Creditos Edward Gamer : Cappytqm28.ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ ㅤㅤㅤㅤㅤㅤㅤㅤㅤ➡️🎃Este Addon Se  Abre Con El Item Reloj o Clock 🧭 También Se Puede Abrir Escribiendo Esto En El Chat .Shop o .Shop Recuerda Añadirte Un Scoreboard añadiendo Dinero Si Quieres El Tutorial Completo en Mi Canal De Youtube : Edward Gamer Addon",
        cover_image: "./img/ShopUI.jpg",
        version: "1.21.111",
        download_link: "https://cuty.io/WeeFetphDuKo",
        tags: ["Tienda", "Dinero", "Menu UI"],
        last_updated: "2025-10-5",
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
