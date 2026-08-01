const fs = require('fs');
let c = fs.readFileSync('src/legacy.js', 'utf8');

c = c.replace(
    /await supabase.from\('attendance_logs'\).insert\(\[newLog\]\);/g,
    `const dbLog = { id: newLog.id, penyiar_id: newLog.penyiarId, penyiar_name: newLog.penyiarName, program_name: newLog.programName, date: newLog.date, check_in: newLog.checkIn, check_out: newLog.checkOut, duration: newLog.duration, status: newLog.status, notes: newLog.notes };
            await supabase.from('attendance_logs').insert([dbLog]);`
);

c = c.replace(
    /await supabase.from\('agendas'\).insert\(\[newAgenda\]\);/g,
    `const dbAgenda = { id: newAgenda.id, title: newAgenda.title, description: newAgenda.description, assigned_to: newAgenda.target, priority: newAgenda.priority || 'Normal', deadline: newAgenda.date, status: newAgenda.status };
            await supabase.from('agendas').insert([dbAgenda]);`
);

c = c.replace(
    /await supabase.from\('surat_tugas'\).insert\(\[newST\]\);/g,
    `const dbST = { id: newST.id, penyiar_name: newST.penyiarName, program: newST.program, date: newST.date, notes: newST.notes, status: newST.status };
            await supabase.from('surat_tugas').insert([dbST]);`
);

c = c.replace(
    /await supabase.from\('achievements'\).insert\(\[newAch\]\);/g,
    `const dbAch = { id: newAch.id, title: newAch.title, description: newAch.desc, penyiar_name: newAch.target, date: newAch.date };
            await supabase.from('achievements').insert([dbAch]);`
);

c = c.replace(
    /await supabase.from\('leave_requests'\).insert\(\[newLR\]\);/g,
    `const dbLR = { id: newLR.id, penyiar_name: newLR.penyiarName, type: newLR.type, start_date: newLR.startDate, end_date: newLR.endDate, reason: newLR.reason, status: newLR.status };
            await supabase.from('leave_requests').insert([dbLR]);`
);

fs.writeFileSync('src/legacy.js', c);
