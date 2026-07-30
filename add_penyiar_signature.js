const fs = require('fs');

// 1. Modify index.html
const indexHtmlPath = 'index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const oldIndexDiv = `                <div class="mt-12 pt-6 flex justify-between items-end font-sans text-xs">
                    <div>
                        <p class="text-slate-500">Dokumen ini diterbitkan secara elektronik oleh Portal Resmi JCCFM.</p>
                        <p class="text-[10px] text-slate-400 mt-1">Verified Security Token: JCC-PDF-AUTH-2026</p>
                    </div>`;
const newIndexDiv = `                <div class="mt-12 pt-6 flex justify-between items-end font-sans text-xs">
                    <div id="kopSignatureLeft">
                        <p class="text-slate-500">Dokumen ini diterbitkan secara elektronik oleh Portal Resmi JCCFM.</p>
                        <p class="text-[10px] text-slate-400 mt-1">Verified Security Token: JCC-PDF-AUTH-2026</p>
                    </div>`;
indexHtml = indexHtml.replace(oldIndexDiv, newIndexDiv);
fs.writeFileSync(indexHtmlPath, indexHtml);

// 2. Modify legacy.js
const legacyPath = 'src/legacy.js';
let legacyCode = fs.readFileSync(legacyPath, 'utf8');

// Update triggerPrintModal
const oldTriggerPrintModal = `        function triggerPrintModal(htmlBody) {
            document.getElementById('kopStationName').innerText = kopSuratConfig.stationName;`;
const newTriggerPrintModal = `        function triggerPrintModal(htmlBody, penyiarName = null) {
            document.getElementById('kopStationName').innerText = kopSuratConfig.stationName;`;
legacyCode = legacyCode.replace(oldTriggerPrintModal, newTriggerPrintModal);

const oldTriggerPrintModalEnd = `            const modal = document.getElementById('printModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }`;
const newTriggerPrintModalEnd = `            const leftArea = document.getElementById('kopSignatureLeft');
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
            }

            const modal = document.getElementById('printModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }`;
legacyCode = legacyCode.replace(oldTriggerPrintModalEnd, newTriggerPrintModalEnd);

// Update exportPenyiarAttendancePDF call
const oldExportPenyiarAttendancePDFCall = `            triggerPrintModal(htmlContent);
        }

                function exportAdminPersonalPDF`;
const newExportPenyiarAttendancePDFCall = `            triggerPrintModal(htmlContent, p.name);
        }

                function exportAdminPersonalPDF`;
// Wait, the "function exportAdminPersonalPDF" might have different spacing. Let's do it safer.
legacyCode = legacyCode.replace(`            triggerPrintModal(htmlContent);\n        }\n\n                function exportAdminPersonalPDF(penyiarId)`, `            triggerPrintModal(htmlContent, p.name);\n        }\n\n                function exportAdminPersonalPDF(penyiarId)`);

// It's safer to use regex or split to replace triggerPrintModal(htmlContent) inside specific functions.
// I will rewrite this part below to be safer.
fs.writeFileSync(legacyPath, legacyCode);
console.log("Done");
