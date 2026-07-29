const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// 1. Add suratTugas array
if (!code.includes('let suratTugas = []')) {
    code = code.replace('let agendas = [];', 'let agendas = [];\n        let suratTugas = [];');
}

// 2. We need to replace the ENTIRE renderAgendaView and its associated functions.
// Let's find the start of renderAgendaView and the end of deleteAgenda.
const startIdx = code.indexOf('function renderAgendaView() {');
const endMarker = 'function renderRangkumanAbsensiView() {';
let endIdx = code.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const oldCodeBlock = code.substring(startIdx, endIdx);
    
    const newCodeBlock = `
        function renderAgendaView() {
            const container = document.getElementById('viewContainer');
            
            let agendaHtml = '';
            // Table Agenda (Global)
            agendaHtml += \`
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white"><i class="fa-solid fa-folder-open text-indigo-400 mr-2"></i> Daftar Agenda Radio</h3>
                            <p class="text-xs text-slate-400 mt-1">Informasi dan arahan agenda umum stasiun radio.</p>
                        </div>
                        <button onclick="openCreateAgendaModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                            <i class="fa-solid fa-plus"></i> Buat Agenda
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300">
                            <thead class="bg-slate-950/50 text-slate-400 uppercase font-semibold">
                                <tr>
                                    <th class="p-3 rounded-tl-lg">No</th>
                                    <th class="p-3">Judul Agenda</th>
                                    <th class="p-3">Tanggal</th>
                                    <th class="p-3">Deskripsi</th>
                                    <th class="p-3 rounded-tr-lg">Pembuat</th>
                                    \${currentUser.role === 'admin' ? '<th class="p-3">Aksi</th>' : ''}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60">
                                \${agendas.length === 0 ? '<tr><td colspan="6" class="p-4 text-center text-slate-500">Belum ada agenda.</td></tr>' : ''}
                                \${agendas.map((a, idx) => \`
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
                                \`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            \`;

            // Surat Tugas Section
            let suratTugasHtml = '';
            
            if (currentUser.role === 'admin') {
                suratTugasHtml = \`
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white"><i class="fa-solid fa-file-pen text-rose-400 mr-2"></i> Monitoring Surat Tugas</h3>
                                <p class="text-xs text-slate-400 mt-1">Kelola penugasan resmi untuk penyiar.</p>
                            </div>
                            <button onclick="openCreateSuratTugasModal()" class="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                                <i class="fa-solid fa-file-signature"></i> Buat Surat Tugas
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-300">
                                <thead class="bg-slate-950/50 text-slate-400 uppercase font-semibold">
                                    <tr>
                                        <th class="p-3 rounded-tl-lg">Judul Tugas</th>
                                        <th class="p-3">Ditujukan Ke</th>
                                        <th class="p-3">Jadwal & Lokasi</th>
                                        <th class="p-3">Status</th>
                                        <th class="p-3 rounded-tr-lg text-center">Aksi / Verifikasi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800/60">
                                    \${suratTugas.length === 0 ? '<tr><td colspan="5" class="p-4 text-center text-slate-500">Belum ada surat tugas.</td></tr>' : ''}
                                    \${suratTugas.map(st => \`
                                        <tr class="hover:bg-slate-800/30">
                                            <td class="p-3">
                                                <div class="font-bold text-white">\${st.kategori}</div>
                                                <div class="text-[10px] text-slate-400 mt-1">\${st.pesan}</div>
                                            </td>
                                            <td class="p-3 font-medium">\${st.target === 'ALL' ? 'Semua Penyiar' : getPenyiarName(st.target)}</td>
                                            <td class="p-3">
                                                <div><i class="fa-regular fa-calendar mr-1 text-slate-500"></i>\${st.waktu.replace('T', ' ')}</div>
                                                <div class="mt-1"><i class="fa-solid fa-location-dot mr-1 text-slate-500"></i>\${st.lokasi}</div>
                                            </td>
                                            <td class="p-3">\${getBadgeHtml(st.status)}</td>
                                            <td class="p-3 text-center space-y-2">
                                                <button onclick="previewPDFSuratTugas('\${st.id}')" class="w-full text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded text-[10px] font-bold">
                                                    <i class="fa-solid fa-file-pdf text-rose-400 mr-1"></i> Preview PDF
                                                </button>
                                                \${st.status === 'Laporan Terkirim' ? \`
                                                    <button onclick="accSuratTugas('\${st.id}')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 rounded text-[10px] font-bold">
                                                        <i class="fa-solid fa-check mr-1"></i> ACC Selesai
                                                    </button>
                                                \` : ''}
                                                \${st.status === 'Banding' ? \`
                                                    <div class="bg-rose-950/30 p-2 rounded border border-rose-900/50 mt-1">
                                                        <p class="text-[9px] text-rose-300 mb-1 font-medium">Alasan: "\${st.alasanBanding}"</p>
                                                        <div class="flex gap-1">
                                                            <button onclick="terimaBanding('\${st.id}')" class="flex-1 bg-rose-600 text-white text-[9px] py-1 rounded hover:bg-rose-500">Lepas</button>
                                                            <button onclick="tolakBanding('\${st.id}')" class="flex-1 bg-slate-700 text-white text-[9px] py-1 rounded hover:bg-slate-600">Tolak</button>
                                                        </div>
                                                    </div>
                                                \` : ''}
                                            </td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                \`;
            } else {
                const myTugas = suratTugas.filter(st => st.target === 'ALL' || st.target === currentUser.data.id);
                suratTugasHtml = \`
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-xl font-bold text-white mb-1"><i class="fa-solid fa-tasks text-rose-400 mr-2"></i> Surat Tugas Anda</h3>
                        <p class="text-xs text-slate-400 mb-4">Daftar penugasan resmi dari Admin.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            \${myTugas.length === 0 ? '<div class="col-span-2 text-center text-slate-500 text-xs py-4">Belum ada surat tugas untuk Anda.</div>' : ''}
                            \${myTugas.map(st => \`
                                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="font-bold text-white text-sm">\${st.kategori}</h4>
                                            \${getBadgeHtml(st.status)}
                                        </div>
                                        <p class="text-[11px] text-slate-400 bg-slate-900 p-2 rounded mb-3">\${st.pesan}</p>
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
                                            <div><i class="fa-regular fa-clock mr-1"></i> \${st.waktu.replace('T', ' ')}</div>
                                            <div><i class="fa-solid fa-location-dot mr-1"></i> \${st.lokasi}</div>
                                        </div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-800">
                                        \${st.status === 'Menunggu' ? \`
                                            <div class="flex gap-2">
                                                <button onclick="terimaSuratTugas('\${st.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-check mr-1"></i> Terima</button>
                                                <button onclick="openBandingModal('\${st.id}')" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Banding</button>
                                            </div>
                                        \` : st.status === 'Diterima' ? \`
                                            <button onclick="openLaporanTugasModal('\${st.id}')" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-xs font-bold">Kirim Laporan Hasil</button>
                                        \` : st.status === 'Banding' ? \`
                                            <div class="text-[10px] text-amber-400 text-center bg-amber-900/20 py-1.5 rounded">Menunggu tanggapan admin atas banding Anda.</div>
                                        \` : st.status === 'Laporan Terkirim' ? \`
                                            <div class="text-[10px] text-indigo-400 text-center bg-indigo-900/20 py-1.5 rounded">Laporan terkirim. Menunggu ACC admin.</div>
                                        \` : \`
                                            <div class="text-[10px] text-emerald-400 text-center bg-emerald-900/20 py-1.5 rounded">Tugas telah diselesaikan (ACC).</div>
                                        \`}
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }

            container.innerHTML = agendaHtml + suratTugasHtml;
        }
        
        function getPenyiarName(id) {
            const p = penyiars.find(x => x.id === id);
            return p ? p.name : id;
        }
        
        function getBadgeHtml(status) {
            if (status === 'Menunggu') return '<span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[9px] font-bold">Menunggu</span>';
            if (status === 'Diterima') return '<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">Dikerjakan</span>';
            if (status === 'Banding') return '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">Banding</span>';
            if (status === 'Laporan Terkirim') return '<span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">Laporan Masuk</span>';
            if (status === 'Selesai (ACC)') return '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Selesai (ACC)</span>';
            if (status === 'Dilepas (Batal)') return '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">Dilepas (Batal)</span>';
            return \`<span class="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[9px] font-bold">\${status}</span>\`;
        }

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

        function deleteAgenda(id) {
            agendas = agendas.filter(a => a.id !== id);
            showNotification('Agenda dihapus');
            renderAgendaView();
        }

        function openCreateSuratTugasModal() {
            let penyiarOptions = '<option value="ALL">Semua Penyiar (Global)</option>';
            penyiars.forEach(p => {
                penyiarOptions += \`<option value="\${p.id}">\${p.name}</option>\`;
            });
            
            const body = \`
                <form onsubmit="saveNewSuratTugas(event)" class="space-y-4 text-sm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Kategori Tugas</label>
                            <select id="stKategori" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                <option value="Siaran Khusus">Siaran Khusus</option>
                                <option value="Liputan Lapangan">Liputan Lapangan</option>
                                <option value="MC / Host">MC / Host</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Ditugaskan Kepada</label>
                            <select id="stTarget" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                \${penyiarOptions}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Waktu</label>
                            <input type="datetime-local" id="stWaktu" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
                            <input type="text" id="stLokasi" required placeholder="Studio / Luar" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Instruksi Tugas</label>
                        <textarea id="stPesan" rows="3" required placeholder="Detail tugas..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl mt-2">Terbitkan Surat Tugas</button>
                </form>
            \`;
            openAppModal('Buat Surat Tugas Baru', body);
        }

        function saveNewSuratTugas(e) {
            e.preventDefault();
            suratTugas.unshift({
                id: 'st-' + Date.now(),
                noSurat: 'ST/JCC/2026/' + Math.floor(Math.random() * 900 + 100),
                kategori: document.getElementById('stKategori').value,
                target: document.getElementById('stTarget').value,
                waktu: document.getElementById('stWaktu').value,
                lokasi: document.getElementById('stLokasi').value,
                pesan: document.getElementById('stPesan').value,
                status: 'Menunggu',
                alasanBanding: '',
                laporanHasil: ''
            });
            closeAppModal();
            showNotification('Surat Tugas diterbitkan!');
            renderAgendaView();
        }

        // Penyiar Actions
        function terimaSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Diterima';
                showNotification('Tugas diterima.');
                renderAgendaView();
            }
        }
        
        function openBandingModal(id) {
            const body = \`
                <form onsubmit="saveBanding(event, '\${id}')" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-rose-400 mb-1">Alasan Banding / Keberatan</label>
                        <textarea id="bandingReason" rows="3" required placeholder="Sebutkan alasan (misal jadwal bentrok)..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl mt-2">Kirim Banding</button>
                </form>
            \`;
            openAppModal('Ajukan Banding Tugas', body);
        }

        function saveBanding(e, id) {
            e.preventDefault();
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Banding';
                st.alasanBanding = document.getElementById('bandingReason').value;
                closeAppModal();
                showNotification('Banding berhasil diajukan.');
                renderAgendaView();
            }
        }

        function openLaporanTugasModal(id) {
            const body = \`
                <form onsubmit="saveLaporanTugas(event, '\${id}')" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-indigo-400 mb-1">Laporan Hasil Pengerjaan</label>
                        <textarea id="laporanText" rows="3" required placeholder="Tuliskan keterangan hasil penugasan..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">Kirim Laporan</button>
                </form>
            \`;
            openAppModal('Kirim Laporan Tugas', body);
        }

        function saveLaporanTugas(e, id) {
            e.preventDefault();
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Laporan Terkirim';
                st.laporanHasil = document.getElementById('laporanText').value;
                closeAppModal();
                showNotification('Laporan dikirim ke Admin.');
                renderAgendaView();
            }
        }

        // Admin Actions
        function accSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Selesai (ACC)';
                showNotification('Tugas di-ACC.');
                renderAgendaView();
            }
        }
        
        function terimaBanding(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Dilepas (Batal)';
                showNotification('Tugas dilepas.');
                renderAgendaView();
            }
        }
        
        function tolakBanding(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Menunggu'; // back to normal
                st.alasanBanding = '';
                showNotification('Banding ditolak. Status kembali Menunggu.');
                renderAgendaView();
            }
        }

        function previewPDFSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(!st) return;

            const penerima = st.target === 'ALL' ? 'Semua Penyiar' : getPenyiarName(st.target);

            const pdfHtml = \`
                <div id="pdf-export-content" class="bg-white text-black p-8 font-serif leading-relaxed mx-auto" style="width: 210mm; min-height: 297mm; max-width: 100%;">
                    <div class="text-center border-b-4 border-double border-black pb-4 mb-6">
                        <h2 class="text-2xl font-bold uppercase tracking-wider text-black">RADIO JCC FM 101.5 MHz</h2>
                        <p class="text-sm italic text-black">Jl. Media Utama No. 101, Kota JCC | Telp: (021) 123456</p>
                        <p class="text-sm text-black">Website: www.jccradio.com | Email: redaksi@jccradio.com</p>
                    </div>

                    <div class="text-center mb-6">
                        <h3 class="text-lg font-bold underline uppercase text-black">SURAT TUGAS RESMI</h3>
                        <p class="text-sm text-black">Nomor: \${st.noSurat}</p>
                    </div>

                    <p class="text-sm mb-4 text-black">Pimpinan Radio JCC FM memberikan tugas resmi kepada personel berikut:</p>

                    <table class="w-full text-sm mb-6 border-collapse text-black">
                        <tr>
                            <td class="w-48 font-bold py-1">Penyiar / Pelaksana</td>
                            <td class="py-1">: <strong>\${penerima}</strong></td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Jenis Tugas</td>
                            <td class="py-1">: \${st.kategori}</td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Waktu Pelaksanaan</td>
                            <td class="py-1">: \${st.waktu.replace('T', ' ')}</td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Lokasi Tugas</td>
                            <td class="py-1">: \${st.lokasi}</td>
                        </tr>
                    </table>

                    <div class="mb-8">
                        <p class="text-sm font-bold mb-1 text-black">Rincian Instruksi / Catatan Tugas:</p>
                        <div class="text-sm border border-gray-400 p-4 bg-gray-50 min-h-[100px] whitespace-pre-wrap text-black">\${st.pesan}</div>
                    </div>

                    <p class="text-sm mb-8 text-black">Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh rasa tanggung jawab.</p>

                    <div class="flex justify-between text-sm pt-4 text-black">
                        <div class="text-center w-1/3">
                            <p class="mb-16">Penerima Tugas,</p>
                            <p class="font-bold underline">( Staff Penyiar )</p>
                        </div>
                        <div class="text-center w-1/3">
                            <p class="mb-16">Kota JCC, \${new Date().toLocaleDateString('id-ID')}<br>Station Manager,</p>
                            <p class="font-bold underline">H. Management Radio</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex justify-end gap-2 no-print" id="pdfActionBtns">
                    <button type="button" onclick="closeAppModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">Batal</button>
                    <button type="button" onclick="downloadHtmlToPdf()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-2">
                        <i class="fa-solid fa-download"></i> Unduh PDF
                    </button>
                </div>
            \`;

            // Open it in a larger modal
            const modalBody = document.getElementById('appModalBody');
            const modalTitle = document.getElementById('appModalTitle');
            const modalInner = document.getElementById('appModal').querySelector('div');
            
            modalTitle.innerHTML = '<i class="fa-solid fa-file-pdf text-rose-400"></i> Preview Surat Tugas';
            modalBody.innerHTML = pdfHtml;
            
            // Make modal wider for A4 preview
            modalInner.classList.remove('max-w-lg');
            modalInner.classList.add('max-w-4xl');
            modalInner.classList.add('h-[90vh]'); // Make it tall
            modalInner.classList.add('flex');
            modalInner.classList.add('flex-col');
            modalBody.classList.add('flex-1');
            modalBody.classList.add('overflow-y-auto'); // Scrollable
            
            document.getElementById('appModal').classList.remove('hidden');
            document.getElementById('appModal').classList.add('flex');
            
            // Restore modal width on close hook
            const oldClose = window.closeAppModal;
            window.closeAppModal = function() {
                modalInner.classList.remove('max-w-4xl', 'h-[90vh]', 'flex-col', 'flex');
                modalInner.classList.add('max-w-lg');
                modalBody.classList.remove('flex-1', 'overflow-y-auto');
                
                oldClose();
                window.closeAppModal = oldClose; // restore
            };
        }

        function downloadHtmlToPdf() {
            if(typeof html2pdf === 'undefined') {
                alert('Library PDF belum dimuat sepenuhnya, mohon tunggu sebentar.');
                return;
            }
            
            const element = document.getElementById('pdf-export-content');
            const btns = document.getElementById('pdfActionBtns');
            btns.style.display = 'none'; // hide buttons during render

            // configure html2pdf
            const opt = {
                margin:       10,
                filename:     'Surat_Tugas.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                btns.style.display = 'flex';
                closeAppModal();
                showNotification('File PDF Surat Tugas diunduh!');
            });
        }
        
    `;
    
    code = code.substring(0, startIdx) + newCodeBlock + "\n\n        " + code.substring(endIdx);
    
    // 3. Update window exports
    // We need to add all these new functions to window
    const windowExports = `
window.renderAgendaView = renderAgendaView;
window.openCreateAgendaModal = openCreateAgendaModal;
window.saveNewAgenda = saveNewAgenda;
window.deleteAgenda = deleteAgenda;
window.openCreateSuratTugasModal = openCreateSuratTugasModal;
window.saveNewSuratTugas = saveNewSuratTugas;
window.terimaSuratTugas = terimaSuratTugas;
window.openBandingModal = openBandingModal;
window.saveBanding = saveBanding;
window.openLaporanTugasModal = openLaporanTugasModal;
window.saveLaporanTugas = saveLaporanTugas;
window.accSuratTugas = accSuratTugas;
window.terimaBanding = terimaBanding;
window.tolakBanding = tolakBanding;
window.previewPDFSuratTugas = previewPDFSuratTugas;
window.downloadHtmlToPdf = downloadHtmlToPdf;
    `;
    
    // Replace the old window exports block
    code = code.replace(/window\.renderAgendaView = renderAgendaView;[\s\S]*?window\.deleteAgenda = deleteAgenda;/g, windowExports);
    
    fs.writeFileSync('src/legacy.js', code, 'utf8');
    console.log("Successfully refactored agenda and surat tugas.");
} else {
    console.log("Could not find boundaries.");
}
