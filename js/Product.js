// Products data
const productsData = [
    {
        "title": "Product: Hand Grip 5-60Kg Adjustable Hand Strengthener Grip Trainer - Hand Grip - Lifestyle",
        "text": "I found this great deal on Daraz! Check it out! \nProduct Price: ৳550\nDiscount Price: ৳145",
        "button": "Buy Now",
        "url": "https://s.daraz.com.bd/s.ZSqA5?cc",
        "image": "https://static-01.daraz.com.bd/p/7b621f977a71e0423fce9296b1987fb4.jpg"
    },
    {
        "title": "New Feature",
        "text": "Check to click here",
        "button": "Buy Now",
        "url": "https://amzn.to/3NOG3er",
        "image": "https://raw.githubusercontent.com/MustakimRidoyMR/MustakimRidoyMR.github.io/main/Images/Apk%20Cover%20Photo.jpeg"
    },
    {
        "title": "Update version 1",
        "text": "Check it now",
        "button": "Buy Now",
        "url": "https://amzn.to/3NOG3er",
        "image": "https://t3.ftcdn.net/jpg/02/93/37/28/360_F_293372811_2gpgNsJ3TQSPsfAbmBPIYfuKfAw70bpt.jpg"
    },
    {
        "title": "Use AI",
        "text": "Use AI for your work",
        "button": "Try Now",
        "url": "https://mustakimridoymr.github.io",
        "image": "https://incubator.ucf.edu/wp-content/uploads/2023/07/artificial-intelligence-new-technology-science-futuristic-abstract-human-brain-ai-technology-cpu-central-processor-unit-c[...]"
    }
];

// Products data লোড করার ফাংশন
async function loadProductsFromJSON() {
    try {
        // JSON ফাইল থেকে ডেটা fetch করা
        const response = await fetch('https://raw.githubusercontent.com/MustakimRidoyMR/MustakimRidoyMR.github.io/main/MR%20Database/affiliate.json');
        
        if (!response.ok) {
            throw new Error('ডেটা লোড করতে সমস্যা হয়েছে');
        }

        const products = await response.json();
        const grid = document.getElementById('products-grid');
        grid.innerHTML = ''; // আগের সব কনটেন্ট মুছে ফেলা
        
        // প্রতিটি প্রোডাক্টের জন্য কার্ড তৈরি করা
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'card-3d bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden hover-scale group';
            productCard.style.animationDelay = `${index * 0.2}s`;
            
            const isSpecialOffer = product.text && product.text.includes('৳');
            const buttonColor = product.button && product.button.includes('Try') ? 'bg-accent' : 'bg-secondary';
            
            productCard.innerHTML = `
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" 
                         class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                         onerror="this.src='https://via.placeholder.com/400x256.png?text=Image+Not+Found'">
                    ${isSpecialOffer ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">Special Offer!</div>' : ''}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div class="p-6">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">${product.title}</h4>
                    <p class="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">${product.text || ''}</p>
                    <a href="${product.url}" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center justify-center w-full ${buttonColor} text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                        <i class="fas fa-${product.button && product.button.includes('Try') ? 'rocket' : 'shopping-cart'} mr-2"></i>
                        ${product.button || 'Buy Now'}
                    </a>
                </div>
            `;
            
            grid.appendChild(productCard);
        });
    } catch (error) {
        console.error('ডেটা লোড করতে সমস্যা:', error);
        // এরর হলে ফলব্যাক ডেটা ব্যবহার করা
        loadProducts();
    }
}

// এই ফাংশনটি পেজ লোডের সময় আইটেমগুলো রেন্ডার করে
function loadProducts() {
    const grid = document.getElementById('products-grid');
    
    productsData.forEach((product, index) => {
        // নতুন div তৈরি করে card-স্টাইল অ্যাপ্লাই করা হয়েছে
        const productCard = document.createElement('div');
        productCard.className = 'card-3d bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden hover-scale group';
        productCard.style.animationDelay = `${index * 0.2}s`;
        
        // যদি প্রোডাক্টের টেক্সটে '৳' থাকে তবে সেটিকে স্পেশ্যাল অফার হিসেবে দেখানো হবে
        const isSpecialOffer = product.text.includes('৳');
        // বাটন কালার নির্ধারণ করা হচ্ছে বাটনের লেখার উপর ভিত্তি করে
        const buttonColor = product.button.includes('Try') ? 'bg-accent' : 'bg-secondary';
        
        // প্রোডাক্টের কার্ডের ভেতরের HTML স্ট্রাকচার
        productCard.innerHTML = `
            <div class="relative overflow-hidden">
                <img src="${product.image}" alt="${product.title}" 
                     class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3[...]">
                ${isSpecialOffer ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">Special Offer!</div>' : ''}
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6">
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">${product.title}</h4>
                <p class="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">${product.text}</p>
                <a href="${product.url}" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center justify-center w-full ${buttonColor} text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                    <i class="fas fa-${product.button.includes('Try') ? 'rocket' : 'shopping-cart'} mr-2"></i>
                    ${product.button}
                </a>
            </div>
        `;
        
        grid.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', loadProductsFromJSON);
