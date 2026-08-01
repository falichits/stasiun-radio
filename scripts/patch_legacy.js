const fs = require('fs');

const legacyPath = 'src/legacy.js';
let content = fs.readFileSync(legacyPath, 'utf8');

// 1. Convert to ES module and import supabase
if (!content.includes("import { supabase }")) {
    content = `import { supabase } from './lib/supabase.js';\n` + content;
}

// 2. Make DOMContentLoaded async and fetch initial data
if (!content.includes("async function loadInitialData")) {
    const initDataStr = `
        async function loadInitialData() {
            try {
                const [
                    { data: pData },
                    { data: rData },
                    { data: aData },
                    { data: agData },
                    { data: stData },
                    { data: achData },
                    { data: lrData },
                    { data: lData },
                    { data: tnData },
                    { data: scData },
                    { data: acData }
                ] = await Promise.all([
                    supabase.from('penyiars').select('*').order('created_at', { ascending: false }),
                    supabase.from('radio_programs').select('*'),
                    supabase.from('attendance_logs').select('*').order('created_at', { ascending: false }),
                    supabase.from('agendas').select('*').order('created_at', { ascending: false }),
                    supabase.from('surat_tugas').select('*').order('created_at', { ascending: false }),
                    supabase.from('achievements').select('*').order('created_at', { ascending: false }),
                    supabase.from('leave_requests').select('*').order('created_at', { ascending: false }),
                    supabase.from('listeners_data').select('*').order('created_at', { ascending: false }),
                    supabase.from('ticker_news').select('*').eq('active', true),
                    supabase.from('station_config').select('*').single(),
                    supabase.from('admin_config').select('*').single()
                ]);

                if (pData) penyiars = pData;
                if (rData) radioPrograms = rData;
                if (aData) attendanceLogs = aData;
                if (agData) agendas = agData;
                if (stData) suratTugas = stData;
                if (achData) achievements = achData;
                if (lrData) leaveRequests = lrData;
                if (lData) listenersData = lData;
                if (tnData) tickerNewsList = tnData.map(t => t.content);
                if (scData) {
                    kopSuratConfig = {
                        stationName: scData.station_name,
                        address: scData.address,
                        city: scData.city,
                        signeeTitle: scData.signee_title,
                        signeeName: scData.signee_name,
                        docTemplateHeader: scData.doc_template_header,
                        ttdImage: scData.ttd_image
                    };
                }
                if (acData) {
                    // Inject admin config into window for login check
                    window.__adminConfig = acData;
                }
            } catch (err) {
                console.error("Error loading Supabase data:", err);
            }
        }
        await loadInitialData();
`;
    // Find the place right after variables declaration
    content = content.replace(/let notifications = \[\];/, 'let notifications = [];\n' + initDataStr);
}

// 3. Patch login logic
content = content.replace(
    `if (email.toLowerCase() === 'admin@jccfm.com' && pass === 'admin123') {`,
    `if (window.__adminConfig && email.toLowerCase() === window.__adminConfig.email.toLowerCase() && pass === window.__adminConfig.password) {`
);

