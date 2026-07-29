const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace('<!-- Tailwind CSS CDN -->\r\n    \r\n\r\n    <!-- Font Awesome Icons -->', '<!-- Tailwind CSS CDN -->\r\n    <script src="https://cdn.tailwindcss.com"></script>\r\n\r\n    <!-- Font Awesome Icons -->');
// also try \n instead of \r\n
code = code.replace('<!-- Tailwind CSS CDN -->\n    \n\n    <!-- Font Awesome Icons -->', '<!-- Tailwind CSS CDN -->\n    <script src="https://cdn.tailwindcss.com"></script>\n\n    <!-- Font Awesome Icons -->');
fs.writeFileSync('index.html', code, 'utf8');
console.log("Fixed CDN.");
