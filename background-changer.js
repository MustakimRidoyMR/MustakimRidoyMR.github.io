async function fetchContentsRecursively(owner, repo, path = '') {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        const contents = await response.json();
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        let allImages = [];

        for (const item of contents) {
            if (item.type === 'file') {
                const extension = item.name.toLowerCase().slice(item.name.lastIndexOf('.'));
                if (validImageExtensions.includes(extension)) {
                    allImages.push(item.download_url);
                }
            } else if (item.type === 'dir') {
                // রিকার্সিভলি সাব-ফোল্ডার চেক করা
                const subDirImages = await fetchContentsRecursively(owner, repo, item.path);
                allImages = allImages.concat(subDirImages);
            }
        }
        
        return allImages;
    } catch (error) {
        console.error(`Error fetching contents for path ${path}:`, error);
        return [];
    }
}

async function getImagesFromGitHub() {
    try {
        const owner = 'ridoy520';
        const repo = 'ridoy520.github.io';
        
        // সব ফোল্ডার থেকে ছবি নেওয়া
        const backgroundImages = await fetchContentsRecursively(owner, repo);
        
        // localStorage-এ সেভ করা
        localStorage.setItem('backgroundImages', JSON.stringify(backgroundImages));
        localStorage.setItem('imagesLastUpdated', new Date().toISOString());
        
        return backgroundImages;
    } catch (error) {
        console.error('Error fetching images:', error);
        return JSON.parse(localStorage.getItem('backgroundImages')) || [];
    }
}
