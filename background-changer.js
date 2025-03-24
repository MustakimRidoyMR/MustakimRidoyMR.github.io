// Predefined background image URLs
const backgroundImages = [
    'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg',
    'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg',
    'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjEwMTMtcC0wMDE5ZC0wMS1rc2k4YjVqbi5qcGc.jpg',
    'https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlfxps-j1QZ0F36RZ8PnlC9FCEe5npD_fX7qKLk6u1ICB1YCJkJz2fr4JWi6ghgt-TVYY&usqp=CAU',
    'https://e0.pxfuel.com/wallpapers/43/473/desktop-wallpaper-anime-nature.jpg',
    'https://wallpapercrafter.com/th800/411414-Anime-Landscape-Phone-Wallpaper.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvg77xG3EqkXpWX3XJztSvTlzY9OXg4XkwUw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSf3OywU4xlS9bYZLxRh2SLOoBPwaMDI5gA&s',
    'https://applescoop.org/image/wallpapers/iphone/iphone-16-teal-21-09-2024-1726985415-hd-wallpaper.png',
    'https://i.pinimg.com/736x/a3/a7/51/a3a7511380de5ac4e1d5bb3c0d278146.jpg'
];

/*// Predefined gradient colors
const gradientColors = [
    ['#2193b0', '#6dd5ed'],
    ['#cc2b5e', '#753a88'],
    ['#2c3e50', '#3498db'],
    ['#16a085', '#f4d03f'],
    ['#603813', '#b29f94']
];
*/
// Function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to update background
function updateBackground() {
    const imageUrl = getRandomItem(backgroundImages);
    //const colors = getRandomItem(gradientColors);
    const angle = Math.floor(Math.random() * 360);

    document.body.style.backgroundImage = `
        linear-gradient(
            ${angle}deg,
            ${colors[0]}aa,
            ${colors[1]}aa
        ),
        url('${imageUrl}')
    `;
    
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    // Save the last update time
    localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
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
    }
}

// Check for background update when page loads
document.addEventListener('DOMContentLoaded', checkBackgroundUpdate);

// Set up daily check
setInterval(checkBackgroundUpdate, 1000 * 60 * 60); // Check every hour
