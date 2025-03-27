// Function to fetch images from GitHub repository
async function getImagesFromGitHub() {
    try {
        const owner = 'ridoy520';
        const repo = 'ridoy520.github.io';
        const images = 'Images';
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        // Fetch repository contents
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${images}`);
        const contents = await response.json();
        
        // Filter for image files
        const imageFiles = contents.filter(file => {
            const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
            return validImageExtensions.includes(extension);
        });

        // Get direct URLs for the images
        const backgroundImages = imageFiles.map(file => file.download_url);
        
        // Save to localStorage to avoid frequent API calls
        localStorage.setItem('backgroundImages', JSON.stringify(backgroundImages));
        localStorage.setItem('imagesLastUpdated', new Date().toISOString());
        
        return backgroundImages;
    } catch (error) {
        console.error('Error fetching images:', error);
        // Return empty array or cached images if available
        return JSON.parse(localStorage.getItem('backgroundImages')) || [];
    }
}

// Function to check if images need to be updated
async function getBackgroundImages() {
    const lastUpdated = localStorage.getItem('imagesLastUpdated');
    const cachedImages = localStorage.getItem('backgroundImages');
    
    // Check if we need to fetch new images (once per day)
    if (!lastUpdated || !cachedImages || 
        new Date(lastUpdated).getDate() !== new Date().getDate()) {
        return await getImagesFromGitHub();
    }
    
    return JSON.parse(cachedImages);
}

// Modified updateBackground function
async function updateBackground() {
    const images = await getBackgroundImages();
    
    if (images.length === 0) {
        console.error('No images available');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];
    
    // Create a new image object to preload
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = function() {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        // Save current background
        localStorage.setItem('currentBackground', imageUrl);
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Try to restore last background while loading new one
    const lastBackground = localStorage.getItem('currentBackground');
    if (lastBackground) {
        document.body.style.backgroundImage = `url('${lastBackground}')`;
    }
    
    checkBackgroundUpdate();
});

// Modified checkBackgroundUpdate function
async function checkBackgroundUpdate() {
    const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
    
    if (!lastUpdate) {
        await updateBackground();
        return;
    }

    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    if (lastUpdateDate.getDate() !== currentDate.getDate() ||
        lastUpdateDate.getMonth() !== currentDate.getMonth() ||
        lastUpdateDate.getFullYear() !== currentDate.getFullYear()) {
        await updateBackground();
    }
}

// Check every hour
setInterval(checkBackgroundUpdate, 1000 * 60 * 60);









/*// Predefined background image URLs
const backgroundImages = [
    'A futuristic technology-themed promotional image for MR Bot Company launching a revolutionary new product. The image should include a sleek, high-tech.webp',
    'A professional and modern promotional image announcing global expansion. The image should feature a split view of two iconic international cityscapes,.webp',
    'image.jpg',
    'image0.jpg',
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image.webp',
    'image0.webp',
    'image1.webp'
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
*/
