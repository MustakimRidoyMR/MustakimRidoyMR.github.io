// Predefined background image URLs
const backgroundImages = [
    'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg',
    'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg',
    'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjEwMTMtcC0wMDE5ZC0wMS1rc2k4YjVqbi5qcGc.jpg',
    'https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg',
    'https://e0.pxfuel.com/wallpapers/43/473/desktop-wallpaper-anime-nature.jpg',
    'https://wallpapercrafter.com/th800/411414-Anime-Landscape-Phone-Wallpaper.jpg',
    'https://i.pinimg.com/736x/a3/a7/51/a3a7511380de5ac4e1d5bb3c0d278146.jpg'
];

// Function to update background
function updateBackground() {
    // Get random image URL from array
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const imageUrl = backgroundImages[randomIndex];
    
    // Create a new image object to preload
    const img = new Image();
    img.src = imageUrl;
    
    // When image is loaded, set as background
    img.onload = function() {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        // Save the last update time and current image
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
        localStorage.setItem('currentBackgroundImage', imageUrl);
    };
}

// Function to check if background needs to be updated
function checkBackgroundUpdate() {
    const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
    
    if (!lastUpdate) {
        updateBackground();
        return;
    }

    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    // Check if it's a new day
    if (lastUpdateDate.getDate() !== currentDate.getDate() ||
        lastUpdateDate.getMonth() !== currentDate.getMonth() ||
        lastUpdateDate.getFullYear() !== currentDate.getFullYear()) {
        updateBackground();
    } else {
        // Restore the last used background image
        const lastImage = localStorage.getItem('currentBackgroundImage');
        if (lastImage) {
            document.body.style.backgroundImage = `url('${lastImage}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', checkBackgroundUpdate);

// Check every hour
setInterval(checkBackgroundUpdate, 1000 * 60 * 60);
