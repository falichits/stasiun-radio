const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const styleBlock = `
    <style>
        @media print {
            body * {
                visibility: hidden;
            }
            #printModal, #printModal * {
                visibility: visible;
            }
            #printModal {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                display: block !important;
                background: transparent !important;
            }
            #printModal > div {
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                max-width: 100% !important;
                width: 100% !important;
                border-radius: 0 !important;
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
            }
            #printableArea {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
        }
    </style>
`;

if (!code.includes('<style>\n        @media print {')) {
    code = code.replace('</head>', styleBlock + '</head>');
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Successfully added raw print styles.");
} else {
    console.log("Print styles already exist.");
}
