// Predefined background image URLs
const backgroundImages = [
    'A futuristic technology-themed promotional image for MR Bot Company launching a revolutionary new product. The image should include a sleek, high-tech.webp',
    'A professional and modern promotional image announcing global expansion. The image should feature a split view of two iconic international cityscapes,.webp',
    'image1.jpg',
    'image2.jpg'
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
