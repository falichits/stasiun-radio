const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// 1. Update Agenda Modal
const oldAgendaModal = `
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tenggat Waktu (Deadline)</label>
                        <input type="date" id="agDate" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                    </div>
`;
const newAgendaModal = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tanggal Surat</label>
                            <input type="date" id="agDateMasuk" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tenggat Waktu (Deadline)</label>
                            <input type="date" id="agDate" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                    </div>
`;
code = code.replace(oldAgendaModal.trim(), newAgendaModal.trim());

// 1.5 Update Save Agenda
const oldSaveAgenda = `
                link: document.getElementById('agLink').value,
                date: document.getElementById('agDate').value,
`;
const newSaveAgenda = `
                link: document.getElementById('agLink').value,
                date: document.getElementById('agDate').value,
                dateMasuk: document.getElementById('agDateMasuk').value,
`;
code = code.replace(oldSaveAgenda.trim(), newSaveAgenda.trim());


// 2. Update Surat Tugas Modal
const oldSuratTugasModal = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Waktu</label>
                            <input type="datetime-local" id="stWaktu" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
`;
const newSuratTugasModal = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tanggal Surat</label>
                            <input type="date" id="stDateMasuk" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Waktu Pelaksanaan</label>
                            <input type="datetime-local" id="stWaktu" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
`;
code = code.replace(oldSuratTugasModal.trim(), newSuratTugasModal.trim());

// 2.5 Update Save Surat Tugas
const oldSaveSuratTugas = `
                target: document.getElementById('stTarget').value,
                waktu: document.getElementById('stWaktu').value,
`;
const newSaveSuratTugas = `
                target: document.getElementById('stTarget').value,
                dateMasuk: document.getElementById('stDateMasuk').value,
                waktu: document.getElementById('stWaktu').value,
`;
code = code.replace(oldSaveSuratTugas.trim(), newSaveSuratTugas.trim());


// 3. Update Agenda Table view
const oldAgendaTh = `<th class="p-3">Deadline</th>`;
const newAgendaTh = `<th class="p-3">Tgl Surat & Deadline</th>`;
code = code.replace(oldAgendaTh, newAgendaTh);

const oldAgendaTd = `<td class="p-3">\${a.date}</td>`;
const newAgendaTd = `
                                        <td class="p-3">
                                            <div class="text-[10px] text-slate-400">Tgl: \${a.dateMasuk || '-'}</div>
                                            <div class="font-bold">DL: \${a.date}</div>
                                        </td>
`;
code = code.replace(oldAgendaTd, newAgendaTd.trim());


// 4. Update Surat Tugas Table view (Admin)
const oldStTh = `<th class="p-3">Jadwal & Lokasi</th>`;
const newStTh = `<th class="p-3">Tanggal, Jadwal & Lokasi</th>`;
code = code.replace(oldStTh, newStTh);

const oldStTd = `
                                            <td class="p-3">
                                                <div><i class="fa-regular fa-calendar mr-1 text-slate-500"></i>\${st.waktu.replace('T', ' ')}</div>
                                                <div class="mt-1"><i class="fa-solid fa-location-dot mr-1 text-slate-500"></i>\${st.lokasi}</div>
                                            </td>
`;
const newStTd = `
                                            <td class="p-3">
                                                <div class="text-[10px] text-slate-400 mb-1">Surat Dibuat: \${st.dateMasuk || '-'}</div>
                                                <div><i class="fa-regular fa-calendar mr-1 text-slate-500"></i>\${st.waktu.replace('T', ' ')}</div>
                                                <div class="mt-1"><i class="fa-solid fa-location-dot mr-1 text-slate-500"></i>\${st.lokasi}</div>
                                            </td>
`;
code = code.replace(oldStTd.trim(), newStTd.trim());


// 5. Update Surat Tugas Table view (Penyiar)
const oldStTdUser = `
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
                                            <div><i class="fa-regular fa-clock mr-1"></i> \${st.waktu.replace('T', ' ')}</div>
                                            <div><i class="fa-solid fa-location-dot mr-1"></i> \${st.lokasi}</div>
                                        </div>
`;
const newStTdUser = `
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
                                            <div class="text-indigo-400 font-medium mb-2"><i class="fa-solid fa-file-signature mr-1"></i> Dibuat: \${st.dateMasuk || '-'}</div>
                                            <div><i class="fa-regular fa-clock mr-1"></i> \${st.waktu.replace('T', ' ')}</div>
                                            <div><i class="fa-solid fa-location-dot mr-1"></i> \${st.lokasi}</div>
                                        </div>
`;
code = code.replace(oldStTdUser.trim(), newStTdUser.trim());

// We also need to add a default value to the input fields so the user doesn't have to manually pick today's date every time.
// Let's add an id to the inputs and set their value to today's date using Javascript right after opening the modal.
// In openCreateAgendaModal:
code = code.replace("openAppModal('Buat Agenda Baru', body);", "openAppModal('Buat Agenda Baru', body);\n            document.getElementById('agDateMasuk').value = new Date().toISOString().split('T')[0];");
// In openCreateSuratTugasModal:
code = code.replace("openAppModal('Buat Surat Tugas Baru', body);", "openAppModal('Buat Surat Tugas Baru', body);\n            document.getElementById('stDateMasuk').value = new Date().toISOString().split('T')[0];");

// 6. Update Surat Tugas PDF
const oldPdfTr = `
                        <tr>
                            <td class="w-48 font-bold py-1">Penyiar / Pelaksana</td>
                            <td class="py-1">: <strong>\${penerima}</strong></td>
                        </tr>
`;
const newPdfTr = `
                        <tr>
                            <td class="w-48 font-bold py-1">Tanggal Surat</td>
                            <td class="py-1">: \${st.dateMasuk || new Date().toISOString().split('T')[0]}</td>
                        </tr>
                        <tr>
                            <td class="w-48 font-bold py-1">Penyiar / Pelaksana</td>
                            <td class="py-1">: <strong>\${penerima}</strong></td>
                        </tr>
`;
code = code.replace(oldPdfTr.trim(), newPdfTr.trim());


fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully added Tanggal Surat to both forms.");
