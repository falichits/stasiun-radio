const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// 1. Add Navigation Button
const adminNavEndIndex = code.indexOf(`                    <button onclick="switchView('adminSettings')"`);
if (adminNavEndIndex > -1) {
    const navBtnHtml = `                    <button onclick="switchView('tickerSettings')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="tickerSettings">
                        <i class="fa-solid fa-bullhorn flex-shrink-0 text-purple-400"></i>
                        <span>Kelola Ticker News</span>
                    </button>\n`;
    code = code.slice(0, adminNavEndIndex) + navBtnHtml + code.slice(adminNavEndIndex);
}

// 2. Add to pageTitles
code = code.replace(`adminProfile: 'Profil Biodata Admin'`, `adminProfile: 'Profil Biodata Admin',\n                tickerSettings: 'Kelola Ticker News'`);

// 3. Add to switchView branching
code = code.replace(`else if (viewName === 'adminSettings') renderAdminSettingsView();`, `else if (viewName === 'adminSettings') renderAdminSettingsView();\n            else if (viewName === 'tickerSettings') renderTickerSettings();`);

// 4. Create the view function and logical functions
const tickerFunctions = `
        function renderTickerSettings() {
            const container = document.getElementById('viewContainer');
            container.innerHTML = \`
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold text-white">Kelola Ticker News</h3>
                            <p class="text-xs text-slate-400">Atur teks berjalan di bagian atas halaman (pengumuman).</p>
                        </div>
                        <button onclick="document.getElementById('addTickerModal').classList.remove('hidden')" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-colors">
                            <i class="fa-solid fa-plus"></i> Tambah Pengumuman
                        </button>
                    </div>

                    <div class="space-y-3" id="tickerListContainer">
                        \${tickerNewsList.map((ticker, index) => \`
                            <div class="glass-card p-4 rounded-xl border border-slate-800 flex justify-between items-center gap-4">
                                <div class="flex-1 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">\${index + 1}</div>
                                    <p class="text-slate-300 text-sm font-medium">\${ticker}</p>
                                </div>
                                <button onclick="deleteTickerNews(\${index})" class="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        \`).join('')}
                    </div>
                </div>

                <!-- Modal Add Ticker -->
                <div id="addTickerModal" class="hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl overflow-hidden transform transition-all">
                        <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h3 class="font-bold text-white flex items-center gap-2">
                                <i class="fa-solid fa-bullhorn text-indigo-400"></i> Tambah Pengumuman
                            </h3>
                            <button onclick="document.getElementById('addTickerModal').classList.add('hidden')" class="text-slate-400 hover:text-white transition-colors">
                                <i class="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1">Teks Pengumuman Baru</label>
                                <textarea id="newTickerContent" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm" placeholder="Contoh: Jangan lupa jadwal siaran minggu ini..."></textarea>
                            </div>
                            <div class="flex gap-3 justify-end pt-2">
                                <button onclick="document.getElementById('addTickerModal').classList.add('hidden')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors">Batal</button>
                                <button onclick="addTickerNews()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/30 transition-colors">Simpan Pengumuman</button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function addTickerNews() {
            const val = document.getElementById('newTickerContent').value.trim();
            if(!val) return alert('Teks tidak boleh kosong!');
            tickerNewsList.push(val);
            document.getElementById('tickerContent').innerText = tickerNewsList.join(" • ");
            renderTickerSettings();
        }

        function deleteTickerNews(index) {
            if(confirm('Yakin ingin menghapus pengumuman ini?')) {
                tickerNewsList.splice(index, 1);
                document.getElementById('tickerContent').innerText = tickerNewsList.join(" • ");
                renderTickerSettings();
            }
        }
`;

code = code.replace('        function renderAdminSettingsView() {', tickerFunctions + '\n        function renderAdminSettingsView() {');

// 5. Expose globally
code = code.replace('window.switchView = switchView;', 'window.switchView = switchView;\nwindow.addTickerNews = addTickerNews;\nwindow.deleteTickerNews = deleteTickerNews;');

fs.writeFileSync('src/legacy.js', code);
