const fs = require('fs');
const legacyPath = 'src/legacy.js';
let legacyLines = fs.readFileSync(legacyPath, 'utf8').split(/\r?\n/);

for (let i = 0; i < legacyLines.length; i++) {
    if (legacyLines[i].includes("const modal = document.getElementById('printModal');")) {
        let isInside = false;
        for(let j=i; j>i-30; j--) {
            if (legacyLines[j] && legacyLines[j].includes('kopSignee')) {
                isInside = true; break;
            }
        }
        if (isInside && !legacyLines[i-1].includes('kopSignatureLeft')) {
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

fs.writeFileSync(legacyPath, legacyLines.join('\n'));
console.log('Fixed triggerPrintModal!');
