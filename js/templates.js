const templates = {
    template1: {
        name: "Basic HTML Structure",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Web Page</h1>
    <p>This is a simple HTML template to get you started!</p>
</body>
</html>`,
        description: "A clean, basic HTML template with inline CSS"
    },
    template2: {
        name: "Responsive Landing Page",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
            padding: 50px 0;
        }
        .hero {
            text-align: center;
            color: #333;
        }
        .hero h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        .hero p {
            max-width: 600px;
            margin: 0 auto 30px;
        }
        .btn {
            display: inline-block;
            background-color: #5D5CDE;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Welcome to Our Website</h1>
            <p>Discover amazing things with our platform. Simple, powerful, and innovative solutions await you.</p>
            <a href="#" class="btn">Get Started</a>
        </div>
    </div>
</body>
</html>`,
        description: "A modern, responsive landing page template"
    },
    template3: {
        name: "CSS Grid Layout",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Grid Layout</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .grid-item {
            background-color: white;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="grid-container">
        <div class="grid-item">
            <h2>Item 1</h2>
            <p>Description of item 1</p>
        </div>
        <div class="grid-item">
            <h2>Item 2</h2>
            <p>Description of item 2</p>
        </div>
        <div class="grid-item">
            <h2>Item 3</h2>
            <p>Description of item 3</p>
        </div>
        <div class="grid-item">
            <h2>Item 4</h2>
            <p>Description of item 4</p>
        </div>
    </div>
</body>
</html>`,
        description: "A responsive grid layout with cards"
    }
};

// Automatically populate template cards
document.addEventListener('DOMContentLoaded', () => {
    const templateContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-4');
    
    Object.keys(templates).forEach(key => {
        const template = templates[key];
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card clickable bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2';
        templateCard.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-base font-semibold text-indigo-600 dark:text-indigo-400">${template.name}</h3>
                <button class="use-template-btn text-sm bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors">
                    Use Template
                </button>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">${template.description}</p>
            <pre class="text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-hidden max-h-24"><code>${escapeHTML(template.code.substring(0, 200) + '...')}</code></pre>
        `;
        
        // Add event listener to use template
        templateCard.querySelector('.use-template-btn').addEventListener('click', () => {
            codeMirrorEditor.setValue(template.code);
            saveCurrentFile();
            showToast(`Loaded template: ${template.name}`, 'success');
        });
        
        templateContainer.appendChild(templateCard);
    });
});
