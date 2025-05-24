// ad-related functionality
let adShown = false;

function showAdWithConsent() {
    if (!adShown && Math.random() < 0.3) {  // 30% chance to show ad
        const adUrl = "https://www.profitableratecpm.com/m7j44g75?key=90f36207646d410dc5c03e6c6816a890";
        try {
            window.open(adUrl, "_blank");
            adShown = true;
            setTimeout(() => { adShown = false; }, 1800000); // Reset after 30 minutes
        } catch (error) {
            console.error("Error opening ad:", error);
        }
    }
    
    // Schedule next ad prompt with longer delay (10-20 minutes)
    const nextDelay = Math.floor(Math.random() * 600000) + 600000;
    setTimeout(showAdWithConsent, nextDelay);
}

// Start the ad consent flow after 5 minutes 
setTimeout(showAdWithConsent, 300000);
