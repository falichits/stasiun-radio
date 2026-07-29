const fs = require('fs');
let js = fs.readFileSync('src/legacy.js', 'utf-8');
const funcs = js.match(/^\s*function (\w+)\(/gm) || [];
let windowAttaches = '';
funcs.forEach(f => {
    const match = f.match(/function (\w+)/);
    if(match) {
        windowAttaches += `\nwindow.${match[1]} = ${match[1]};`;
    }
});
fs.writeFileSync('src/legacy.js', js + windowAttaches);
console.log('Attached ' + funcs.length + ' functions to window.');
