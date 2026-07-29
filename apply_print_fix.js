const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldModalStart = `
    <!-- A4 PRINTABLE OVERLAY / PREVIEW MODAL -->
    <div id="printModal"
        class="fixed inset-0 bg-slate-950/80 backdrop-blur-md hidden items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative my-8">
            <!-- Modal Header Toolbar -->
            <div class="no-print flex items-center justify-between border-b pb-4 mb-6 border-slate-200">
`;

const newModalStart = `
    <!-- A4 PRINTABLE OVERLAY / PREVIEW MODAL -->
    <div id="printModal"
        class="fixed inset-0 bg-slate-950/80 backdrop-blur-md hidden items-center justify-center z-50 p-4 overflow-y-auto print:block print:static print:bg-transparent print:p-0">
        <div class="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative my-8 print:m-0 print:shadow-none print:rounded-none print:p-0">
            <!-- Modal Header Toolbar -->
            <div class="print:hidden flex items-center justify-between border-b pb-4 mb-6 border-slate-200">
`;

code = code.replace(oldModalStart.trim(), newModalStart.trim());

// Also replace any standalone "no-print" classes with "print:hidden" globally to be safe?
code = code.replace(/class="no-print /g, 'class="print:hidden ');

fs.writeFileSync('index.html', code, 'utf8');
console.log("Successfully fixed print styling for KOP.");
