// Function to generate random gradient colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate random gradient angle
function getRandomAngle() {
    return Math.floor(Math.random() * 360);
}

// Function to update background
async function updateBackground() {
    try {
        // Unsplash API key - Replace with your own key from https://unsplash.com/developers
        const unsplashApiKey = 'YOUR_UNSPLASH_API_KEY';
        
        // Fetch random image from Unsplash
        const response = await fetch(`https://api.unsplash.com/photos/random?query=nature,landscape&orientation=landscape&client_id=${unsplashApiKey}`);
        const data = await response.json();
        const imageUrl = data.urls.regular;

        // Generate random gradient colors
        const color1 = getRandomColor();
        const color2 = getRandomColor();
        const angle = getRandomAngle();

        // Apply background image and gradient
        document.body.style.backgroundImage = `
            linear-gradient(
                ${angle}deg,
                ${color1}aa,
                ${color2}aa
            ),
            url('${imageUrl}')
        `;
        
        // Add additional background properties
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';

        // Save the last update time
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
        
    } catch (error) {
        console.error('Error updating background:', error);
    }
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