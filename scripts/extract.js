const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Extract CSS
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>', styleStart);
if (styleStart !== -1 && styleEnd !== -1) {
    const styleContent = html.substring(styleStart + 7, styleEnd);
    const cssContent = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n` + styleContent;
    fs.writeFileSync('src/style.css', cssContent);
    html = html.substring(0, styleStart) + html.substring(styleEnd + 8);
}

// 2. Remove Tailwind CDN and its config script
html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '');
const twConfigStart = html.indexOf('<script>\n        tailwind.config');
if (twConfigStart !== -1) {
    const twConfigEnd = html.indexOf('</script>', twConfigStart);
    html = html.substring(0, twConfigStart) + html.substring(twConfigEnd + 9);
}

// 3. Extract main JS
const lastScriptEnd = html.lastIndexOf('</script>');
const lastScriptStart = html.lastIndexOf('<script>', lastScriptEnd);

if (lastScriptStart !== -1 && lastScriptEnd !== -1) {
    let jsContent = html.substring(lastScriptStart + 8, lastScriptEnd);
    
    // Attach functions to window
    const funcs = jsContent.match(/^\s*function (\w+)\(/gm) || [];
    let windowAttaches = '\n// Auto-attached to window for legacy onclick handlers\n';
    funcs.forEach(f => {
        const m = f.match(/function (\w+)/);
        if(m) {
            windowAttaches += `window.${m[1]} = ${m[1]};\n`;
        }
    });
    jsContent += windowAttaches;
    
    fs.mkdirSync('src', { recursive: true });
    fs.writeFileSync('src/legacy.js', jsContent);
    
    html = html.substring(0, lastScriptStart) + '<script type="module" src="/src/main.js"></script>\n' + html.substring(lastScriptEnd + 9);
}

fs.writeFileSync('index.html', html);
