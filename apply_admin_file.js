const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

const oldModalContent = `                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">URL Foto Profil</label>
                        <input type="url" id="editAdminPhoto" value="\${adminData.photo}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                    </div>`;

const newModalContent = `                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Foto Profil</label>
                        <div class="flex items-center gap-4">
                            <img id="adminPhotoPreview" src="\${adminData.photo}" class="w-14 h-14 rounded-full object-cover border border-slate-700 shrink-0">
                            <input type="file" id="editAdminPhotoFile" accept="image/*" onchange="previewAdminPhoto(event)" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-1 text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer">
                        </div>
                        <input type="hidden" id="editAdminPhoto" value="\${adminData.photo}">
                    </div>`;

code = code.replace(oldModalContent, newModalContent);

const previewFunction = `
        function previewAdminPhoto(event) {
            const input = event.target;
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('adminPhotoPreview').src = e.target.result;
                    document.getElementById('editAdminPhoto').value = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
`;

if (!code.includes('function previewAdminPhoto')) {
    code = code.replace(
        /function openEditAdminProfileModal/,
        previewFunction + '\n        function openEditAdminProfileModal'
    );
}

if (!code.includes('window.previewAdminPhoto = previewAdminPhoto;')) {
    code = code.replace(
        /window\.openEditAdminProfileModal = openEditAdminProfileModal;/,
        `window.previewAdminPhoto = previewAdminPhoto;\n  window.openEditAdminProfileModal = openEditAdminProfileModal;`
    );
}

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully updated legacy.js for Admin Profile file upload.");
