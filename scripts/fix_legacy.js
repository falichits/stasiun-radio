const fs = require("fs");
const file = "c:/Users/Lenovo/Downloads/kuliah pens/FILE TUGAS/Rincian Tugas/Gabut/stasiun-radio/src/legacy.js";
let content = fs.readFileSync(file, "utf8");

const regex = /function openAddProgramModal\(\) \{[\s\S]*?function showNotification/m;
const replacement = `function openAddProgramModal() {
            const body = \`
                <form onsubmit="saveNewProgram(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Program Siaran</label>
                        <input type="text" id="progName" required placeholder="Contoh: JCC Morning Show" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Waktu Tayang</label>
                        <input type="text" id="progTime" required placeholder="06:00 - 08:00 WIB" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Kategori Program</label>
                        <input type="text" id="progCat" required placeholder="Talkshow / Music" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">
                        Simpan Program Baru
                    </button>
                </form>
            \`;
            openAppModal("Tambah Program Radio", body);
        }

        function saveNewProgram(e) {
            e.preventDefault();
            radioPrograms.push({
                id: "PROG-" + Date.now(),
                name: document.getElementById("progName").value,
                time: document.getElementById("progTime").value,
                category: document.getElementById("progCat").value
            });
            closeAppModal();
            showNotification("Program radio ditambahkan");
            renderProgramListView();
        }

        function deleteProgram(id) {
            radioPrograms = radioPrograms.filter(p => p.id !== id);
            showNotification("Program dihapus");
            renderProgramListView();
        }

        function triggerPrintModal(htmlBody, penyiarName = null) {
            document.getElementById("kopStationName").innerText = kopSuratConfig.stationName;
            document.getElementById("kopStationAddress").innerText = kopSuratConfig.address;
            document.getElementById("kopCityDate").innerText = \`\${kopSuratConfig.city}, 27 Juli 2026\`;
            document.getElementById("kopTitle").innerText = \`Mengetahui, \${kopSuratConfig.signeeTitle}\`;
            document.getElementById("kopSignee").innerText = kopSuratConfig.signeeName;
            document.getElementById("printableContent").innerHTML = htmlBody;

            // Handle Penyiar Signature
            const penyiarTtdContainer = document.getElementById("kopPenyiarTtdContainer");
            if (penyiarTtdContainer) {
                if (penyiarName) {
                    document.getElementById("kopPenyiarName").innerText = penyiarName;
                    penyiarTtdContainer.classList.remove("hidden");
                } else {
                    penyiarTtdContainer.classList.add("hidden");
                }
            }

            // Render TTD image in signature area
            const ttdArea = document.getElementById("kopTtdArea");
            if (ttdArea) {
                if (kopSuratConfig.ttdImage) {
                    ttdArea.innerHTML = \`<img src="\${kopSuratConfig.ttdImage}" style="height:60px;max-width:150px;object-fit:contain;display:block;margin:auto;" alt="TTD">\`;
                } else {
                    ttdArea.innerHTML = "";
                }
            }

            const modal = document.getElementById("printModal");
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }

        function closePrintModal() {
            const modal = document.getElementById("printModal");
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }

        function openAppModal(title, bodyHtml) {
            document.getElementById("appModalTitle").innerText = title;
            document.getElementById("appModalBody").innerHTML = bodyHtml;
            const modal = document.getElementById("appModal");
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }

        function closeAppModal() {
            const modal = document.getElementById("appModal");
            if (modal) {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            }
            if (typeof window.closePrintModal === "function" && document.getElementById("printModal") && !document.getElementById("printModal").classList.contains("hidden")) {
                closePrintModal();
            }
        }

        function showNotification\`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log("Fixed syntax error!");

