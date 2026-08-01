const fs = require('fs');
let c = fs.readFileSync('src/legacy.js', 'utf8');

c = c.replace(
    /currentUser = \{\n\s*role: 'admin',\n\s*data: \{ \.\.\.adminData \}\n\s*\};\n\s*setupDashboardApp\(\);/g,
    `currentUser = {
                    role: 'admin',
                    data: { ...adminData }
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                setupDashboardApp();`
);

c = c.replace(
    /currentUser = \{\n\s*role: 'penyiar',\n\s*data: foundPenyiar\n\s*\};\n\s*setupDashboardApp\(\);/g,
    `currentUser = {
                    role: 'penyiar',
                    data: foundPenyiar
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                setupDashboardApp();`
);

c = c.replace(
    /currentUser = null;\n\s*if \(checkoutTimerInterval\) clearInterval\(checkoutTimerInterval\);/g,
    `currentUser = null;
            localStorage.removeItem('currentUser');
            if (checkoutTimerInterval) clearInterval(checkoutTimerInterval);`
);

c = c.replace(
    /async function initApp\(\) \{ await loadInitialData\(\);\n\s*startClock\(\);/g,
    `async function initApp() { await loadInitialData();
            if (localStorage.getItem('currentUser')) {
                currentUser = JSON.parse(localStorage.getItem('currentUser'));
            }
            startClock();`
);

fs.writeFileSync('src/legacy.js', c);
console.log('Login persistence fixed!');
