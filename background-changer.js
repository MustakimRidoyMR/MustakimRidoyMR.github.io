
    // GitHub থেকে ইমেজ fetch করার recursive ফাংশন
    async function fetchImagesRecursive(path = '') {
        try {
            const owner = 'MustakimRidoyMR';
            const repo = 'MustakimRidoyMR.github.io';
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

    // ইমেজ ফেচ ও ক্যাশ
    async function getImagesFromGitHub() {
        const images = await fetchImagesRecursive();

        if (images.length > 0) {
            localStorage.setItem('backgroundImages', JSON.stringify(images));
            localStorage.setItem('imagesLastUpdated', new Date().toISOString());
        }

        return images;
    }

    // ইমেজ আপডেট লাগবে কিনা চেক
    async function getBackgroundImages() {
        const lastUpdated = localStorage.getItem('imagesLastUpdated');
        const cachedImages = localStorage.getItem('backgroundImages');
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        if (!lastUpdated || !cachedImages || new Date(lastUpdated) < twentyFourHoursAgo) {
            return await getImagesFromGitHub();
        }

        try {
            return JSON.parse(cachedImages);
        } catch (e) {
            return [];
        }
    }

    // লোডিং ডায়ালগ
    function createLoadingDialog() {
        const loadingDialog = document.createElement('div');
        loadingDialog.id = 'loading-dialog';
        loadingDialog.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
                <p id="cancel-loading" style="cursor:pointer;color:red;">Cancel</p>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #loading-dialog {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .loading-content {
                background: white;
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
        `;
        document.head.appendChild(style);
        document.body.appendChild(loadingDialog);
    }

    // ব্যাকগ্রাউন্ড আপডেট ফাংশন
    async function updateBackground() {
        const images = await getBackgroundImages();
        if (images.length === 0) {
            console.error('No images found');
            return;
        }

        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex];

        const img = new Image();
        img.src = imageUrl;

        img.onload = function () {
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
            backgroundWrapper.style.opacity = '0';
            backgroundWrapper.style.transition = 'opacity 1s ease';
            setTimeout(() => {
                backgroundWrapper.style.opacity = '1';
            }, 100);

            localStorage.setItem('currentBackground', imageUrl);
            localStorage.setItem('lastBackgroundUpdate', new Date().toISOString());

            const loadingDialog = document.getElementById('loading-dialog');
            if (loadingDialog) {
                loadingDialog.remove();
            }
        };

        img.onerror = function () {
            console.error('Failed to load image:', imageUrl);
        };
    }

    // পেজ লোডে ব্যাকগ্রাউন্ড লোড হ্যান্ডলার
    document.addEventListener('DOMContentLoaded', function () {
        createLoadingDialog();
        document.body.style.background = 'none';

        const lastBackground = localStorage.getItem('currentBackground');
        const lastUpdate = localStorage.getItem('lastBackgroundUpdate');

        if (lastBackground && lastUpdate) {
            const lastUpdateTime = new Date(lastUpdate).getTime();
            const currentTime = Date.now();

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

    // ব্যাকগ্রাউন্ড আপডেট চেক
    async function checkBackgroundUpdate() {
        const lastUpdate = localStorage.getItem('lastBackgroundUpdate');
        if (!lastUpdate || Date.now() - new Date(lastUpdate).getTime() >= 24 * 60 * 60 * 1000) {
            await updateBackground();
        }
    }

    // প্রতি ঘণ্টায় একবার চেক
    setInterval(checkBackgroundUpdate, 1000 * 60 * 60);

    // Cancel Loading Event
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'cancel-loading') {
            const loadingDialog = document.getElementById('loading-dialog');
            if (loadingDialog) loadingDialog.remove();
        }
    });
