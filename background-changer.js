// Predefined background image URLs
const backgroundImages = [
    'https://source.unsplash.com/random/1920x1080/?nature',
    'https://source.unsplash.com/random/1920x1080/?landscape',
    'https://source.unsplash.com/random/1920x1080/?mountain',
    'https://source.unsplash.com/random/1920x1080/?ocean',
    'https://source.unsplash.com/random/1920x1080/?forest'
];

// Predefined gradient colors
const gradientColors = [
    ['#2193b0', '#6dd5ed'],
    ['#cc2b5e', '#753a88'],
    ['#2c3e50', '#3498db'],
    ['#16a085', '#f4d03f'],
    ['#603813', '#b29f94']
];

// Function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to update background
function updateBackground() {
    const imageUrl = getRandomItem(backgroundImages);
    const colors = getRandomItem(gradientColors);
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
