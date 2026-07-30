const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// Extract CSS
const styleStart = html.indexOf('<style>');
const styleEnd = html.lastIndexOf('</style>');
if (styleStart !== -1 && styleEnd !== -1) {
    const styleContent = html.substring(styleStart + 7, styleEnd);
    const cssContent = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n` + styleContent;
    fs.writeFileSync('src/style.css', cssContent);
    html = html.substring(0, styleStart) + html.substring(styleEnd + 8);
}

// Remove Tailwind CDN
html = html.replace(/<script src="https:\/\/cdn.tailwindcss.com"><\/script>/, '');
// Remove tailwind config script
const twConfigStart = html.indexOf('<script>\n        tailwind.config');
if (twConfigStart !== -1) {
    const twConfigEnd = html.indexOf('</script>', twConfigStart);
    html = html.substring(0, twConfigStart) + html.substring(twConfigEnd + 9);
}

fs.writeFileSync('index.html', html);
