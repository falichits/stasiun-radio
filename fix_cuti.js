const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

const func = `          function renderCutiView() {
            const container = document.getElementById('viewContainer');

            if (currentUser.role === 'penyiar') {
                const myLeaves = leaveRequests.filter(l => l.penyiarId === currentUser.data.id);

                container.innerHTML = \`
                    <div class="space-y-6">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold text-white">Pengajuan Cuti / Ijin Penyiar</h3>
                                <p class="text-xs text-slate-400">Ajukan surat cuti/ijin sebelum tenggat waktu yang ditentukan admin.</p>
                            </div>
                            <button onclick="openAddLeaveModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                                <i class="fa-solid fa-plus"></i> Ajukan Cuti Baru
                            </button>
                        </div>

                        <div class="space-y-4">
                            \${myLeaves.map(l => \`
                                <div class="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-white">\${l.type}</h4>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${l.status === 'ACC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">\${l.status}</span>
                                        </div>
                                        <p class="text-slate-300">\${l.reason}</p>
                                        <div class="text-[11px] text-slate-400 font-mono">Tanggal: \${l.startDate} s/d \${l.endDate}</div>
                                        <div class="text-[11px] text-rose-400 font-semibold">Tenggat Pengajuan: \${l.deadline}</div>
                                        \${l.adminNotes ? \`<div class="text-indigo-300 italic mt-1">Catatan Admin: \${l.adminNotes}</div>\` : ''}
\${l.status === 'ACC' ? \`<div class="mt-3"><button onclick="printSuratIzin('\${l.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow flex items-center gap-2"><i class="fa-solid fa-print"></i> Cetak Surat Izin</button></div>\` : ''}
                                    </div>
                                </div>
                            \`).join('') || '<p class="text-xs text-slate-500 italic">Belum ada riwayat pengajuan cuti.</p>'}
                        </div>
                    </div>
                \`;
            } else {
                container.innerHTML = \`
                    <div class="space-y-6">
                        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">Persetujuan Cuti / Ijin Penyiar</h3>
                                <p class="text-xs text-slate-400">Review dan berikan persetujuan (ACC) atau penolakan surat cuti.</p>
                            </div>
                            <div class="flex flex-wrap items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50">
                                <input type="month" id="filterBulanCuti" class="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500">
                                <select id="filterPenyiarCuti" class="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[150px]">
                                    <option value="all">Semua Penyiar</option>
                                    \${penyiarData.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('')}
                                </select>
                                <button onclick="printRekapanCuti()" class="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-md transition-colors flex items-center gap-1.5">
                                    <i class="fa-solid fa-print"></i> Cetak Rekapan
                                </button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            \${leaveRequests.map(l => \`
                                <div class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-white">\${l.penyiarName} (\${l.type})</h4>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${l.status === 'ACC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">\${l.status}</span>
                                        </div>
                                        <p class="text-slate-300">\${l.reason}</p>
                                        <div class="text-slate-400 font-mono">Durasi: \${l.startDate} s/d \${l.endDate} | Deadline: \${l.deadline}</div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="approveLeave('\${l.id}', 'ACC')" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">ACC</button>
                                        <button onclick="approveLeave('\${l.id}', 'Ditolak')" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl">Tolak</button>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
        }
`;

code = code.replace('                function printSuratIzin(leaveId) {', func + '\n        function printSuratIzin(leaveId) {');
fs.writeFileSync('src/legacy.js', code);
