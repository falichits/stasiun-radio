const fs = require('fs');

const indexHtmlPath = 'index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const legacyPath = 'src/legacy.js';
let legacyCode = fs.readFileSync(legacyPath, 'utf8');

// 1. Update index.html
let indexLines = indexHtml.split(/\r?\n/);
let inFooter = false;
for (let i = 0; i < indexLines.length; i++) {
    if (indexLines[i].includes('<!-- KOP SURAT FOOTER / SIGNATURE -->')) {
        inFooter = true;
    }
    if (inFooter && indexLines[i].includes('<div') && !indexLines[i].includes('id="kopSignatureLeft"') && !indexLines[i].includes('justify-between') && !indexLines[i].includes('kopCityDate') && !indexLines[i].includes('kopTtdArea')) {
        // Find the first raw div in footer that isn't the flex container or right side
        if (indexLines[i].includes('<div>') && indexLines[i+1].includes('Dokumen ini diterbitkan')) {
            indexLines[i] = indexLines[i].replace('<div>', '<div id="kopSignatureLeft">');
            break;
        }
    }
}
fs.writeFileSync(indexHtmlPath, indexLines.join('\n'));

// 2. Update legacy.js triggerPrintModal
let legacyLines = legacyCode.split(/\r?\n/);
for (let i = 0; i < legacyLines.length; i++) {
    if (legacyLines[i].includes('function triggerPrintModal(htmlBody) {')) {
        legacyLines[i] = legacyLines[i].replace('function triggerPrintModal(htmlBody)', 'function triggerPrintModal(htmlBody, penyiarName = null)');
    }
    if (legacyLines[i].includes('const modal = document.getElementById(\'printModal\');') && legacyLines[i-1] && legacyLines[i-1].includes('}')) {
        // Let's inject logic right before fetching modal
        // wait, let's look back slightly to ensure we're inside triggerPrintModal
        let isInside = false;
        for(let j=i; j>i-30; j--) {
            if (legacyLines[j] && legacyLines[j].includes('kopSignee')) {
                isInside = true; break;
            }
        }
        if (isInside) {
            let injection = `            const leftArea = document.getElementById('kopSignatureLeft');
            if (leftArea) {
                if (penyiarName) {
                    leftArea.innerHTML = \`
                        <div class="text-center min-w-[200px]">
                            <p class="text-slate-600 mb-1">Menyetujui,</p>
                            <p class="font-bold text-slate-900">Penyiar</p>
                            <div class="h-16 my-1"></div>
                            <p class="font-bold text-slate-900 underline">\${penyiarName}</p>
                        </div>
                    \`;
                } else {
                    leftArea.innerHTML = \`
                        <p class="text-slate-500">Dokumen ini diterbitkan secara elektronik oleh Portal Resmi JCCFM.</p>
                        <p class="text-[10px] text-slate-400 mt-1">Verified Security Token: JCC-PDF-AUTH-2026</p>
                    \`;
                }
            }`;
            legacyLines.splice(i, 0, injection);
            break;
        }
    }
}

// 3. Update export calls
for (let i = 0; i < legacyLines.length; i++) {
    if (legacyLines[i].includes('function exportPenyiarAttendancePDF()')) {
        for(let j = i; j < i + 60; j++) {
            if (legacyLines[j] && legacyLines[j].includes('triggerPrintModal(htmlContent);')) {
                legacyLines[j] = legacyLines[j].replace('triggerPrintModal(htmlContent);', 'triggerPrintModal(htmlContent, p.name);');
                break;
            }
        }
    }
    if (legacyLines[i].includes('function exportAdminPersonalPDF(')) {
        for(let j = i; j < i + 60; j++) {
            if (legacyLines[j] && legacyLines[j].includes('triggerPrintModal(htmlContent);')) {
                legacyLines[j] = legacyLines[j].replace('triggerPrintModal(htmlContent);', 'triggerPrintModal(htmlContent, p.name);');
                break;
            }
        }
    }
}

fs.writeFileSync(legacyPath, legacyLines.join('\n'));
console.log("Completed JS updates!");
