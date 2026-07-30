const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// Replace date and datetime-local inputs to have [color-scheme:dark]
code = code.replace(/type="date"(.*?)class="(.*?)"/g, 'type="date"$1class="$2 [color-scheme:dark]"');
code = code.replace(/type="datetime-local"(.*?)class="(.*?)"/g, 'type="datetime-local"$1class="$2 [color-scheme:dark]"');

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully fixed date inputs.");
