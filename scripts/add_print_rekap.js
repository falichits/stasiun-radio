const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

const newFunc = `
        function printRekapanCuti() {
            const bulan = document.getElementById('filterBulanCuti').value; // format YYYY-MM
            const penyiarId = document.getElementById('filterPenyiarCuti').value;

            let filteredLeaves = leaveRequests;
            
            let filterText = "Periode: Semua Waktu";
            if (bulan) {
                const [year, month] = bulan.split('-');
                const monthName = new Date(year, month - 1, 1).toLocaleString('id-ID', { month: 'long' });
                filterText = \`Periode: \${monthName} \${year}\`;
                
                filteredLeaves = filteredLeaves.filter(l => l.startDate.startsWith(bulan) || l.endDate.startsWith(bulan));
            }

            if (penyiarId !== 'all') {
                const penyiar = penyiarData.find(p => p.id === penyiarId);
                filterText += \` | Penyiar: \${penyiar ? penyiar.name : 'Unknown'}\`;
                filteredLeaves = filteredLeaves.filter(l => l.penyiarId === penyiarId);
            } else {
                filterText += ' | Penyiar: Semua Penyiar';
            }

            const htmlContent = \`
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">REKAPITULASI PENGAJUAN CUTI & IZIN PENYIAR</h3>
                        <p class="text-xs text-slate-600">\${filterText}</p>
                    </div>
                    
                    <table class="w-full text-left border-collapse border border-slate-300">
                        <thead class="bg-slate-100">
                            <tr>
                                <th class="border border-slate-300 px-3 py-2">ID</th>
                                <th class="border border-slate-300 px-3 py-2">Nama Penyiar</th>
                                <th class="border border-slate-300 px-3 py-2">Jenis</th>
                                <th class="border border-slate-300 px-3 py-2">Tanggal</th>
                                <th class="border border-slate-300 px-3 py-2">Alasan</th>
                                <th class="border border-slate-300 px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${filteredLeaves.length > 0 ? filteredLeaves.map(l => \`
                                <tr>
                                    <td class="border border-slate-300 px-3 py-2">\${l.id}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-semibold">\${l.penyiarName}</td>
                                    <td class="border border-slate-300 px-3 py-2">\${l.type}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-mono">\${l.startDate} s/d \${l.endDate}</td>
                                    <td class="border border-slate-300 px-3 py-2">\${l.reason}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-bold \${l.status === 'ACC' ? 'text-emerald-600' : (l.status === 'Ditolak' ? 'text-rose-600' : 'text-amber-600')}">\${l.status}</td>
                                </tr>
                            \`).join('') : \`
                                <tr>
                                    <td colspan="6" class="border border-slate-300 px-3 py-4 text-center text-slate-500 italic">Tidak ada data cuti/izin pada periode ini.</td>
                                </tr>
                            \`}
                        </tbody>
                    </table>
                </div>
            \`;
            
            triggerPrintModal(htmlContent);
        }
`;

code = code.replace('function renderCutiView() {', newFunc + '\n          function renderCutiView() {');
code = code.replace('window.renderCutiView = renderCutiView;', 'window.renderCutiView = renderCutiView;\nwindow.printRekapanCuti = printRekapanCuti;');
fs.writeFileSync('src/legacy.js', code);
