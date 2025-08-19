function showCompletionMessage() {

    showFallbackAdDialog(fallbackAdUrl);
        try {
    if (typeof AndroidApp !== "undefined" && typeof AndroidApp.onLevelComplete === "function") {
        // অ্যান্ড্রয়েডের জন্য কল
        AndroidApp.onLevelComplete(levelBonusCoins);
    } else if (window.chrome && window.chrome.webview) {
        // WebView2 (.exe অ্যাপ) এর জন্য কল
        // 'csHost' নামটি আমরা C# কোডে ডিফাইন করব
        window.chrome.webview.hostObjects.csHost.OnLevelComplete(levelBonusCoins);
    } else {
        // নেটিভ পরিবেশ না পেলে, আমাদের তৈরি করা ফলব্যাক ডায়ালগ দেখাবে
        console.log('Fallback: Not a native environment. Showing ad dialog.');
    }
   } catch (err) {
    // নেটিভ ফাংশন কল করতে ব্যর্থ হলেও ফলব্যাক ডায়ালগ দেখাবে
    console.error("Fallback: Failed to call native host. Showing ad dialog.", err);
   }
}
        
const levelBonusCoins = 10;
const fallbackAdUrl = 'https://mymrroom.netlify.app/Ads.html';
function showFallbackAdDialog(url) {
    if (document.getElementById('fallbackAdOverlay')) {
        return;
    }
    const overlay = document.createElement('div');
    const content = document.createElement('div');
    const closeBtn = document.createElement('span');
    const iframe = document.createElement('iframe');
    overlay.id = 'fallbackAdOverlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });
    Object.assign(content.style, {
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '10px',
        width: '80%',
        height: '85%',
        maxWidth: '500px',
        position: 'relative',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    });
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '30px',
        height: '30px',
        backgroundColor: 'white',
        color: '#333',
        borderRadius: '50%',
        border: '2px solid #333',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        lineHeight: '28px'
    });
    closeBtn.innerHTML = '&times;';
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none'
    });
    iframe.src = url;
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };
    content.appendChild(closeBtn);
    content.appendChild(iframe);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    setTimeout(function() {
        if (document.getElementById('fallbackAdOverlay')) {
            closeBtn.style.display = 'flex';
        }
    }, 5000);
}
