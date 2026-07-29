const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

// 1. Add adminData at the top after other variables
if (!code.includes('let adminData = {')) {
    code = code.replace(
        /let currentUser = null;/,
        `let currentUser = null;\nlet adminData = {\n    name: "Budi Santoso (Admin)",\n    email: "admin@jccfm.com",\n    password: "admin123",\n    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",\n    phone: "08123456789",\n    address: "Jl. Radio No. 101"\n};`
    );
}

// 2. Update handleLogin
code = code.replace(
    /if \(email === 'admin@jccfm\.com' && pass === 'admin123'\) {[\s\S]*?showNotification\('Berhasil masuk sebagai Admin System'\);\s*return;\s*}/,
    `if (email === adminData.email && pass === adminData.password) {
                currentUser = {
                    role: 'admin',
                    data: { ...adminData }
                };
                setupDashboardApp();
                switchView('adminDashboard');
                showNotification('Berhasil masuk sebagai Admin System');
                return;
            }`
);

// 3. Update quickFill
code = code.replace(
    /document\.getElementById\('loginEmail'\)\.value = 'admin@jccfm\.com';\s*document\.getElementById\('loginPassword'\)\.value = 'admin123';/,
    `document.getElementById('loginEmail').value = adminData.email;
                document.getElementById('loginPassword').value = adminData.password;`
);

// 4. Update renderNavigationMenu
if (!code.includes('adminProfile')) {
    code = code.replace(
        /<button onclick="switchView\('adminSettings'\)"/g,
        `<button onclick="switchView('adminProfile')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="adminProfile">
                        <i class="fa-solid fa-user-tie flex-shrink-0 text-purple-400"></i>
                        <span>Profil Admin</span>
                    </button>
                    <button onclick="switchView('adminSettings')"`
    );
}

// 5. Update pageTitles
if (!code.includes('adminProfile:')) {
    code = code.replace(
        /adminSettings: 'Pengaturan Kop Surat & Template'/,
        `adminSettings: 'Pengaturan Kop Surat & Template',\n                adminProfile: 'Profil Biodata Admin'`
    );
}

// 6. Update switchView if-else
if (!code.includes("else if (viewName === 'adminProfile') renderAdminProfile();")) {
    code = code.replace(
        /else if \(viewName === 'cutiView'\) renderCutiView\(\);/,
        `else if (viewName === 'cutiView') renderCutiView();\n            else if (viewName === 'adminProfile') renderAdminProfile();`
    );
}

// 7, 8, 9. Add new functions before window assignments
const newFunctions = `
        function renderAdminProfile() {
            const container = document.getElementById('viewContainer');
            container.innerHTML = \`
                <div class="max-w-4xl mx-auto space-y-6">
                    <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div class="flex items-center gap-5">
                            <img src="\${adminData.photo}" class="w-24 h-24 rounded-full border-4 border-indigo-500/30 object-cover">
                            <div>
                                <h2 class="text-2xl font-bold text-white mb-1">\${adminData.name}</h2>
                                <p class="text-slate-400 font-medium">System Administrator</p>
                            </div>
                        </div>
                        <button onclick="openEditAdminProfileModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
                            <i class="fa-solid fa-pen-to-square mr-2"></i> Edit Profil
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                            <h3 class="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Informasi Akun</h3>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">Email Akses</p>
                                <p class="font-semibold text-white">\${adminData.email}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">Password</p>
                                <p class="font-semibold text-white">\${adminData.password}</p>
                            </div>
                        </div>
                        
                        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                            <h3 class="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Kontak & Alamat</h3>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">No. Handphone</p>
                                <p class="font-semibold text-white">\${adminData.phone || '-'}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">Alamat Lengkap</p>
                                <p class="font-semibold text-white">\${adminData.address || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function openEditAdminProfileModal() {
            const body = \`
                <form onsubmit="saveAdminProfile(event)" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                        <input type="text" id="editAdminName" value="\${adminData.name}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Email Akses</label>
                            <input type="email" id="editAdminEmail" value="\${adminData.email}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Password</label>
                            <input type="text" id="editAdminPass" value="\${adminData.password}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">URL Foto Profil</label>
                        <input type="url" id="editAdminPhoto" value="\${adminData.photo}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">No. Handphone</label>
                            <input type="text" id="editAdminPhone" value="\${adminData.phone || ''}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Alamat</label>
                            <input type="text" id="editAdminAddress" value="\${adminData.address || ''}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            \`;
            openAppModal('Edit Profil Admin', body);
        }

        function saveAdminProfile(e) {
            e.preventDefault();
            adminData.name = document.getElementById('editAdminName').value;
            adminData.email = document.getElementById('editAdminEmail').value;
            adminData.password = document.getElementById('editAdminPass').value;
            adminData.photo = document.getElementById('editAdminPhoto').value;
            adminData.phone = document.getElementById('editAdminPhone').value;
            adminData.address = document.getElementById('editAdminAddress').value;

            // Update currentUser if currently logged in as admin
            if (currentUser && currentUser.role === 'admin') {
                currentUser.data = { ...adminData };
                
                // Update header info
                document.getElementById('sidebarUserName').innerText = currentUser.data.name;
                document.getElementById('sidebarUserPhoto').src = currentUser.data.photo;
                document.getElementById('topUserGreeting').innerText = \`Halo, \${currentUser.data.name.split(' ')[0]}\`;
                document.getElementById('topUserAvatar').src = currentUser.data.photo;
            }

            closeAppModal();
            showNotification('Profil Admin berhasil diperbarui!', 'success');
            if (document.getElementById('pageTitle').innerText === 'Profil Biodata Admin') {
                renderAdminProfile();
            }
        }
`;

if (!code.includes('function renderAdminProfile()')) {
    code = code.replace(
        /\/\/ Auto-attached to window for legacy onclick handlers/,
        newFunctions + '\n  // Auto-attached to window for legacy onclick handlers'
    );
}

// 10. Expose to window
if (!code.includes('window.openEditAdminProfileModal = openEditAdminProfileModal;')) {
    code = code.replace(
        /window\.renderPenyiarProfile = renderPenyiarProfile;/,
        `window.renderPenyiarProfile = renderPenyiarProfile;\n  window.renderAdminProfile = renderAdminProfile;\n  window.openEditAdminProfileModal = openEditAdminProfileModal;\n  window.saveAdminProfile = saveAdminProfile;`
    );
}

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully updated legacy.js for Admin Profile feature.");
