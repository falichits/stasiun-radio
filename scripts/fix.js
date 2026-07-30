const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');
const startStr = '        function openAddPenyiarModal() {';
const endStr = '        function addCategory() {';
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);
if(startIdx === -1 || endIdx === -1) {
  console.error('Failed'); process.exit(1);
}
const replacement = `        function openAddPenyiarModal() {
            const body = \`
                <form onsubmit="saveNewPenyiar(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">ID Penyiar</label>
                        <input type="text" id="addPenId" required value="PEN-\${100 + penyiars.length + 1}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                        <input type="text" id="addPenName" required placeholder="Contoh: Rina Wijaya" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Kategori/Tipe Penyiar</label>
                            <select id="addPenCategory" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                \${broadcasterCategories.map(c => \`<option value="\${c}">\${c}</option>\`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                            <select id="addPenGender" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Email Akses Login</label>
                            <input type="email" id="addPenEmail" required placeholder="rina@jccfm.com" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Password Initial</label>
                            <input type="password" id="addPenPass" required value="123" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Foto Profil (Opsional)</label>
                        <input type="file" id="addPenPhoto" accept="image/*" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer">
                        <p class="text-[10px] text-slate-500 mt-1">*Jika tidak memilih foto, foto default akan digunakan.</p>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">No. HP / WA Aktif</label>
                        <input type="text" id="addPenPhone" required placeholder="0812..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Alamat Rumah</label>
                        <input type="text" id="addPenAddress" required placeholder="Jl..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tanggal Bergabung</label>
                        <input type="date" id="addPenJoinDate" required value="2026-07-27" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-4">
                        Simpan Data Penyiar
                    </button>
                </form>
            \`;
            openAppModal('Tambah Penyiar Baru', body);
        }

        function saveNewPenyiar(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('addPenPhoto');
            let photoUrl = 'https://ui-avatars.com/api/?background=random&color=fff&name=' + encodeURIComponent(document.getElementById('addPenName').value);
            
            const createPenyiar = (finalPhotoUrl) => {
                const newObj = {
                    id: document.getElementById('addPenId').value,
                    name: document.getElementById('addPenName').value,
                    category: document.getElementById('addPenCategory').value,
                    email: document.getElementById('addPenEmail').value,
                    password: document.getElementById('addPenPass').value,
                    photo: finalPhotoUrl,
                    address: document.getElementById('addPenAddress').value,
                    phone: document.getElementById('addPenPhone').value,
                    joinDate: document.getElementById('addPenJoinDate').value,
                    gender: document.getElementById('addPenGender').value
                };

                penyiars.unshift(newObj);
                closeAppModal();
                showNotification(\`Penyiar \${newObj.name} berhasil ditambahkan\`);
                renderAdminPenyiarMaster();
            };

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    createPenyiar(evt.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                createPenyiar(photoUrl);
            }
        }

        function deletePenyiar(id) {
            penyiars = penyiars.filter(p => p.id !== id);
            showNotification('Penyiar berhasil dihapus dari data');
            renderAdminPenyiarMaster();
        }

        function openCategoryModal() {
            const body = \`
                <div class="space-y-4 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tambah Jenis/Tipe Penyiar Baru</label>
                        <div class="flex gap-2">
                            <input type="text" id="newCategoryInput" placeholder="Contoh: News Anchor" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                            <button onclick="addCategory()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl">Tambah</button>
                        </div>
                    </div>
                    <div class="space-y-2 border-t border-slate-800 pt-3">
                        <label class="block font-semibold text-slate-400">Daftar Kategori Terdaftar:</label>
                        \${broadcasterCategories.map((c, i) => \`
                            <div class="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                                <span class="text-white font-medium">\${c}</span>
                                <button onclick="removeCategory(\${i})" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
            openAppModal('Kelola Master Jenis/Tipe Penyiar', body);
        }

`;
code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('src/legacy.js', code);
console.log('Done!');
