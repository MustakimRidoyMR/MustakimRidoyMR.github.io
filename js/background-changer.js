// Function to recursively fetch images from GitHub repository and its subfolders
async function getImagesFromGitHub() {
    try {
        const owner = 'ridoy520';
        const repo = 'ridoy520.github.io';
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        let allImages = [];
        
        // Fetch repository contents
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`);
        const contents = await response.json();
        
        // Process each item (file or folder)
        for (const item of contents) {
            if (item.type === 'file') {
                // Check if it's an image file
                const extension = item.name.toLowerCase().slice(item.name.lastIndexOf('.'));
                if (validImageExtensions.includes(extension)) {
                    allImages.push(item.download_url);
                }
            } else if (item.type === 'dir') {
                // Recursively fetch images from subfolder
                const subfolderImages = await getImagesFromGitHub(item.path);
                allImages = allImages.concat(subfolderImages);
            }
        }
        
        // Save to localStorage only if we're at the root Images folder
        if (path === 'Images') {
            localStorage.setItem('backgroundImages', JSON.stringify(allImages));
            localStorage.setItem('imagesLastUpdated', new Date().toISOString());
        }
        
        return allImages;
    } catch (error) {
        console.error('Error fetching images:', error);
        // Return empty array or cached images if available
        return JSON.parse(localStorage.getItem('backgroundImages')) || [];
    }
}

// Rest of your code remains the same
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




/*// Function to fetch images from GitHub repository
async function getImagesFromGitHub() {
    try {
        const owner = 'ridoy520';
        const repo = 'ridoy520.github.io';
        const images = 'Images';
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        // Fetch repository contents
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${images}/`);
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
*/
