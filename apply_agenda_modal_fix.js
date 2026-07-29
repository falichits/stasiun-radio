const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

const oldModalCode = `
        function openCreateAgendaModal() {
            const body = \`
                <form onsubmit="saveNewAgenda(event)" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Judul Agenda</label>
                        <input type="text" id="agTitle" required placeholder="Judul..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tanggal</label>
                        <input type="date" id="agDate" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Deskripsi / Keterangan</label>
                        <textarea id="agDesc" rows="3" required placeholder="Detail agenda..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">Simpan Agenda</button>
                </form>
            \`;
            openAppModal('Buat Agenda Baru', body);
        }

        function saveNewAgenda(e) {
            e.preventDefault();
            agendas.push({
                id: 'ag-' + Date.now(),
                title: document.getElementById('agTitle').value,
                date: document.getElementById('agDate').value,
                description: document.getElementById('agDesc').value,
                createdBy: currentUser.role === 'admin' ? 'Admin' : currentUser.data.name
            });
            closeAppModal();
            showNotification('Agenda berhasil ditambahkan');
            renderAgendaView();
        }
`;

const newModalCode = `
        function openCreateAgendaModal() {
            let penyiarOptions = '<option value="ALL">Semua Penyiar (Global)</option>';
            penyiars.forEach(p => {
                penyiarOptions += \`<option value="\${p.id}">\${p.name}</option>\`;
            });

            const body = \`
                <form onsubmit="saveNewAgenda(event)" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Judul Agenda</label>
                        <input type="text" id="agTitle" required placeholder="Judul..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Ditujukan Kepada</label>
                        <select id="agTarget" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                            \${penyiarOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Isi Detail / Catatan</label>
                        <textarea id="agDesc" rows="3" required placeholder="Rincian instruksi..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Link Lampiran Dokumentasi (Opsional)</label>
                        <input type="url" id="agLink" placeholder="https://..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tenggat Waktu (Deadline)</label>
                        <input type="date" id="agDate" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">Terbitkan Agenda</button>
                </form>
            \`;
            openAppModal('Buat Agenda Baru', body);
        }

        function saveNewAgenda(e) {
            e.preventDefault();
            agendas.push({
                id: 'ag-' + Date.now(),
                title: document.getElementById('agTitle').value,
                target: document.getElementById('agTarget').value,
                description: document.getElementById('agDesc').value,
                link: document.getElementById('agLink').value,
                date: document.getElementById('agDate').value,
                createdBy: currentUser.role === 'admin' ? 'Admin' : currentUser.data.name
            });
            closeAppModal();
            showNotification('Agenda berhasil diterbitkan');
            renderAgendaView();
        }
`;

code = code.replace(oldModalCode.trim(), newModalCode.trim());

// Also, let's make sure the table shows these new fields if they want it.
// The agenda table currently shows: No, Judul, Tanggal, Deskripsi, Pembuat, Aksi.
// Let's modify the agenda table HTML to show the target and link if any.

const oldTableHeaders = `
                                <tr>
                                    <th class="p-3 rounded-tl-lg">No</th>
                                    <th class="p-3">Judul Agenda</th>
                                    <th class="p-3">Tanggal</th>
                                    <th class="p-3">Deskripsi</th>
                                    <th class="p-3 rounded-tr-lg">Pembuat</th>
                                    \${currentUser.role === 'admin' ? '<th class="p-3">Aksi</th>' : ''}
                                </tr>
`;

const newTableHeaders = `
                                <tr>
                                    <th class="p-3 rounded-tl-lg">No</th>
                                    <th class="p-3">Judul & Ditujukan Ke</th>
                                    <th class="p-3">Deadline</th>
                                    <th class="p-3">Deskripsi & Lampiran</th>
                                    <th class="p-3">Pembuat</th>
                                    \${currentUser.role === 'admin' ? '<th class="p-3 rounded-tr-lg">Aksi</th>' : '<th class="p-3 rounded-tr-lg"></th>'}
                                </tr>
`;

code = code.replace(oldTableHeaders.trim(), newTableHeaders.trim());

const oldTableBody = `
                                    <tr class="hover:bg-slate-800/30">
                                        <td class="p-3">\${idx + 1}</td>
                                        <td class="p-3 font-bold text-white">\${a.title}</td>
                                        <td class="p-3">\${a.date}</td>
                                        <td class="p-3">\${a.description || '-'}</td>
                                        <td class="p-3"><span class="px-2 py-1 bg-slate-800 rounded text-[10px]">\${a.createdBy || 'Admin'}</span></td>
                                        \${currentUser.role === 'admin' ? \`
                                            <td class="p-3">
                                                <button onclick="deleteAgenda('\${a.id}')" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        \` : ''}
                                    </tr>
`;

const newTableBody = `
                                    <tr class="hover:bg-slate-800/30">
                                        <td class="p-3">\${idx + 1}</td>
                                        <td class="p-3">
                                            <div class="font-bold text-white">\${a.title}</div>
                                            <div class="text-[10px] text-indigo-300 mt-1">Ke: \${a.target === 'ALL' ? 'Semua Penyiar' : getPenyiarName(a.target)}</div>
                                        </td>
                                        <td class="p-3">\${a.date}</td>
                                        <td class="p-3">
                                            <div class="mb-1">\${a.description || '-'}</div>
                                            \${a.link ? \`<a href="\${a.link}" target="_blank" class="text-[10px] text-blue-400 hover:underline"><i class="fa-solid fa-link"></i> Lampiran</a>\` : ''}
                                        </td>
                                        <td class="p-3"><span class="px-2 py-1 bg-slate-800 rounded text-[10px]">\${a.createdBy || 'Admin'}</span></td>
                                        \${currentUser.role === 'admin' ? \`
                                            <td class="p-3">
                                                <button onclick="deleteAgenda('\${a.id}')" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        \` : '<td></td>'}
                                    </tr>
`;

code = code.replace(oldTableBody.trim(), newTableBody.trim());

// If `getPenyiarName` isn't declared earlier, we might need to handle `target === undefined` properly.
// `target` might be undefined for old dummy agendas, so `a.target === 'ALL'` check is safe, but `getPenyiarName` might crash.
// Let's add a safe guard to the replace string.
code = code.replace("getPenyiarName(a.target)", "(a.target ? getPenyiarName(a.target) : 'Global')");

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully updated openCreateAgendaModal and saveNewAgenda");
