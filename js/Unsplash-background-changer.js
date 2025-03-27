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

/*
এই কোড ব্যবহার করার জন্য আপনাকে:

Unsplash-এ একটি ডেভেলপার অ্যাকাউন্ট খুলতে হবে (https://unsplash.com/developers)
একটি নতুন অ্যাপ্লিকেশন তৈরি করে API key নিতে হবে
কোডে YOUR_UNSPLASH_API_KEY কে আপনার API key দিয়ে রিপ্লেস করতে হবে
এই কোড:

প্রতিদিন নতুন ব্যাকগ্রাউন্ড ইমেজ লোড করবে Unsplash থেকে
র‍্যান্ডম গ্রেডিয়েন্ট কালার জেনারেট করবে
র‍্যান্ডম গ্রেডিয়েন্ট অ্যাঙ্গেল সেট করবে
লোকাল স্টোরেজে লাস্ট আপডেট টাইম সেভ করবে
প্রতি ঘন্টায় চেক করবে যদি নতুন দিন শুরু হয়েছে কিনা
নতুন দিন শুরু হলে ব্যাকগ্রাউন্ড আপডেট করবে
আপনি চাইলে ইমেজ ক্যাটাগরি পরিবর্তন করতে পারেন Unsplash API এর query প্যারামিটার মডিফাই করে। বর্তমানে এটি 'nature' এবং 'landscape' ক্যাটাগরি থেকে ইমেজ নিচ্ছে।*/
