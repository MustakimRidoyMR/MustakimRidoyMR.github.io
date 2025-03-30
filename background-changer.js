// Function to fetch images from GitHub repository recursively
async function fetchImagesRecursive(path = '') {
    try {
        const owner = 'ridoy520';
        const repo = 'ridoy520.github.io';
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        // Fetch repository contents (including subdirectories)
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        const contents = await response.json();
        
        let imageFiles = [];

        for (const file of contents) {
            if (file.type === 'file') {
                // Extract file extension and check if it's an image
                const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                if (validImageExtensions.includes(extension)) {
                    imageFiles.push(file.download_url);
                }
            } else if (file.type === 'dir') {
                // If it's a directory, recursively fetch images inside it
                const subDirImages = await fetchImagesRecursive(file.path);
                imageFiles = imageFiles.concat(subDirImages);
            }
        }

        return imageFiles;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

// Function to get images from GitHub and cache them
async function getImagesFromGitHub() {
    const images = await fetchImagesRecursive(); // Fetch images from all directories

    if (images.length > 0) {
        localStorage.setItem('backgroundImages', JSON.stringify(images));
        localStorage.setItem('imagesLastUpdated', new Date().toISOString());
    }

    return images.length > 0 ? images : JSON.parse(localStorage.getItem('backgroundImages')) || [];
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

/*// Modified updateBackground function
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
setInterval(checkBackgroundUpdate, 1000 * 60 * 60);*/

async function updateBackground() {
    const images = await getBackgroundImages();

    if (images.length === 0) {
        console.error('No images available');
        return;
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];

    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // ব্লার ফিল্টার প্রয়োগ (এটি একটি সরলীকৃত উদাহরণ)
        const blurredCanvas = blurCanvas(canvas, 15); // 5px ব্লার রেডিয়াস

        // ব্লার করা ক্যানভাসকে ডেটা URL এ রূপান্তর করুন
        const blurredDataURL = blurredCanvas.toDataURL();

        // ব্যাকগ্রাউন্ডে সেট করুন
        document.body.style.backgroundImage = `url('${blurredDataURL}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
    };
    img.src = imageUrl;

    localStorage.setItem('currentBackground', imageUrl);
    localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
}

function blurCanvas(canvas, blurAmount) {
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // একাধিকবার ইমেজটিকে ছোট করে এবং বড় করে ব্লার ইফেক্ট তৈরি করা হচ্ছে
    for (let i = 1; i <= blurAmount; i += 2) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }

    return canvas;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const lastBackground = localStorage.getItem('currentBackground');
    if (lastBackground) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const blurredCanvas = blurCanvas(canvas, 5);
            const blurredDataURL = blurredCanvas.toDataURL();
            document.body.style.backgroundImage = `url('${blurredDataURL}')`;
        };
        img.src = lastBackground;
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
