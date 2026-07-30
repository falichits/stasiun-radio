const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// 1. Update Surat Tugas Modal to include Link
const oldModal = `
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
                            <input type="text" id="stLokasi" required placeholder="Studio / Luar" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                    </div>
`;
const newModal = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
                            <input type="text" id="stLokasi" required placeholder="Studio / Luar" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Link Surat Tugas (Opsional)</label>
                            <input type="url" id="stLink" placeholder="https://..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500">
                        </div>
                    </div>
`;
code = code.replace(oldModal.trim(), newModal.trim());

// 2. Update save function
const oldSave = `
                pesan: document.getElementById('stPesan').value,
                status: 'Menunggu',
`;
const newSave = `
                pesan: document.getElementById('stPesan').value,
                link: document.getElementById('stLink').value,
                status: 'Menunggu',
`;
code = code.replace(oldSave.trim(), newSave.trim());

// 3. Update Admin view
const oldAdminTd = `
                                            <td class="p-3">
                                                <div class="font-bold text-white">\${st.kategori}</div>
                                                <div class="text-[10px] text-slate-400 mt-1">\${st.pesan}</div>
                                            </td>
`;
const newAdminTd = `
                                            <td class="p-3">
                                                <div class="font-bold text-white">\${st.kategori}</div>
                                                <div class="text-[10px] text-slate-400 mt-1">\${st.pesan}</div>
                                                \${st.link ? \`<a href="\${st.link}" target="_blank" class="text-[10px] text-blue-400 mt-1 block hover:underline"><i class="fa-solid fa-link"></i> Link Dokumen</a>\` : ''}
                                            </td>
`;
code = code.replace(oldAdminTd.trim(), newAdminTd.trim());

// 4. Update Penyiar view
const oldPenyiarView = `
                                        <p class="text-[11px] text-slate-400 bg-slate-900 p-2 rounded mb-3">\${st.pesan}</p>
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
`;
const newPenyiarView = `
                                        <p class="text-[11px] text-slate-400 bg-slate-900 p-2 rounded mb-3">\${st.pesan}</p>
                                        \${st.link ? \`<a href="\${st.link}" target="_blank" class="text-[11px] text-blue-400 mb-3 inline-block hover:underline"><i class="fa-solid fa-link"></i> Link Dokumen</a>\` : ''}
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
`;
code = code.replace(oldPenyiarView.trim(), newPenyiarView.trim());

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully added Link Surat Tugas.");
