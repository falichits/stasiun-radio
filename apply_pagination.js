const fs = require('fs');
const file = 'src/legacy.js';
const lines = fs.readFileSync(file, 'utf8').split('\n');

let newLines = [];
let i = 0;

while (i < lines.length) {
    let line = lines[i];

    // Replacement 1: Tbody initial mapping
    if (line.includes('<tbody id="adminRekapanTableBody"')) {
        newLines.push(line);
        // skip until </tbody>
        i++;
        while (i < lines.length && !lines[i].includes('</tbody>')) {
            i++;
        }
        newLines.push(lines[i]); // push </tbody>
        i++;
        while (i < lines.length && !lines[i].includes('</table>')) {
            newLines.push(lines[i]);
            i++;
        }
        newLines.push(lines[i]); // push </table>
        i++; // </div>
        newLines.push(lines[i]);
        // now inject pagination container
        newLines.push('                            <div id="adminRekapanPagination" class="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/50">');
        newLines.push('                            </div>');
        
    }
    // Replacement 2: Inject filterAdminRekapan(1) after innerHTML assignment
    else if (line.includes('`;') && i > 1800 && i < 1850 && lines[i-1] && lines[i-1].includes('</div>')) {
        newLines.push(line);
        newLines.push('                setTimeout(() => filterAdminRekapan(1), 0);');
    }
    // Replacement 3: filterAdminRekapan function definition
    else if (line.includes('function filterAdminRekapan() {')) {
        newLines.push('        let adminRekapanCurrentPage = 1;');
        newLines.push('        function filterAdminRekapan(page = null) {');
        newLines.push("            const selectEl = document.getElementById('adminRekapanFilterSelect');");
        newLines.push("            if (!selectEl) return;");
        newLines.push("            const val = selectEl.value;");
        newLines.push("            const tbody = document.getElementById('adminRekapanTableBody');");
        newLines.push("            const paginationContainer = document.getElementById('adminRekapanPagination');");
        newLines.push("");
        newLines.push("            if (page !== null) {");
        newLines.push("                adminRekapanCurrentPage = page;");
        newLines.push("            } else {");
        newLines.push("                adminRekapanCurrentPage = 1;");
        newLines.push("            }");
        newLines.push("");
        newLines.push("            let filtered = attendanceLogs;");
        newLines.push("            if (val !== 'GLOBAL') {");
        newLines.push("                filtered = attendanceLogs.filter(l => l.penyiarId === val);");
        newLines.push("            }");
        newLines.push("");
        newLines.push("            const itemsPerPage = 10;");
        newLines.push("            const totalItems = filtered.length;");
        newLines.push("            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;");
        newLines.push("            ");
        newLines.push("            if (adminRekapanCurrentPage < 1) adminRekapanCurrentPage = 1;");
        newLines.push("            if (adminRekapanCurrentPage > totalPages) adminRekapanCurrentPage = totalPages;");
        newLines.push("");
        newLines.push("            const startIndex = (adminRekapanCurrentPage - 1) * itemsPerPage;");
        newLines.push("            const endIndex = startIndex + itemsPerPage;");
        newLines.push("            const paginatedData = filtered.slice(startIndex, endIndex);");
        newLines.push("");
        newLines.push("            if (tbody) {");
        newLines.push("                tbody.innerHTML = paginatedData.map(l => `");
        newLines.push('                    <tr class="hover:bg-slate-800/30">');
        newLines.push('                        <td class="p-4 font-bold text-white">${l.penyiarName}</td>');
        newLines.push('                        <td class="p-4 text-indigo-300">${l.programName}</td>');
        newLines.push('                        <td class="p-4 font-mono text-slate-400">${l.date}</td>');
        newLines.push('                        <td class="p-4 font-mono text-xs">${l.checkIn} - ${l.checkOut}</td>');
        newLines.push('                        <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">${l.status}</span></td>');
        newLines.push('                    </tr>');
        newLines.push("                `).join('') || `<tr><td colspan=\"5\" class=\"p-6 text-center text-slate-500 italic\">Tidak ada rekapan untuk penyiar ini.</td></tr>`;");
        newLines.push("            }");
        newLines.push("");
        newLines.push("            if (paginationContainer) {");
        newLines.push("                paginationContainer.innerHTML = `");
        newLines.push('                    <div class="text-xs text-slate-400">');
        newLines.push('                        Menampilkan <span class="font-bold text-white">${totalItems === 0 ? 0 : startIndex + 1}</span> ');
        newLines.push('                        sampai <span class="font-bold text-white">${Math.min(endIndex, totalItems)}</span> ');
        newLines.push('                        dari <span class="font-bold text-white">${totalItems}</span> data');
        newLines.push('                    </div>');
        newLines.push('                    <div class="flex items-center gap-2">');
        newLines.push('                        <button onclick="filterAdminRekapan(${adminRekapanCurrentPage - 1})" ${adminRekapanCurrentPage === 1 ? \'disabled\' : \'\'} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors">');
        newLines.push('                            <i class="fa-solid fa-chevron-left"></i>');
        newLines.push('                        </button>');
        newLines.push('                        <div class="text-xs font-bold text-slate-300 px-3">');
        newLines.push('                            Halaman ${adminRekapanCurrentPage} / ${totalPages}');
        newLines.push('                        </div>');
        newLines.push('                        <button onclick="filterAdminRekapan(${adminRekapanCurrentPage + 1})" ${adminRekapanCurrentPage === totalPages ? \'disabled\' : \'\'} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors">');
        newLines.push('                            <i class="fa-solid fa-chevron-right"></i>');
        newLines.push('                        </button>');
        newLines.push('                    </div>');
        newLines.push("                `;");
        newLines.push("            }");
        newLines.push("        }");
        
        // skip old function
        i++;
        while (i < lines.length && !lines[i].includes('function downloadSelectedRekapanPDF()')) {
            i++;
        }
        continue;
    }
    else {
        newLines.push(line);
    }
    i++;
}

// Write the lines with the original CRLF format if needed. I will use \n and let git handle it or \r\n if original was \r\n
const eol = lines[0] && lines[0].endsWith('\r') ? '\r\n' : '\n';
fs.writeFileSync(file, newLines.map(l => l.replace(/\r$/, '')).join(eol));
console.log("Pagination injected via script.");
