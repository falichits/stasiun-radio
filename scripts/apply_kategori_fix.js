const fs = require('fs');
let code = fs.readFileSync('src/legacy.js', 'utf8');

const oldSelect = `
                            <label class="block font-semibold text-slate-300 mb-1">Kategori Tugas</label>
                            <select id="stKategori" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                <option value="Siaran Khusus">Siaran Khusus</option>
                                <option value="Liputan Lapangan">Liputan Lapangan</option>
                                <option value="MC / Host">MC / Host</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
`;

const newSelect = `
                            <label class="block font-semibold text-slate-300 mb-1">Kategori Tugas</label>
                            <input type="text" list="kategoriList" id="stKategori" required placeholder="Pilih atau ketik baru..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500 [color-scheme:dark]">
                            <datalist id="kategoriList">
                                <option value="Siaran Khusus"></option>
                                <option value="Liputan Lapangan"></option>
                                <option value="MC / Host"></option>
                                <option value="Produksi Iklan"></option>
                                <option value="Lainnya"></option>
                            </datalist>
`;

code = code.replace(oldSelect.trim(), newSelect.trim());

fs.writeFileSync('src/legacy.js', code, 'utf8');
console.log("Successfully changed Kategori Tugas to input datalist.");
