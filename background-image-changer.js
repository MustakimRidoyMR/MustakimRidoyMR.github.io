// Array of beautiful background images
const backgroundImages = [
    'https://source.unsplash.com/1920x1080/?nature,mountain',
    'https://source.unsplash.com/1920x1080/?ocean,beach',
    'https://source.unsplash.com/1920x1080/?forest,trees',
    'https://source.unsplash.com/1920x1080/?desert,landscape',
    'https://source.unsplash.com/1920x1080/?city,architecture',
    'https://source.unsplash.com/1920x1080/?sunset,sunrise',
    'https://source.unsplash.com/1920x1080/?waterfall',
    'https://source.unsplash.com/1920x1080/?stars,night',
    'https://source.unsplash.com/1920x1080/?aurora,northern-lights',
    'https://source.unsplash.com/1920x1080/?clouds,sky'
];

// Function to update background image
function updateBackgroundImage() {
    // Get random image URL from array
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    
    // Create a new image object to preload
    const img = new Image();
    img.src = randomImage;
    
    // When image is loaded, set as background
    img.onload = function() {
        document.body.style.backgroundImage = `url('${randomImage}')`;
        // Save the last update time and current image
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
        localStorage.setItem('currentBackgroundImage', randomImage);
    };
}

// Function to check if background needs to be updated
function checkBackgroundUpdate() {
    const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
    
    if (!lastUpdate) {
        updateBackgroundImage();
        return;
    }

    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    // Check if it's a new day
    if (lastUpdateDate.getDate() !== currentDate.getDate() ||
        lastUpdateDate.getMonth() !== currentDate.getMonth() ||
        lastUpdateDate.getFullYear() !== currentDate.getFullYear()) {
        updateBackgroundImage();
    } else {
        // Restore the last used background image
        const lastImage = localStorage.getItem('currentBackgroundImage');
        if (lastImage) {
            document.body.style.backgroundImage = `url('${lastImage}')`;
        }
    }
}