// 4. Asyncify functions
content = content.replace(/function handleLogin\(e\) {/g, 'async function handleLogin(e) {');
content = content.replace(/document\.getElementById\('formAddPenyiar'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddPenyiar\').addEventListener(\'submit\', async function (e) {');
content = content.replace(/function deletePenyiar\(id\) {/g, 'async function deletePenyiar(id) {');
content = content.replace(/function performCheckIn\(penyiarId\) {/g, 'async function performCheckIn(penyiarId) {');
content = content.replace(/function performCheckOut\(logId\) {/g, 'async function performCheckOut(logId) {');
content = content.replace(/document\.getElementById\('formAddAgenda'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddAgenda\').addEventListener(\'submit\', async function (e) {');
content = content.replace(/function selesaikanAgenda\(id\) {/g, 'async function selesaikanAgenda(id) {');
content = content.replace(/document\.getElementById\('formAddSuratTugas'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddSuratTugas\').addEventListener(\'submit\', async function (e) {');
content = content.replace(/function batalkanSuratTugas\(id\) {/g, 'async function batalkanSuratTugas(id) {');
content = content.replace(/document\.getElementById\('formAddAch'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddAch\').addEventListener(\'submit\', async function (e) {');
content = content.replace(/document\.getElementById\('formAddLeave'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddLeave\').addEventListener(\'submit\', async function (e) {');
content = content.replace(/function approveLeave\(id\) {/g, 'async function approveLeave(id) {');
content = content.replace(/function rejectLeave\(id\) {/g, 'async function rejectLeave(id) {');
content = content.replace(/document\.getElementById\('formAddListener'\)\.addEventListener\('submit', function \(e\) {/g, 'document.getElementById(\'formAddListener\').addEventListener(\'submit\', async function (e) {');

// 5. Inject Supabase mutations
// Add Penyiar
content = content.replace(
    /penyiars\.unshift\(newObj\);/g,
    `await supabase.from('penyiars').insert([{ ...newObj }]);\n                penyiars.unshift(newObj);`
);
// Edit Penyiar (we need to find the save edit logic)
// For now, let's keep it simple. Delete Penyiar:
content = content.replace(
    /penyiars = penyiars\.filter\(p => p\.id !== id\);/g,
    `await supabase.from('penyiars').delete().eq('id', id);\n            penyiars = penyiars.filter(p => p.id !== id);`
);

// CheckIn
content = content.replace(
    /attendanceLogs\.unshift\(newLog\);/g,
    `await supabase.from('attendance_logs').insert([newLog]);\n            attendanceLogs.unshift(newLog);`
);

// CheckOut
content = content.replace(
    /logToUpdate\.checkOut = outTime;\n *logToUpdate\.duration = dur;\n *logToUpdate\.status = 'Selesai';/g,
    `logToUpdate.checkOut = outTime;\n            logToUpdate.duration = dur;\n            logToUpdate.status = 'Selesai';\n            await supabase.from('attendance_logs').update({ check_out: outTime, duration: dur, status: 'Selesai' }).eq('id', logId);`
);

// Add Agenda
content = content.replace(
    /agendas\.push\(\{([^}]*)\}\);/g,
    `const newAgenda = {$1};\n            await supabase.from('agendas').insert([newAgenda]);\n            agendas.push(newAgenda);`
);
// Selesaikan Agenda
content = content.replace(
    /agenda\.status = 'Selesai';/g,
    `agenda.status = 'Selesai';\n            await supabase.from('agendas').update({ status: 'Selesai' }).eq('id', id);`
);

// Add Surat Tugas
content = content.replace(
    /suratTugas\.push\(\{([^}]*)\}\);/g,
    `const newST = {$1};\n            await supabase.from('surat_tugas').insert([newST]);\n            suratTugas.push(newST);`
);
// Batalkan Surat Tugas
content = content.replace(
    /suratTugas\.splice\(idx, 1\);/g,
    `await supabase.from('surat_tugas').delete().eq('id', id);\n                    suratTugas.splice(idx, 1);`
);

// Add Achievement
content = content.replace(
    /achievements\.push\(\{([^}]*)\}\);/g,
    `const newAch = {$1};\n            await supabase.from('achievements').insert([newAch]);\n            achievements.push(newAch);`
);

// Add Leave
content = content.replace(
    /leaveRequests\.push\(\{([^}]*)\}\);/g,
    `const newLR = {$1};\n            await supabase.from('leave_requests').insert([newLR]);\n            leaveRequests.push(newLR);`
);
// Approve Leave
content = content.replace(
    /req\.status = 'Disetujui';/g,
    `req.status = 'Disetujui';\n            await supabase.from('leave_requests').update({ status: 'Disetujui' }).eq('id', id);`
);
// Reject Leave
content = content.replace(
    /req\.status = 'Ditolak';/g,
    `req.status = 'Ditolak';\n            await supabase.from('leave_requests').update({ status: 'Ditolak' }).eq('id', id);`
);

// Add Listener
content = content.replace(
    /listenersData\.push\(\{([^}]*)\}\);/g,
    `const newL = {$1};\n            await supabase.from('listeners_data').insert([newL]);\n            listenersData.push(newL);`
);

fs.writeFileSync(legacyPath, content, 'utf8');
console.log('legacy.js patched successfully!');
