// Dummy Master Data Penyiar
export let penyiars = [];

// Categories list
export let broadcasterCategories = ["Penyiar Utama", "Co-Host & News", "Evening Prime Penyiar", "Freelance Announcer", "Music Director & Broadcaster"];

// Programs list
export let radioPrograms = [
    { id: "PROG-1", name: "JCC Morning Drive & News", time: "06:00 - 08:00 WIB", category: "Prime Time News & Talk" },
    { id: "PROG-2", name: "Santai Siang Hits Indonesia", time: "11:00 - 13:00 WIB", category: "Music & Infotainment" },
    { id: "PROG-3", name: "JCC Sore Sunset Breeze", time: "16:00 - 18:00 WIB", category: "Drive Time Music" },
    { id: "PROG-4", name: "Night Vibe & Intimate Stories", time: "20:00 - 22:00 WIB", category: "Night Talk & Slow Hits" }
];

// Attendance Logs
export let attendanceLogs = [];

// Current Active CheckIn state
export let currentActiveAttendance = null;
export function setCurrentActiveAttendance(val) { currentActiveAttendance = val; }
export let checkoutTimerInterval = null;
export function setCheckoutTimerInterval(val) { checkoutTimerInterval = val; }

// Agendas / Disposisi with Deadline
export let agendas = [];

// Achievement Events with Deadline
export let achievements = [];

// Ticker News List
export let tickerNewsList = ["Selamat Datang di Sistem Informasi Penyiaran JCCFM 101.5 MHz","Silakan login untuk mengakses portal"];

// Leave Requests (Cuti/Ijin) with Deadline
export let leaveRequests = [];

// Audience / Listeners Database
export let listenersData = [];

// Initial Admin Kop Surat & Dokumentasi Template Config
export let kopSuratConfig = {
    stationName: "STASIUN RADIO JCCFM 101.5 MHz",
    address: "Jl. Pemuda No. 88, Komplek Penyiaran Nusantara, Kota JCC | Hotline: (021) 889-1015 | Web: www.jccfm.com",
    city: "Kota JCC",
    signeeTitle: "Station Manager & Penanggung Jawab",
    signeeName: "H. Irwan Setiawan, M.I.Kom",
    docTemplateHeader: "SURAT KETERANGAN RESMI & REKAPITULASI PENYIARAN"
};

export function setPenyiars(data) { penyiars = data; }
export function setBroadcasterCategories(data) { broadcasterCategories = data; }
export function setAttendanceLogs(data) { attendanceLogs = data; }
export function setAgendas(data) { agendas = data; }
export function setAchievements(data) { achievements = data; }
export function setLeaveRequests(data) { leaveRequests = data; }
export function setListenersData(data) { listenersData = data; }
export function setKopSuratConfig(data) { kopSuratConfig = data; }
