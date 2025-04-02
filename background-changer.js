// GitHub থেকে ইমেজ fetch করার recursive ফাংশন
async function fetchImagesRecursive(path = '') {
    try {
        const owner = 'MustakimRidoyMR';  // আপনার GitHub username
        const repo = 'MustakimRidoyMR.github.io'; // আপনার repository নাম
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        const contents = await response.json();
        
        let imageFiles = [];

        for (const file of contents) {
            if (file.type === 'file') {
                const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                if (validImageExtensions.includes(extension)) {
                    imageFiles.push(file.download_url);
                }
            } else if (file.type === 'dir') {
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

// GitHub থেকে ইমেজ নিয়ে cache করার ফাংশন
async function getImagesFromGitHub() {
    const images = await fetchImagesRecursive();

    if (images.length > 0) {
        localStorage.setItem('backgroundImages', JSON.stringify(images));
        localStorage.setItem('imagesLastUpdated', new Date().toISOString());
    }

    return images.length > 0 ? images : JSON.parse(localStorage.getItem('backgroundImages')) || [];
}

// ইমেজ আপডেট করা দরকার কিনা চেক করার ফাংশন
async function getBackgroundImages() {
    const lastUpdated = localStorage.getItem('imagesLastUpdated');
    const cachedImages = localStorage.getItem('backgroundImages');
    
    // 24 ঘণ্টা পূর্ণ হয়েছে কিনা চেক করি
    const twentyFourHoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    
    if (!lastUpdated || !cachedImages || new Date(lastUpdated) < twentyFourHoursAgo) {
        return await getImagesFromGitHub();
    }
    
    return JSON.parse(cachedImages);
}

// লোডিং ডায়ালগ তৈরি করার ফাংশন
function createLoadingDialog() {
    const loadingDialog = document.createElement('div');
    loadingDialog.id = 'loading-dialog';
    loadingDialog.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #loading-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .loading-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-content p {
            margin: 0;
            color: #333;
            font-size: 16px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingDialog);
    
    return loadingDialog;
}

// ব্যাকগ্রাউন্ড আপডেট করার ফাংশন (blur effect সহ)
async function updateBackground() {
    const images = await getBackgroundImages();
    
    if (images.length === 0) {
        console.error('No images available');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];
    
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = function() {
        let backgroundWrapper = document.getElementById('background-wrapper');
        
        if (!backgroundWrapper) {
            backgroundWrapper = document.createElement('div');
            backgroundWrapper.id = 'background-wrapper';
            
            backgroundWrapper.style.position = 'fixed';
            backgroundWrapper.style.top = '0';
            backgroundWrapper.style.left = '0';
            backgroundWrapper.style.width = '100%';
            backgroundWrapper.style.height = '100%';
            backgroundWrapper.style.zIndex = '-1';
            
            document.body.insertBefore(backgroundWrapper, document.body.firstChild);
        }
        
        backgroundWrapper.style.backgroundImage = `url('${imageUrl}')`;
        backgroundWrapper.style.backgroundSize = 'cover';
        backgroundWrapper.style.backgroundPosition = 'center';
        backgroundWrapper.style.backgroundRepeat = 'no-repeat';
        backgroundWrapper.style.backgroundAttachment = 'fixed';
        backgroundWrapper.style.filter = 'blur(10px)';
        backgroundWrapper.style.transform = 'scale(1.1)';
        
        localStorage.setItem('currentBackground', imageUrl);
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
        
        const loadingDialog = document.getElementById('loading-dialog');
        if (loadingDialog) {
            loadingDialog.remove();
        }
    };
}

// পেজ লোড হওয়ার সময় কি করবে
document.addEventListener('DOMContentLoaded', function() {
    createLoadingDialog();
    document.body.style.background = 'none';
    
    const lastBackground = localStorage.getItem('currentBackground');
    const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
    
    if (lastBackground && lastUpdate) {
        const lastUpdateTime = new Date(lastUpdate).getTime();
        const currentTime = new Date().getTime();
        
        // 24 ঘণ্টা পার হয়নি
        if (currentTime - lastUpdateTime < 24 * 60 * 60 * 1000) {
            let backgroundWrapper = document.getElementById('background-wrapper');
            if (!backgroundWrapper) {
                backgroundWrapper = document.createElement('div');
                backgroundWrapper.id = 'background-wrapper';
                
                backgroundWrapper.style.position = 'fixed';
                backgroundWrapper.style.top = '0';
                backgroundWrapper.style.left = '0';
                backgroundWrapper.style.width = '100%';
                backgroundWrapper.style.height = '100%';
                backgroundWrapper.style.zIndex = '-1';
                
                document.body.insertBefore(backgroundWrapper, document.body.firstChild);
            }
            
            backgroundWrapper.style.backgroundImage = `url('${lastBackground}')`;
            backgroundWrapper.style.backgroundSize = 'cover';
            backgroundWrapper.style.backgroundPosition = 'center';
            backgroundWrapper.style.backgroundRepeat = 'no-repeat';
            backgroundWrapper.style.backgroundAttachment = 'fixed';
            backgroundWrapper.style.filter = 'blur(10px)';
            backgroundWrapper.style.transform = 'scale(1.1)';
            
            const loadingDialog = document.getElementById('loading-dialog');
            if (loadingDialog) {
                loadingDialog.remove();
            }
        } else {
            checkBackgroundUpdate();
        }
    } else {
        checkBackgroundUpdate();
    }
});

// ব্যাকগ্রাউন্ড আপডেট চেক করার ফাংশন
async function checkBackgroundUpdate() {
    const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
    
    if (!lastUpdate) {
        await updateBackground();
        return;
    }

    const lastUpdateTime = new Date(lastUpdate).getTime();
    const currentTime = new Date().getTime();
    
    // 24 ঘণ্টা পূর্ণ হয়েছে কিনা চেক করি
    if (currentTime - lastUpdateTime >= 24 * 60 * 60 * 1000) {
        await updateBackground();
    }
}

// প্রতি ঘণ্টায় একবার চেক করি
setInterval(checkBackgroundUpdate, 1000 * 60 * 60);











/*// Function to fetch images from GitHub repository recursively
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

// লোডিং ডায়ালগ তৈরি করার ফাংশন
function createLoadingDialog() {
    const loadingDialog = document.createElement('div');
    loadingDialog.id = 'loading-dialog';
    loadingDialog.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    // লোডিং ডায়ালগের স্টাইল
    const style = document.createElement('style');
    style.textContent = `
        #loading-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .loading-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-content p {
            margin: 0;
            color: #333;
            font-size: 16px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingDialog);
    
    return loadingDialog;
}

// Modified updateBackground function with blur effect
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
        // প্রথমে একটি wrapper div তৈরি করি যা blur effect ধারণ করবে
        let backgroundWrapper = document.getElementById('background-wrapper');
        
        if (!backgroundWrapper) {
            backgroundWrapper = document.createElement('div');
            backgroundWrapper.id = 'background-wrapper';
            
            // Wrapper এর style সেট করি
            backgroundWrapper.style.position = 'fixed';
            backgroundWrapper.style.top = '0';
            backgroundWrapper.style.left = '0';
            backgroundWrapper.style.width = '100%';
            backgroundWrapper.style.height = '100%';
            backgroundWrapper.style.zIndex = '-1';
            
            document.body.insertBefore(backgroundWrapper, document.body.firstChild);
        }
        
        backgroundWrapper.style.backgroundImage = `url('${imageUrl}')`;
        backgroundWrapper.style.backgroundSize = 'cover';
        backgroundWrapper.style.backgroundPosition = 'center';
        backgroundWrapper.style.backgroundRepeat = 'no-repeat';
        backgroundWrapper.style.backgroundAttachment = 'fixed';
        backgroundWrapper.style.filter = 'blur(10px)';
        backgroundWrapper.style.transform = 'scale(1.1)';
        
        localStorage.setItem('currentBackground', imageUrl);
        localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());
        
        // লোডিং ডায়ালগ রিমুভ করি
        const loadingDialog = document.getElementById('loading-dialog');
        if (loadingDialog) {
            loadingDialog.remove();
        }
    };
}

// Add necessary CSS to body and show loading dialog
document.addEventListener('DOMContentLoaded', function() {
    // লোডিং ডায়ালগ দেখাই
    createLoadingDialog();
    
    // Set body background to transparent
    document.body.style.background = 'none';
    
    // Try to restore last background
    const lastBackground = localStorage.getItem('currentBackground');
    if (lastBackground) {
        updateBackground();
    } else {
        checkBackgroundUpdate();
    }
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
