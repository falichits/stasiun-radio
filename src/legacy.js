
        /* ==========================================================================
           STATE & INITIAL DATA SETUP
           ========================================================================== */

        // Initial Admin Kop Surat & Dokumentasi Template Config
        let kopSuratConfig = {
            stationName: "STASIUN RADIO JCCFM 101.5 MHz",
            address: "Jl. Pemuda No. 88, Komplek Penyiaran Nusantara, Kota JCC | Hotline: (021) 889-1015 | Web: www.jccfm.com",
            city: "Kota JCC",
            signeeTitle: "Station Manager & Penanggung Jawab",
            signeeName: "H. Irwan Setiawan, M.I.Kom",
            docTemplateHeader: "SURAT KETERANGAN RESMI & REKAPITULASI PENYIARAN",
            ttdImage: null
        };

        // Dummy Master Data Penyiar
        let penyiars = [];

        // Categories list
        let broadcasterCategories = ["Penyiar Utama", "Co-Host & News", "Evening Prime Penyiar", "Freelance Announcer", "Music Director & Broadcaster"];

        // Programs list
        let radioPrograms = [
            { id: "PROG-1", name: "JCC Morning Drive & News", time: "06:00 - 08:00 WIB", category: "Prime Time News & Talk" },
            { id: "PROG-2", name: "Santai Siang Hits Indonesia", time: "11:00 - 13:00 WIB", category: "Music & Infotainment" },
            { id: "PROG-3", name: "JCC Sore Sunset Breeze", time: "16:00 - 18:00 WIB", category: "Drive Time Music" },
            { id: "PROG-4", name: "Night Vibe & Intimate Stories", time: "20:00 - 22:00 WIB", category: "Night Talk & Slow Hits" }
        ];

        // Attendance Logs
        let attendanceLogs = [];

        // Current Active CheckIn state
        let currentActiveAttendance = null;
        let checkoutTimerInterval = null;

        // Agendas / Disposisi with Deadline
        let agendas = [];
        let suratTugas = [];

        // Achievement Events with Deadline
        let achievements = [];
        let achievementBroadcasts = [];

        // Ticker News List
        let tickerNewsList = ["Selamat Datang di Sistem Informasi Penyiaran JCCFM 101.5 MHz","Silakan login untuk mengakses portal"];

        // Leave Requests (Cuti/Ijin) with Deadline
        let leaveRequests = [];

        // Notifications System State
        let notifications = [];

        // Audience / Listeners Database
        let listenersData = [];

        // Current Auth User state
        let currentUser = null;
let adminData = {
    name: "Budi Santoso (Admin)",
    email: "admin@jccfm.com",
    password: "admin123",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone: "08123456789",
    address: "Jl. Radio No. 101"
};

        /* ==========================================================================
           AUTHENTICATION & NAVIGATION LOGIC
           ========================================================================== */

        window.onload = function () {
            startClock();
            renderLoginView();
        };

        function startClock() {
            setInterval(() => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('id-ID') + ' WIB';
                const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                const liveClockEl = document.getElementById('liveClock');
                if (liveClockEl) liveClockEl.innerText = `${dateStr} | ${timeStr}`;
            }, 1000);
        }

        function renderLoginView() {
            document.getElementById('tickerBar').classList.add('hidden');
            document.getElementById('sidebar').classList.add('hidden');
            document.getElementById('topNavBar').classList.add('hidden');
            document.getElementById('appFooter').classList.add('hidden');

            const container = document.getElementById('viewContainer');
            container.innerHTML = `
                <div class="min-h-[85vh] flex items-center justify-center py-10 px-4">
                    <div class="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
                        <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

                        <div class="text-center mb-8 relative z-10">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/30 mb-4">
                                <i class="fa-solid fa-radio"></i>
                            </div>
                            <h2 class="text-2xl font-extrabold text-white tracking-tight">Portal Absensi JCCFM</h2>
                            <p class="text-xs text-slate-400 mt-1">Sistem Informasi Penyiaran & Absensi JCCFM RADIO</p>
                        </div>


                        <form onsubmit="handleLogin(event)" class="space-y-4 relative z-10">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Akses</label>
                                <div class="relative">
                                    <i class="fa-solid fa-envelope absolute left-3.5 top-3 text-slate-500 text-sm"></i>
                                    <input type="email" id="loginEmail" required class="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" placeholder="nama@jccfm.com">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                                <div class="relative">
                                    <i class="fa-solid fa-lock absolute left-3.5 top-3 text-slate-500 text-sm"></i>
                                    <input type="password" id="loginPassword" required class="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" placeholder="Password">
                                </div>
                            </div>

                            <button type="submit" style="background: linear-gradient(to right, #9333ea, #7c3aed); box-shadow: 0 4px 20px rgba(147,51,234,0.4);" class="w-full py-3 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2 hover:opacity-90">
                                <span>Masuk ke Sistem</span>
                                <i class="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                        </form>

                        <div class="mt-6 text-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
                            Hanya email & password terdaftar oleh Admin yang memiliki akses.
                        </div>
                    </div>
                </div>
            `;
        }

        function quickFill(role) {
            if (role === 'penyiar') {
                document.getElementById('loginEmail').value = 'andi@jccfm.com';
                document.getElementById('loginPassword').value = '123';
            } else {
                document.getElementById('loginEmail').value = adminData.email;
                document.getElementById('loginPassword').value = adminData.password;
            }
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;

            if (email === adminData.email && pass === adminData.password) {
                currentUser = {
                    role: 'admin',
                    data: { ...adminData }
                };
                setupDashboardApp();
                switchView('adminDashboard');
                showNotification('Berhasil masuk sebagai Admin System');
                return;
            }

            const foundPenyiar = penyiars.find(p => p.email.toLowerCase() === email.toLowerCase() && p.password === pass);
            if (foundPenyiar) {
                currentUser = {
                    role: 'penyiar',
                    data: foundPenyiar
                };
                setupDashboardApp();
                switchView('penyiarDashboard');
                showNotification(`Selamat datang kembali, ${foundPenyiar.name}`);
                return;
            }

            showNotification('Email atau Password tidak valid!', 'error');
        }

        function setupDashboardApp() {
            document.getElementById('tickerBar').classList.remove('hidden');
            document.getElementById('sidebar').classList.remove('hidden');
            document.getElementById('sidebar').classList.add('flex');
            document.getElementById('topNavBar').classList.remove('hidden');
            document.getElementById('appFooter').classList.remove('hidden');

            const tickerEl = document.getElementById('tickerContent');
            tickerEl.innerText = tickerNewsList.join(" â€¢ ");

            document.getElementById('sidebarUserName').innerText = currentUser.data.name;
            document.getElementById('sidebarUserRole').innerText = currentUser.role === 'admin' ? 'Administrator' : currentUser.data.category;
            document.getElementById('sidebarUserPhoto').src = currentUser.data.photo;

            document.getElementById('topUserGreeting').innerText = `Halo, ${currentUser.data.name.split(' ')[0]}`;
            document.getElementById('topUserRoleBadge').innerText = currentUser.role === 'admin' ? 'System Admin' : currentUser.data.category;
            document.getElementById('topUserAvatar').src = currentUser.data.photo;

            renderNavigationMenu();
            updateNotificationBadge();
        }

        function renderNavigationMenu() {
            const nav = document.getElementById('navMenuList');
            let menuHtml = '';

            if (currentUser.role === 'penyiar') {
                menuHtml = `
                    <button onclick="switchView('penyiarDashboard')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="penyiarDashboard">
                        <i class="fa-solid fa-clock flex-shrink-0 text-indigo-400"></i>
                        <span>Absen & Summary</span>
                    </button>
                    <button onclick="switchView('penyiarProfile')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="penyiarProfile">
                        <i class="fa-solid fa-id-card flex-shrink-0 text-indigo-400"></i>
                        <span>Profil Biodata</span>
                    </button>
                    <button onclick="switchView('agendaView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="agendaView">
                        <i class="fa-solid fa-list-check flex-shrink-0 text-indigo-400"></i>
                        <span>Agenda / Disposisi</span>
                    </button>
                    <button onclick="switchView('rangkumanAbsensi')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="rangkumanAbsensi">
                        <i class="fa-solid fa-chart-line flex-shrink-0 text-indigo-400"></i>
                        <span>Rangkuman Absensi</span>
                    </button>
                    <button onclick="switchView('achievementView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="achievementView">
                        <i class="fa-solid fa-trophy flex-shrink-0 text-indigo-400"></i>
                        <span>Achievement / Event</span>
                    </button>
                    <button onclick="switchView('programList')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="programList">
                        <i class="fa-solid fa-calendar-days flex-shrink-0 text-indigo-400"></i>
                        <span>Daftar Program</span>
                    </button>
                    <button onclick="switchView('cutiView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="cutiView">
                        <i class="fa-solid fa-envelope-open-text flex-shrink-0 text-indigo-400"></i>
                        <span>Pengajuan Cuti / Ijin</span>
                    </button>
                    <button onclick="switchView('customerView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="customerView">
                        <i class="fa-solid fa-users flex-shrink-0 text-indigo-400"></i>
                        <span>Database Pendengar</span>
                    </button>
                `;
            } else {
                menuHtml = `
                    <button onclick="switchView('adminDashboard')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="adminDashboard">
                        <i class="fa-solid fa-gauge flex-shrink-0 text-purple-400"></i>
                        <span>Dashboard Admin</span>
                    </button>
                    <button onclick="switchView('adminPenyiarMaster')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="adminPenyiarMaster">
                        <i class="fa-solid fa-users-gear flex-shrink-0 text-purple-400"></i>
                        <span>Data & Kategori Penyiar</span>
                    </button>
                    <button onclick="switchView('agendaView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="agendaView">
                        <i class="fa-solid fa-paper-plane flex-shrink-0 text-purple-400"></i>
                        <span>Kelola Agenda</span>
                    </button>
                    <button onclick="switchView('rangkumanAbsensi')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="rangkumanAbsensi">
                        <i class="fa-solid fa-file-invoice flex-shrink-0 text-purple-400"></i>
                        <span>Rekapan Siaran Penyiar</span>
                    </button>
                    <button onclick="switchView('achievementView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="achievementView">
                        <i class="fa-solid fa-award flex-shrink-0 text-purple-400"></i>
                        <span>Kelola Event / Task</span>
                    </button>
                    <button onclick="switchView('programList')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="programList">
                        <i class="fa-solid fa-sliders flex-shrink-0 text-purple-400"></i>
                        <span>Master Program Radio</span>
                    </button>
                    <button onclick="switchView('cutiView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="cutiView">
                        <i class="fa-solid fa-file-circle-check flex-shrink-0 text-purple-400"></i>
                        <span>Persetujuan Cuti</span>
                    </button>
                    <button onclick="switchView('customerView')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="customerView">
                        <i class="fa-solid fa-address-book flex-shrink-0 text-purple-400"></i>
                        <span>Database Pendengar</span>
                    </button>
                    <button onclick="switchView('adminProfile')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="adminProfile">
                        <i class="fa-solid fa-user-tie flex-shrink-0 text-purple-400"></i>
                        <span>Profil Admin</span>
                    </button>
                    <button onclick="switchView('tickerSettings')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="tickerSettings">
                        <i class="fa-solid fa-bullhorn flex-shrink-0 text-purple-400"></i>
                        <span>Kelola Ticker News</span>
                    </button>
                    <button onclick="switchView('adminSettings')" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" data-view="adminSettings">
                        <i class="fa-solid fa-heading flex-shrink-0 text-purple-400"></i>
                        <span>Kop & Template Surat</span>
                    </button>
                `;
            }

            nav.innerHTML = menuHtml;
        }

        function switchView(viewName) {
            document.querySelectorAll('.nav-btn').forEach(btn => {
                if (btn.dataset.view === viewName) {
                    btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/30');
                    btn.classList.remove('text-slate-300');
                } else {
                    btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/30');
                    btn.classList.add('text-slate-300');
                }
            });

            const pageTitles = {
                penyiarDashboard: 'Absensi & Summary Penyiar',
                penyiarProfile: 'Profil & Biodata Penyiar',
                adminDashboard: 'Dashboard Overview Admin',
                adminPenyiarMaster: 'Kelola Penyiar & Kategori',
                agendaView: 'Agenda & Disposisi Surat',
                rangkumanAbsensi: 'Rekapan & Laporan Siaran Penyiar',
                achievementView: 'Achievement & Event Tantangan',
                programList: 'Daftar Program Radio',
                cutiView: 'Pengajuan & Persetujuan Cuti',
                customerView: 'Database Pendengar Radio',
                adminSettings: 'Pengaturan Kop Surat & Template',
                adminProfile: 'Profil Biodata Admin',
                tickerSettings: 'Kelola Ticker News'
            };

            document.getElementById('pageTitle').innerText = pageTitles[viewName] || 'Dashboard';

            const sidebar = document.getElementById('sidebar');
            if (!sidebar.classList.contains('hidden') && window.innerWidth < 768) {
                sidebar.classList.add('hidden');
            }

            if (viewName === 'penyiarDashboard') renderPenyiarDashboard();
            else if (viewName === 'penyiarProfile') renderPenyiarProfile();
            else if (viewName === 'adminDashboard') renderAdminDashboard();
            else if (viewName === 'adminPenyiarMaster') renderAdminPenyiarMaster();
            else if (viewName === 'agendaView') renderAgendaView();
            else if (viewName === 'rangkumanAbsensi') renderRangkumanAbsensiView();
            else if (viewName === 'achievementView') renderAchievementView();
            else if (viewName === 'programList') renderProgramListView();
            else if (viewName === 'cutiView') renderCutiView();
            else if (viewName === 'adminProfile') renderAdminProfile();
            else if (viewName === 'customerView') renderCustomerView();
            else if (viewName === 'adminSettings') renderAdminSettingsView();
            else if (viewName === 'tickerSettings') renderTickerSettings();
        }

        function toggleSidebarMobile() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('fixed');
            sidebar.classList.toggle('inset-y-0');
            sidebar.classList.toggle('left-0');
        }

        function logout() {
            currentUser = null;
            if (checkoutTimerInterval) clearInterval(checkoutTimerInterval);
            renderLoginView();
            showNotification('Anda telah keluar dari akun');
        }

        /* ==========================================================================
           NOTIFICATIONS & DEADLINE REMINDER ENGINE
           ========================================================================== */

        function toggleNotificationDropdown() {
            const dropdown = document.getElementById('notificationDropdown');
            dropdown.classList.toggle('hidden');
            renderNotificationItems();
        }

        function renderNotificationItems() {
            const container = document.getElementById('notificationListContainer');
            if (!container) return;

            if (notifications.length === 0) {
                container.innerHTML = `<div class="p-4 text-center text-slate-500 italic">Tidak ada notifikasi baru</div>`;
                return;
            }

            container.innerHTML = notifications.map(n => `
                <div class="p-3 hover:bg-slate-800/40 transition-colors flex items-start gap-3 ${n.read ? 'opacity-60' : 'bg-slate-950/20'}">
                    <div class="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <i class="fa-solid fa-bell text-xs"></i>
                    </div>
                    <div class="flex-1">
                        <div class="font-bold text-white">${n.title}</div>
                        <p class="text-slate-300 text-[11px] mt-0.5">${n.message}</p>
                        <span class="text-[9px] text-slate-500 font-mono mt-1 block">${n.date}</span>
                    </div>
                </div>
            `).join('');
        }

        function updateNotificationBadge() {
            const badge = document.getElementById('notificationBadge');
            const unreadCount = notifications.filter(n => !n.read).length;
            if (badge) {
                badge.innerText = unreadCount;
                if (unreadCount === 0) badge.classList.add('hidden');
                else badge.classList.remove('hidden');
            }
        }

        function markAllNotificationsRead() {
            notifications.forEach(n => n.read = true);
            updateNotificationBadge();
            renderNotificationItems();
            showNotification('Semua notifikasi ditandai dibaca');
        }

        function addNotification(title, message, type = 'general') {
            notifications.unshift({
                id: "NOTIF-" + Date.now(),
                title: title,
                message: message,
                date: new Date().toISOString().split('T')[0],
                read: false,
                type: type
            });
            updateNotificationBadge();
        }

        /* ==========================================================================
           1. PENYIAR DASHBOARD & ABSENSI AUTOMATION
           ========================================================================== */

        function renderPenyiarDashboard() {
            const container = document.getElementById('viewContainer');
            const myLogs = attendanceLogs.filter(l => l.penyiarId === currentUser.data.id);
            const totalOnAirHours = myLogs.length * 2;

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="glass-card rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
                        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold inline-block mb-2">
                                    <i class="fa-solid fa-microphone text-indigo-400 mr-1.5"></i> Terminal Absensi Penyiar
                                </span>
                                <h3 class="text-xl font-bold text-white">Modul Check-In On-Air Studio</h3>
                                <p class="text-xs text-slate-400 mt-1">Pilih program siaran terlebih dahulu. Check-In tercatat otomatis sesuai waktu device & Checkout otomatis 2 Jam.</p>
                            </div>

                            <div class="text-right bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                                <div id="liveDeviceTime" class="text-xl font-bold font-mono text-indigo-400">00:00:00 WIB</div>
                                <div id="liveDeviceDate" class="text-[11px] text-slate-400 font-medium">Senin, 27 Juli 2026</div>
                            </div>
                        </div>

                        <div class="mt-6 border-t border-slate-800/80 pt-6" id="attendanceControlPanel"></div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="flex justify-between items-center text-slate-400 mb-2">
                                <span class="text-xs font-medium">Total Sesi Siaran</span>
                                <i class="fa-solid fa-headset text-indigo-400"></i>
                            </div>
                            <div class="text-2xl font-bold text-white">${myLogs.length} Sesi</div>
                            <div class="text-[11px] text-emerald-400 mt-1"><i class="fa-solid fa-arrow-up mr-1"></i>Periode Juli 2026</div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="flex justify-between items-center text-slate-400 mb-2">
                                <span class="text-xs font-medium">Total Jam On-Air</span>
                                <i class="fa-solid fa-clock text-purple-400"></i>
                            </div>
                            <div class="text-2xl font-bold text-white">${totalOnAirHours} Jam</div>
                            <div class="text-[11px] text-slate-400 mt-1">Tercatat Akurat</div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="flex justify-between items-center text-slate-400 mb-2">
                                <span class="text-xs font-medium">Tingkat Kehadiran</span>
                                <i class="fa-solid fa-circle-check text-emerald-400"></i>
                            </div>
                            <div class="text-2xl font-bold text-white">100%</div>
                            <div class="text-[11px] text-emerald-400 mt-1">Sangat Baik</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-chart-simple text-indigo-400"></i> Grafik Jam Siaran Minggu Ini
                            </h4>
                            <div class="h-56">
                                <canvas id="penyiarChart"></canvas>
                            </div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <i class="fa-solid fa-history text-purple-400"></i> Riwayat Absensi Terakhir
                                </h4>
                                <div class="space-y-3 overflow-y-auto max-h-52 pr-1">
                                    ${myLogs.map(log => `
                                        <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                                            <div>
                                                <div class="font-semibold text-white">${log.programName}</div>
                                                <div class="text-slate-400 text-[11px] mt-0.5">${log.date} | ${log.checkIn} - ${log.checkOut}</div>
                                            </div>
                                            <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                                                ${log.status}
                                            </span>
                                        </div>
                                    `).join('') || '<p class="text-xs text-slate-500 italic">Belum ada riwayat absensi.</p>'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            updateDeviceClock();
            renderPenyiarAttendancePanel();
            initPenyiarChart(myLogs);
        }

        function updateDeviceClock() {
            const now = new Date();
            const timeEl = document.getElementById('liveDeviceTime');
            const dateEl = document.getElementById('liveDeviceDate');
            if (timeEl) timeEl.innerText = now.toLocaleTimeString('id-ID') + ' WIB';
            if (dateEl) dateEl.innerText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }

        function renderPenyiarAttendancePanel() {
            const panel = document.getElementById('attendanceControlPanel');
            if (!panel) return;

            if (currentActiveAttendance) {
                panel.innerHTML = `
                    <div class="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div class="space-y-1">
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1.5 animate-pulse">
                                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> ON-AIR AKTIF
                            </span>
                            <h4 class="text-lg font-bold text-white">${currentActiveAttendance.programName}</h4>
                            <p class="text-xs text-slate-300">Waktu Check-In: <span class="font-mono text-indigo-300 font-semibold">${currentActiveAttendance.checkIn} WIB</span></p>
                        </div>

                        <div class="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                            <div class="text-xs text-slate-400">Checkout Otomatis Dalam (2 Jam):</div>
                            <div id="countdownTimer" class="text-2xl font-extrabold font-mono text-amber-400">01:59:59</div>
                            <button onclick="manualCheckout()" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2">
                                <i class="fa-solid fa-right-from-bracket"></i> Check-Out Manual
                            </button>
                        </div>
                    </div>
                `;
                startCountdownTimer();
            } else {
                panel.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div class="md:col-span-2">
                            <label class="block text-xs font-semibold text-slate-300 mb-2">Pilih Program Siaran Hari Ini:</label>
                            <select id="selectAttendanceProgram" class="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500">
                                ${radioPrograms.map(p => `<option value="${p.name}">${p.name} (${p.time})</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <button onclick="performCheckIn()" style="background: linear-gradient(to right, #9333ea, #7c3aed); box-shadow: 0 4px 20px rgba(147,51,234,0.4);" class="w-full py-3 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 hover:opacity-90">
                                <i class="fa-solid fa-fingerprint text-lg"></i>
                                <span>Check-In Sekarang</span>
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        function performCheckIn() {
            const progSelect = document.getElementById('selectAttendanceProgram');
            const progName = progSelect.value;
            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID');
            const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

            currentActiveAttendance = {
                id: "ABS-" + Date.now(),
                penyiarId: currentUser.data.id,
                penyiarName: currentUser.data.name,
                programName: progName,
                date: dateStr,
                checkIn: timeStr,
                startTime: Date.now()
            };

            addNotification("Absensi Berhasil", `Anda telah Check-In pada program ${progName}`, "attendance");
            showNotification(`Berhasil Check-In pada program ${progName}`);
            renderPenyiarAttendancePanel();
        }

        function startCountdownTimer() {
            if (checkoutTimerInterval) clearInterval(checkoutTimerInterval);

            checkoutTimerInterval = setInterval(() => {
                if (!currentActiveAttendance) return;

                const elapsedSeconds = Math.floor((Date.now() - currentActiveAttendance.startTime) / 1000);
                const totalSeconds = 2 * 60 * 60;
                const remainingSeconds = totalSeconds - elapsedSeconds;

                if (remainingSeconds <= 0) {
                    clearInterval(checkoutTimerInterval);
                    autoCheckout();
                } else {
                    const hours = Math.floor(remainingSeconds / 3600);
                    const minutes = Math.floor((remainingSeconds % 3600) / 60);
                    const seconds = remainingSeconds % 60;
                    const timerEl = document.getElementById('countdownTimer');
                    if (timerEl) {
                        timerEl.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                }
            }, 1000);
        }

        function manualCheckout() {
            finalizeCheckout("Check-Out Manual Selesai");
        }

        function autoCheckout() {
            finalizeCheckout("Check-Out Otomatis (2 Jam)");
        }

        function finalizeCheckout(statusLabel) {
            if (!currentActiveAttendance) return;

            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID');

            attendanceLogs.unshift({
                id: currentActiveAttendance.id,
                penyiarId: currentActiveAttendance.penyiarId,
                penyiarName: currentActiveAttendance.penyiarName,
                programName: currentActiveAttendance.programName,
                date: currentActiveAttendance.date,
                checkIn: currentActiveAttendance.checkIn,
                checkOut: timeStr,
                status: statusLabel
            });

            currentActiveAttendance = null;
            if (checkoutTimerInterval) clearInterval(checkoutTimerInterval);

            showNotification('Proses Check-Out berhasil dicatat!');
            refreshAdminChart(); // update chart real-time
            renderPenyiarDashboard();
        }

        let penyiarChartInstance = null;

        function initPenyiarChart(myLogs) {
            const ctx = document.getElementById('penyiarChart');
            if (!ctx) return;

            const now = new Date();
            const dayOfWeek = now.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(now);
            monday.setDate(now.getDate() + mondayOffset);
            monday.setHours(0, 0, 0, 0);

            const hoursPerDay = [0, 0, 0, 0, 0, 0, 0];
            myLogs.forEach(log => {
                const logDate = new Date(log.date + 'T00:00:00');
                const diffDays = Math.round((logDate - monday) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays <= 6) {
                    hoursPerDay[diffDays] += 2;
                }
            });

            if (penyiarChartInstance) {
                penyiarChartInstance.destroy();
                penyiarChartInstance = null;
            }

            penyiarChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
                    datasets: [{
                        label: 'Jam On-Air',
                        data: hoursPerDay,
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                    }
                }
            });
        }

        /* ==========================================================================
           2. PROFIL BIODATA PENYIAR & ADMIN CV EXPORT
           ========================================================================== */

        function renderPenyiarProfile() {
            const p = currentUser.data;
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="max-w-4xl mx-auto space-y-6">
                    <div class="glass-card rounded-3xl p-6 border border-slate-800">
                        <div class="flex flex-col sm:flex-row items-center gap-6">
                            <img src="${p.photo}" class="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl" alt="Penyiar Photo">
                            <div class="text-center sm:text-left space-y-1">
                                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h3 class="text-xl font-bold text-white">${p.name}</h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">${p.category}</span>
                                </div>
                                <p class="text-xs text-slate-400">ID Penyiar: <span class="font-mono text-indigo-400 font-semibold">${p.id}</span></p>
                                <p class="text-xs text-slate-400">Email Akses: ${p.email}</p>
                            </div>
                            <div class="sm:ml-auto">
                                <button onclick="openCVExportModal('${p.id}')" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                                    <i class="fa-solid fa-file-pdf"></i> Preview CV / Surat Keterangan
                                </button>
                            </div>
                        </div>

                        <div class="mt-8 border-t border-slate-800 pt-6">
                            <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-key text-indigo-400"></i> Ganti Password Akses Anda
                            </h4>
                            <form onsubmit="handlePenyiarPasswordChange(event)" class="max-w-md space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-300 mb-1">Password Baru</label>
                                    <input type="password" id="newPenyiarPass" required class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500">
                                </div>
                                <button type="submit" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all">
                                    Simpan Password Baru
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        }

        function handlePenyiarPasswordChange(e) {
            e.preventDefault();
            const newPass = document.getElementById('newPenyiarPass').value;
            currentUser.data.password = newPass;
            const found = penyiars.find(p => p.id === currentUser.data.id);
            if (found) found.password = newPass;

            showNotification('Password berhasil diperbarui!');
            document.getElementById('newPenyiarPass').value = '';
        }

        function openCVExportModal(penyiarId) {
            const targetPenyiar = penyiars.find(p => p.id === penyiarId) || currentUser.data;

            const htmlContent = `
                <div class="space-y-6">
                    <div class="text-center border-b pb-4 border-slate-300">
                        <h3 class="text-lg font-bold text-slate-900 uppercase tracking-wide">PROFIL & BIODATA PENYIAR</h3>
                        <p class="text-xs text-slate-600 font-sans">No. Reg: JCC/CV-PEN/${targetPenyiar.id}/2026</p>
                    </div>

                    <div class="flex items-start gap-6 font-sans text-xs text-slate-800">
                        <img src="${targetPenyiar.photo}" class="w-32 h-40 object-cover rounded border border-slate-400" alt="Foto">
                        <div class="space-y-2 flex-1">
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">ID Penyiar</span>
                                <span class="col-span-2 font-semibold text-slate-900">${targetPenyiar.id}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">Nama Lengkap</span>
                                <span class="col-span-2 font-semibold text-slate-900">${targetPenyiar.name}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">Kategori Penyiar</span>
                                <span class="col-span-2 text-slate-900">${targetPenyiar.category}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">Jenis Kelamin</span>
                                <span class="col-span-2 text-slate-900">${targetPenyiar.gender}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">No. HP / WA</span>
                                <span class="col-span-2 text-slate-900">${targetPenyiar.phone}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">Alamat</span>
                                <span class="col-span-2 text-slate-900">${targetPenyiar.address}</span>
                            </div>
                            <div class="grid grid-cols-3 border-b pb-1">
                                <span class="font-bold text-slate-600">Tanggal Bergabung</span>
                                <span class="col-span-2 text-slate-900">${targetPenyiar.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 bg-slate-100 rounded-lg border border-slate-300 font-sans text-xs text-slate-800 leading-relaxed italic">
                        <strong class="font-semibold text-slate-900 not-italic block mb-1">Surat Pernyataan Perusahaan:</strong>
                        Manajemen Stasiun Radio JCCFM 101.5 MHz menyatakan bahwa Saudara/i <strong>${targetPenyiar.name}</strong> adalah benar penyiar aktif resmi dan berhak menggunakan fasilitas penyiaran sesuai dengan aturan operasional stasiun.
                    </div>
                </div>
            `;

            triggerPrintModal(htmlContent);
        }

        /* ==========================================================================
           3. ADMIN DASHBOARD & MASTER PENYIAR MANAGEMENT
           ========================================================================== */

        function renderAdminDashboard() {
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="text-xs font-medium text-slate-400">Total Penyiar Terdaftar</div>
                            <div class="text-2xl font-extrabold text-white mt-1">${penyiars.length} Penyiar</div>
                            <div class="text-[11px] text-indigo-400 mt-1"><i class="fa-solid fa-users mr-1"></i>Aktif On-Air</div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="text-xs font-medium text-slate-400">Sesi Absensi Hari Ini</div>
                            <div class="text-2xl font-extrabold text-emerald-400 mt-1">${attendanceLogs.length} Check-In</div>
                            <div class="text-[11px] text-emerald-400 mt-1">100% Tepat Waktu</div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="text-xs font-medium text-slate-400">Pengajuan Cuti Pending</div>
                            <div class="text-2xl font-extrabold text-amber-400 mt-1">${leaveRequests.filter(r => r.status === 'Pending').length} Surat</div>
                            <div class="text-[11px] text-slate-400 mt-1">Membutuhkan Review</div>
                        </div>

                        <div class="glass-card p-5 rounded-2xl border border-slate-800">
                            <div class="text-xs font-medium text-slate-400">Agenda Disposisi Aktif</div>
                            <div class="text-2xl font-extrabold text-purple-400 mt-1">${agendas.length} Agenda</div>
                            <div class="text-[11px] text-purple-400 mt-1">Berjalan</div>
                        </div>
                    </div>

                    <div class="glass-card p-6 rounded-3xl border border-slate-800">
                        <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-chart-area text-purple-400"></i> Monitoring Kehadiran Global Penyiar (Minggu Ini)
                        </h4>
                        <div class="h-64">
                            <canvas id="adminGlobalChart"></canvas>
                        </div>
                    </div>
                </div>
            `;

            initAdminChart();
        }

        function getWeekAttendanceData() {
            // Hitung Senin minggu ini
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0=Minggu, 1=Senin...
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(now);
            monday.setDate(now.getDate() + mondayOffset);
            monday.setHours(0, 0, 0, 0);

            const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
            const counts = [0, 0, 0, 0, 0, 0, 0];

            attendanceLogs.forEach(log => {
                const logDate = new Date(log.date + 'T00:00:00');
                const diffDays = Math.round((logDate - monday) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays <= 6) {
                    counts[diffDays]++;
                }
            });

            return { labels: days, counts };
        }

        let adminGlobalChartInstance = null;

        function initAdminChart() {
            const ctx = document.getElementById('adminGlobalChart');
            if (!ctx) return;

            const { labels, counts } = getWeekAttendanceData();

            if (adminGlobalChartInstance) {
                adminGlobalChartInstance.destroy();
                adminGlobalChartInstance = null;
            }

            adminGlobalChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Total Sesi Absensi On-Air',
                        data: counts,
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#a855f7',
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#94a3b8', stepSize: 1 },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                    }
                }
            });
        }

        function refreshAdminChart() {
            const ctx = document.getElementById('adminGlobalChart');
            if (!ctx || !adminGlobalChartInstance) return;

            const { counts } = getWeekAttendanceData();
            adminGlobalChartInstance.data.datasets[0].data = counts;
            adminGlobalChartInstance.update('active');
        }

        function renderAdminPenyiarMaster() {
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">Master Biodata & Category Penyiar</h3>
                            <p class="text-xs text-slate-400">Tambah penyiar baru, edit data, upload foto, dan eksport CV resmi.</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="openAddPenyiarModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                                <i class="fa-solid fa-user-plus"></i> Tambah Penyiar
                            </button>
                            <button onclick="openCategoryModal()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2">
                                <i class="fa-solid fa-tags"></i> Jenis/Tipe Penyiar
                            </button>
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-300">
                                <thead class="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                                    <tr>
                                        <th class="p-4">Foto & ID</th>
                                        <th class="p-4">Nama Lengkap</th>
                                        <th class="p-4">Kategori/Tipe</th>
                                        <th class="p-4">No. HP & Alamat</th>
                                        <th class="p-4">Tgl Bergabung</th>
                                        <th class="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800/60">
                                    ${penyiars.map(p => `
                                        <tr class="hover:bg-slate-800/40 transition-colors">
                                            <td class="p-4 flex items-center gap-3">
                                                <img src="${p.photo}" class="w-10 h-10 rounded-full object-cover border border-indigo-500/40">
                                                <div>
                                                    <span class="font-mono text-indigo-400 font-bold block">${p.id}</span>
                                                    <span class="text-[10px] text-slate-500">${p.gender}</span>
                                                </div>
                                            </td>
                                            <td class="p-4">
                                                <div class="font-bold text-white">${p.name}</div>
                                                <div class="text-[10px] text-slate-400">${p.email}</div>
                                            </td>
                                            <td class="p-4">
                                                <span class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                                                    ${p.category}
                                                </span>
                                            </td>
                                            <td class="p-4">
                                                <div class="text-white">${p.phone}</div>
                                                <div class="text-[10px] text-slate-400 truncate max-w-[150px]">${p.address}</div>
                                            </td>
                                            <td class="p-4 font-mono text-slate-400">${p.joinDate}</td>
                                            <td class="p-4 text-center">
                                                <div class="flex items-center justify-center gap-1.5">
                                                    <button onclick="openCVExportModal('${p.id}')" title="Export CV / Surat" class="p-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                                                        <i class="fa-solid fa-file-pdf"></i>
                                                    </button>
                                                    <button onclick="openEditPenyiarModal('${p.id}')" title="Edit Penyiar" class="p-2 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white rounded-lg transition-all">
                                                        <i class="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button onclick="deletePenyiar('${p.id}')" title="Hapus Penyiar" class="p-2 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded-lg transition-all">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }

        function openAddPenyiarModal() {
            const body = `
                <form onsubmit="saveNewPenyiar(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">ID Penyiar</label>
                        <input type="text" id="addPenId" required value="PEN-${100 + penyiars.length + 1}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                        <input type="text" id="addPenName" required placeholder="Contoh: Rina Wijaya" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Kategori/Tipe Penyiar</label>
                            <select id="addPenCategory" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                ${broadcasterCategories.map(c => `<option value="${c}">${c}</option>`).join('')}
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
            `;
            openAppModal('Tambah Penyiar Baru', body);
        }

        function openEditPenyiarModal(id) {
            const p = penyiars.find(x => x.id === id);
            if (!p) return;
            const body = `
                <form onsubmit="saveEditedPenyiar(event, '${id}')" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">ID Penyiar</label>
                        <input type="text" id="editPenId" readonly value="${p.id}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-400 cursor-not-allowed">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                        <input type="text" id="editPenName" required value="${p.name}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Kategori/Tipe Penyiar</label>
                            <select id="editPenCategory" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                ${broadcasterCategories.map(c => `<option value="${c}" ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                            <select id="editPenGender" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                <option value="Laki-laki" ${p.gender === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                                <option value="Perempuan" ${p.gender === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Email Akses Login</label>
                            <input type="email" id="editPenEmail" required value="${p.email}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Password</label>
                            <input type="text" id="editPenPass" required value="${p.password}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">No. HP / WA Aktif</label>
                        <input type="text" id="editPenPhone" required value="${p.phone}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Alamat Rumah</label>
                        <input type="text" id="editPenAddress" required value="${p.address}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tanggal Bergabung</label>
                        <input type="date" id="editPenJoinDate" required value="${p.joinDate}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                    </div>
                    <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl mt-4">
                        Simpan Perubahan
                    </button>
                </form>
            `;
            openAppModal('Edit Data Penyiar', body);
        }

        window.openEditPenyiarModal = openEditPenyiarModal;

        function saveEditedPenyiar(e, id) {
            e.preventDefault();
            
            const p = penyiars.find(x => x.id === id);
            if (!p) return;

            const oldName = p.name;
            const newName = document.getElementById('editPenName').value;

            p.name = newName;
            p.category = document.getElementById('editPenCategory').value;
            p.email = document.getElementById('editPenEmail').value;
            p.password = document.getElementById('editPenPass').value;
            p.address = document.getElementById('editPenAddress').value;
            p.phone = document.getElementById('editPenPhone').value;
            p.joinDate = document.getElementById('editPenJoinDate').value;
            p.gender = document.getElementById('editPenGender').value;

            if (oldName !== newName) {
                if (p.photo.includes('ui-avatars')) {
                    p.photo = 'https://ui-avatars.com/api/?background=random&color=fff&name=' + encodeURIComponent(newName);
                }
                attendanceLogs.forEach(l => { if (l.penyiarId === id) l.penyiarName = newName; });
                leaveRequests.forEach(l => { if (l.penyiarId === id) l.penyiarName = newName; });
            }

            closeAppModal();
            showNotification('Data penyiar diperbarui');
            renderPenyiarManagementView();
        }
        window.saveEditedPenyiar = saveEditedPenyiar;

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
                showNotification(`Penyiar ${newObj.name} berhasil ditambahkan`);
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
            const body = `
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
                        ${broadcasterCategories.map((c, i) => `
                            <div class="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                                <span class="text-white font-medium">${c}</span>
                                <button onclick="removeCategory(${i})" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            openAppModal('Kelola Master Jenis/Tipe Penyiar', body);
        }

        function addCategory() {
            const val = document.getElementById('newCategoryInput').value.trim();
            if (val && !broadcasterCategories.includes(val)) {
                broadcasterCategories.push(val);
                openCategoryModal();
                showNotification('Jenis penyiar berhasil ditambahkan');
            }
        }

        function removeCategory(index) {
            broadcasterCategories.splice(index, 1);
            openCategoryModal();
            showNotification('Kategori dihapus');
        }

        /* ==========================================================================
           4. AGENDA / DISPOSISI AGENDA MODULE WITH DEADLINE REMINDER
           ========================================================================== */

        let agendaMonthFilter = '';
        window.setAgendaMonthFilter = function(val) {
            agendaMonthFilter = val;
            renderAgendaView();
        }

        
        function renderAgendaView() {
            const container = document.getElementById('viewContainer');
            
            let agendaHtml = '';

            const filteredAgendas = agendaMonthFilter ? agendas.filter(a => (a.dateMasuk && a.dateMasuk.startsWith(agendaMonthFilter)) || (a.date && a.date.startsWith(agendaMonthFilter))) : agendas;
            const filteredSuratTugas = agendaMonthFilter ? suratTugas.filter(st => st.dateMasuk && st.dateMasuk.startsWith(agendaMonthFilter)) : suratTugas;

            // Filter Bar
            agendaHtml += `
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-4 flex items-center gap-3">
                    <label class="text-xs text-slate-300 font-bold"><i class="fa-solid fa-filter text-indigo-400 mr-1"></i> Filter Periode:</label>
                    <input type="month" value="${agendaMonthFilter}" onchange="setAgendaMonthFilter(this.value)" class="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white">
                    <button onclick="setAgendaMonthFilter('')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs transition">Reset</button>
                </div>
            `;

            // Table Agenda (Global)
            agendaHtml += `
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white"><i class="fa-solid fa-folder-open text-indigo-400 mr-2"></i> Daftar Agenda Radio</h3>
                            <p class="text-xs text-slate-400 mt-1">Informasi dan arahan agenda umum stasiun radio.</p>
                        </div>
                        <button onclick="openCreateAgendaModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                            <i class="fa-solid fa-plus"></i> Buat Agenda
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300">
                            <thead class="bg-slate-950/50 text-slate-400 uppercase font-semibold">
                                <tr>
                                    <th class="p-3 rounded-tl-lg">No</th>
                                    <th class="p-3">Judul & Ditujukan Ke</th>
                                    <th class="p-3">Tgl Surat & Deadline</th>
                                    <th class="p-3">Deskripsi & Lampiran</th>
                                    <th class="p-3">Pembuat</th>
                                    ${currentUser.role === 'admin' ? '<th class="p-3 rounded-tr-lg">Aksi</th>' : '<th class="p-3 rounded-tr-lg"></th>'}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60">
                                ${filteredAgendas.length === 0 ? '<tr><td colspan="6" class="p-4 text-center text-slate-500">Belum ada agenda.</td></tr>' : ''}
                                ${filteredAgendas.map((a, idx) => `
                                    <tr class="hover:bg-slate-800/30">
                                        <td class="p-3">${idx + 1}</td>
                                        <td class="p-3">
                                            <div class="font-bold text-white">${a.title}</div>
                                            <div class="text-[10px] text-indigo-300 mt-1">Ke: ${a.target === 'ALL' ? 'Semua Penyiar' : (a.target ? getPenyiarName(a.target) : 'Global')}</div>
                                        </td>
                                        <td class="p-3">
                                            <div class="text-[10px] text-slate-400">Tgl: ${a.dateMasuk || '-'}</div>
                                            <div class="font-bold">DL: ${a.date}</div>
                                        </td>
                                        <td class="p-3">
                                            <div class="mb-1">${a.description || '-'}</div>
                                            ${a.link ? `<a href="${a.link}" target="_blank" class="text-[10px] text-blue-400 hover:underline"><i class="fa-solid fa-link"></i> Lampiran</a>` : ''}
                                        </td>
                                        <td class="p-3"><span class="px-2 py-1 bg-slate-800 rounded text-[10px]">${a.createdBy || 'Admin'}</span></td>
                                        ${currentUser.role === 'admin' ? `
                                            <td class="p-3">
                                                <button onclick="deleteAgenda('${a.id}')" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        ` : '<td></td>'}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Surat Tugas Section
            let suratTugasHtml = '';
            
            if (currentUser.role === 'admin') {
                suratTugasHtml = `
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white"><i class="fa-solid fa-file-pen text-rose-400 mr-2"></i> Monitoring Surat Tugas</h3>
                                <p class="text-xs text-slate-400 mt-1">Kelola penugasan resmi untuk penyiar.</p>
                            </div>
                            <button onclick="openCreateSuratTugasModal()" class="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                                <i class="fa-solid fa-file-signature"></i> Buat Surat Tugas
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-300">
                                <thead class="bg-slate-950/50 text-slate-400 uppercase font-semibold">
                                    <tr>
                                        <th class="p-3 rounded-tl-lg">Judul Tugas</th>
                                        <th class="p-3">Ditujukan Ke</th>
                                        <th class="p-3">Tanggal, Jadwal & Lokasi</th>
                                        <th class="p-3">Status</th>
                                        <th class="p-3 rounded-tr-lg text-center">Aksi / Verifikasi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800/60">
                                    ${filteredSuratTugas.length === 0 ? '<tr><td colspan="5" class="p-4 text-center text-slate-500">Belum ada surat tugas.</td></tr>' : ''}
                                    ${filteredSuratTugas.map(st => `
                                        <tr class="hover:bg-slate-800/30">
                                            <td class="p-3">
                                                <div class="font-bold text-white">${st.kategori}</div>
                                                <div class="text-[10px] text-slate-400 mt-1">${st.pesan}</div>
                                                ${st.link ? `<a href="${st.link}" target="_blank" class="text-[10px] text-blue-400 mt-1 block hover:underline"><i class="fa-solid fa-link"></i> Link Dokumen</a>` : ''}
                                            </td>
                                            <td class="p-3 font-medium">${st.target === 'ALL' ? 'Semua Penyiar' : getPenyiarName(st.target)}</td>
                                            <td class="p-3">
                                                <div class="text-[10px] text-slate-400 mb-1">Surat Dibuat: ${st.dateMasuk || '-'}</div>
                                                <div><i class="fa-regular fa-calendar mr-1 text-slate-500"></i>${st.waktu.replace('T', ' ')}</div>
                                                <div class="mt-1"><i class="fa-solid fa-location-dot mr-1 text-slate-500"></i>${st.lokasi}</div>
                                            </td>
                                            <td class="p-3">${getBadgeHtml(st.status)}</td>
                                            <td class="p-3 text-center space-y-2">
                                                <button onclick="previewPDFSuratTugas('${st.id}')" class="w-full text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded text-[10px] font-bold">
                                                    <i class="fa-solid fa-file-pdf text-rose-400 mr-1"></i> Preview PDF
                                                </button>
                                                <button onclick="deleteSuratTugas('${st.id}')" class="w-full text-rose-300 hover:text-white bg-rose-900/50 px-2 py-1.5 rounded text-[10px] font-bold mt-1">
                                                    <i class="fa-solid fa-trash mr-1"></i> Hapus
                                                </button>
                                                ${st.status === 'Laporan Terkirim' ? `
                                                    <button onclick="accSuratTugas('${st.id}')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 rounded text-[10px] font-bold">
                                                        <i class="fa-solid fa-check mr-1"></i> ACC Selesai
                                                    </button>
                                                ` : ''}
                                                ${st.status === 'Banding' ? `
                                                    <div class="bg-rose-950/30 p-2 rounded border border-rose-900/50 mt-1">
                                                        <p class="text-[9px] text-rose-300 mb-1 font-medium">Alasan: "${st.alasanBanding}"</p>
                                                        <div class="flex gap-1">
                                                            <button onclick="terimaBanding('${st.id}')" class="flex-1 bg-rose-600 text-white text-[9px] py-1 rounded hover:bg-rose-500">Lepas</button>
                                                            <button onclick="tolakBanding('${st.id}')" class="flex-1 bg-slate-700 text-white text-[9px] py-1 rounded hover:bg-slate-600">Tolak</button>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            } else {
                const myTugas = filteredSuratTugas.filter(st => st.target === 'ALL' || st.target === currentUser.data.id);
                suratTugasHtml = `
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-xl font-bold text-white mb-1"><i class="fa-solid fa-tasks text-rose-400 mr-2"></i> Surat Tugas Anda</h3>
                        <p class="text-xs text-slate-400 mb-4">Daftar penugasan resmi dari Admin.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${myTugas.length === 0 ? '<div class="col-span-2 text-center text-slate-500 text-xs py-4">Belum ada surat tugas untuk Anda.</div>' : ''}
                            ${myTugas.map(st => `
                                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="font-bold text-white text-sm">${st.kategori}</h4>
                                            ${getBadgeHtml(st.status)}
                                        </div>
                                        <p class="text-[11px] text-slate-400 bg-slate-900 p-2 rounded mb-3">${st.pesan}</p>
                                        ${st.link ? `<a href="${st.link}" target="_blank" class="text-[11px] text-blue-400 mb-3 inline-block hover:underline"><i class="fa-solid fa-link"></i> Link Dokumen</a>` : ''}
                                        <div class="text-[11px] text-slate-500 space-y-1 mb-4">
                                            <div class="text-indigo-400 font-medium mb-2"><i class="fa-solid fa-file-signature mr-1"></i> Dibuat: ${st.dateMasuk || '-'}</div>
                                            <div><i class="fa-regular fa-clock mr-1"></i> ${st.waktu.replace('T', ' ')}</div>
                                            <div><i class="fa-solid fa-location-dot mr-1"></i> ${st.lokasi}</div>
                                        </div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-800">
                                        ${st.status === 'Menunggu' ? `
                                            <div class="flex gap-2">
                                                <button onclick="terimaSuratTugas('${st.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-check mr-1"></i> Terima</button>
                                                <button onclick="openBandingModal('${st.id}')" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Banding</button>
                                            </div>
                                        ` : st.status === 'Diterima' ? `
                                            <div class="flex flex-col gap-2">
                                                <button onclick="openLaporanTugasModal('${st.id}')" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-xs font-bold">Kirim Laporan Hasil</button>
                                                <button onclick="previewPDFSuratTugas('${st.id}')" class="w-full text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-file-pdf text-rose-400 mr-1"></i> Preview & Print PDF</button>
                                            </div>
                                        ` : st.status === 'Banding' ? `
                                            <div class="text-[10px] text-amber-400 text-center bg-amber-900/20 py-1.5 rounded">Menunggu tanggapan admin atas banding Anda.</div>
                                        ` : st.status === 'Laporan Terkirim' ? `
                                            <div class="flex flex-col gap-2">
                                                <div class="text-[10px] text-indigo-400 text-center bg-indigo-900/20 py-1.5 rounded">Laporan terkirim. Menunggu ACC admin.</div>
                                                <button onclick="previewPDFSuratTugas('${st.id}')" class="w-full text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-file-pdf text-rose-400 mr-1"></i> Preview & Print PDF</button>
                                            </div>
                                        ` : `
                                            <div class="flex flex-col gap-2">
                                                <div class="text-[10px] text-emerald-400 text-center bg-emerald-900/20 py-1.5 rounded">Tugas telah diselesaikan (ACC).</div>
                                                <button onclick="previewPDFSuratTugas('${st.id}')" class="w-full text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded text-[10px] font-bold"><i class="fa-solid fa-file-pdf text-rose-400 mr-1"></i> Preview & Print PDF</button>
                                            </div>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            container.innerHTML = agendaHtml + suratTugasHtml;
        }
        
        function getPenyiarName(id) {
            const p = penyiars.find(x => x.id === id);
            return p ? p.name : id;
        }
        
        function getBadgeHtml(status) {
            if (status === 'Menunggu') return '<span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[9px] font-bold">Menunggu</span>';
            if (status === 'Diterima') return '<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">Dikerjakan</span>';
            if (status === 'Banding') return '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">Banding</span>';
            if (status === 'Laporan Terkirim') return '<span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">Laporan Masuk</span>';
            if (status === 'Selesai (ACC)') return '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Selesai (ACC)</span>';
            if (status === 'Dilepas (Batal)') return '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">Dilepas (Batal)</span>';
            return `<span class="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[9px] font-bold">${status}</span>`;
        }

        function openCreateAgendaModal() {
            const isPenyiar = currentUser && currentUser.role === 'penyiar';

            let recipientField;
            if (isPenyiar) {
                // Penyiar hanya bisa kirim ke Admin
                recipientField = `
                    <select id="agTarget" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white opacity-70 cursor-not-allowed" disabled>
                        <option value="ADMIN" selected>Admin</option>
                    </select>
                    <input type="hidden" id="agTargetHidden" value="ADMIN">`;
            } else {
                let penyiarOptions = '<option value="ALL">Semua Penyiar (Global)</option>';
                penyiars.forEach(p => {
                    penyiarOptions += `<option value="${p.id}">${p.name}</option>`;
                });
                recipientField = `
                    <select id="agTarget" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        ${penyiarOptions}
                    </select>`;
            }

            const body = `
                <form onsubmit="saveNewAgenda(event)" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Judul Agenda</label>
                        <input type="text" id="agTitle" required placeholder="Judul..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Ditujukan Kepada</label>
                        ${recipientField}
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Isi Detail / Catatan</label>
                        <textarea id="agDesc" rows="3" required placeholder="Rincian instruksi..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Link Lampiran Dokumentasi (Opsional)</label>
                        <input type="url" id="agLink" placeholder="https://..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tanggal Surat</label>
                            <input type="date" id="agDateMasuk" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tenggat Waktu (Deadline)</label>
                            <input type="date" id="agDate" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                    </div>
                    
                      <div class="flex gap-3 mt-4">
                          <button type="button" onclick="closeAppModal()" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">Batal</button>
                          <button type="submit" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">Terbitkan Agenda</button>
                      </div>

                </form>
            `;
            openAppModal('Buat Agenda Baru', body);
            document.getElementById('agDateMasuk').value = new Date().toISOString().split('T')[0];
        }

        function saveNewAgenda(e) {
            e.preventDefault();
            agendas.push({
                id: 'ag-' + Date.now(),
                title: document.getElementById('agTitle').value,
                target: (document.getElementById('agTargetHidden') || document.getElementById('agTarget')).value,
                description: document.getElementById('agDesc').value,
                link: document.getElementById('agLink').value,
                date: document.getElementById('agDate').value,
                dateMasuk: document.getElementById('agDateMasuk').value,
                createdBy: currentUser.role === 'admin' ? 'Admin' : currentUser.data.name
            });
            closeAppModal();
            showNotification('Agenda berhasil diterbitkan');
            renderAgendaView();
        }

        function deleteAgenda(id) {
            agendas = agendas.filter(a => a.id !== id);
            showNotification('Agenda dihapus');
            renderAgendaView();
        }

        function openCreateSuratTugasModal() {
            let penyiarOptions = '<option value="ALL">Semua Penyiar (Global)</option>';
            penyiars.forEach(p => {
                penyiarOptions += `<option value="${p.id}">${p.name}</option>`;
            });
            
            const body = `
                <form onsubmit="saveNewSuratTugas(event)" class="space-y-4 text-sm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Kategori Tugas</label>
                            <input type="text" list="kategoriList" id="stKategori" required placeholder="Pilih atau ketik baru..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500 [color-scheme:dark]">
                            <datalist id="kategoriList">
                                <option value="Siaran Khusus"></option>
                                <option value="Liputan Lapangan"></option>
                                <option value="MC / Host"></option>
                                <option value="Produksi Iklan"></option>
                                <option value="Lainnya"></option>
                            </datalist>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Ditugaskan Kepada</label>
                            <select id="stTarget" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                ${penyiarOptions}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Tanggal Surat</label>
                            <input type="date" id="stDateMasuk" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Waktu Pelaksanaan</label>
                            <input type="datetime-local" id="stWaktu" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Lokasi</label>
                            <input type="text" id="stLokasi" required placeholder="Studio / Luar" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Link Surat Tugas (Opsional)</label>
                            <input type="url" id="stLink" placeholder="https://..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Instruksi Tugas</label>
                        <textarea id="stPesan" rows="3" required placeholder="Detail tugas..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl mt-2">Terbitkan Surat Tugas</button>
                </form>
            `;
            openAppModal('Buat Surat Tugas Baru', body);
            document.getElementById('stDateMasuk').value = new Date().toISOString().split('T')[0];
        }

        function saveNewSuratTugas(e) {
            e.preventDefault();
            suratTugas.unshift({
                id: 'st-' + Date.now(),
                noSurat: 'ST/JCC/2026/' + Math.floor(Math.random() * 900 + 100),
                kategori: document.getElementById('stKategori').value,
                target: document.getElementById('stTarget').value,
                dateMasuk: document.getElementById('stDateMasuk').value,
                waktu: document.getElementById('stWaktu').value,
                lokasi: document.getElementById('stLokasi').value,
                pesan: document.getElementById('stPesan').value,
                link: document.getElementById('stLink').value,
                status: 'Menunggu',
                alasanBanding: '',
                laporanHasil: ''
            });
            closeAppModal();
            showNotification('Surat Tugas diterbitkan!');
            renderAgendaView();
        }

        // Penyiar Actions
        function terimaSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Diterima';
                showNotification('Tugas diterima.');
                renderAgendaView();
            }
        }
        
        function openBandingModal(id) {
            const body = `
                <form onsubmit="saveBanding(event, '${id}')" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-rose-400 mb-1">Alasan Banding / Keberatan</label>
                        <textarea id="bandingReason" rows="3" required placeholder="Sebutkan alasan (misal jadwal bentrok)..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-rose-500"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl mt-2">Kirim Banding</button>
                </form>
            `;
            openAppModal('Ajukan Banding Tugas', body);
        }

        function saveBanding(e, id) {
            e.preventDefault();
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Banding';
                st.alasanBanding = document.getElementById('bandingReason').value;
                closeAppModal();
                showNotification('Banding berhasil diajukan.');
                renderAgendaView();
            }
        }

        function openLaporanTugasModal(id) {
            const body = `
                <form onsubmit="saveLaporanTugas(event, '${id}')" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-indigo-400 mb-1">Laporan Hasil Pengerjaan</label>
                        <textarea id="laporanText" rows="3" required placeholder="Tuliskan keterangan hasil penugasan..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">Kirim Laporan</button>
                </form>
            `;
            openAppModal('Kirim Laporan Tugas', body);
        }

        function saveLaporanTugas(e, id) {
            e.preventDefault();
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Laporan Terkirim';
                st.laporanHasil = document.getElementById('laporanText').value;
                closeAppModal();
                showNotification('Laporan dikirim ke Admin.');
                renderAgendaView();
            }
        }

        // Admin Actions
        function deleteSuratTugas(id) {
            if (confirm('Apakah Anda yakin ingin menghapus surat tugas ini?')) {
                const idx = suratTugas.findIndex(x => x.id === id);
                if(idx !== -1) {
                    suratTugas.splice(idx, 1);
                    showNotification('Surat tugas berhasil dihapus.');
                    renderAgendaView();
                }
            }
        }

        function accSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Selesai (ACC)';
                showNotification('Tugas di-ACC.');
                renderAgendaView();
            }
        }
        
        function terimaBanding(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Dilepas (Batal)';
                showNotification('Tugas dilepas.');
                renderAgendaView();
            }
        }
        
        function tolakBanding(id) {
            const st = suratTugas.find(x => x.id === id);
            if(st) {
                st.status = 'Menunggu'; // back to normal
                st.alasanBanding = '';
                showNotification('Banding ditolak. Status kembali Menunggu.');
                renderAgendaView();
            }
        }

        function previewPDFSuratTugas(id) {
            const st = suratTugas.find(x => x.id === id);
            if(!st) return;

            const penerima = st.target === 'ALL' ? 'Semua Penyiar' : getPenyiarName(st.target);

            const pdfHtml = `
                <div id="pdf-export-content" class="bg-white text-black p-8 font-serif leading-relaxed mx-auto" style="width: 210mm; min-height: 297mm; max-width: 100%;">
                    <div class="text-center border-b-4 border-double border-black pb-4 mb-6">
                        <h2 class="text-2xl font-bold uppercase tracking-wider text-black">RADIO JCC FM 101.5 MHz</h2>
                        <p class="text-sm italic text-black">Jl. Media Utama No. 101, Kota JCC | Telp: (021) 123456</p>
                        <p class="text-sm text-black">Website: www.jccradio.com | Email: redaksi@jccradio.com</p>
                    </div>

                    <div class="text-center mb-6">
                        <h3 class="text-lg font-bold underline uppercase text-black">SURAT TUGAS RESMI</h3>
                        <p class="text-sm text-black">Nomor: ${st.noSurat}</p>
                    </div>

                    <p class="text-sm mb-4 text-black">Pimpinan Radio JCC FM memberikan tugas resmi kepada personel berikut:</p>

                    <table class="w-full text-sm mb-6 border-collapse text-black">
                        <tr>
                            <td class="w-48 font-bold py-1">Tanggal Surat</td>
                            <td class="py-1">: ${new Date(st.dateMasuk || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td class="w-48 font-bold py-1">Penyiar / Pelaksana</td>
                            <td class="py-1">: <strong>${penerima}</strong></td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Jenis Tugas</td>
                            <td class="py-1">: ${st.kategori}</td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Waktu Pelaksanaan</td>
                            <td class="py-1">: ${st.waktu.replace('T', ' ')}</td>
                        </tr>
                        <tr>
                            <td class="font-bold py-1">Lokasi Tugas</td>
                            <td class="py-1">: ${st.lokasi}</td>
                        </tr>
                    </table>

                    <div class="mb-8">
                        <p class="text-sm font-bold mb-1 text-black">Rincian Instruksi / Catatan Tugas:</p>
                        <div class="text-sm border border-gray-400 p-4 bg-gray-50 min-h-[100px] whitespace-pre-wrap text-black">${st.pesan}</div>
                    </div>

                    <p class="text-sm mb-8 text-black">Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh rasa tanggung jawab.</p>

                    <div class="flex justify-between text-sm pt-4 text-black">
                        <div class="text-center w-full flex justify-end">
                            <div class="text-center min-w-[200px]">
                                <p>${kopSuratConfig.city || 'Kota JCC'}, ${new Date(st.dateMasuk || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>${kopSuratConfig.signeeTitle || 'Station Manager'}</p>
                                ${kopSuratConfig.ttdImage ? `<div class="h-16 my-1 flex items-center justify-center"><img src="${kopSuratConfig.ttdImage}" style="height:60px;max-width:150px;object-fit:contain;display:block;margin:auto;" alt="TTD"></div>` : `<div class="h-16 my-1"></div>`}
                                <p class="font-bold underline">${kopSuratConfig.signeeName || 'H. Management Radio'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex justify-end gap-2 no-print" id="pdfActionBtns">
                    <button type="button" onclick="closeAppModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">Batal</button>
                    <button type="button" onclick="downloadHtmlToPdf()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-2">
                        <i class="fa-solid fa-download"></i> Unduh PDF
                    </button>
                </div>
            `;

            // Open it in a larger modal
            const modalBody = document.getElementById('appModalBody');
            const modalTitle = document.getElementById('appModalTitle');
            const modalInner = document.getElementById('appModal').querySelector('div');
            
            modalTitle.innerHTML = '<i class="fa-solid fa-file-pdf text-rose-400"></i> Preview Surat Tugas';
            modalBody.innerHTML = pdfHtml;
            
            // Make modal wider for A4 preview
            modalInner.classList.remove('max-w-lg');
            modalInner.classList.add('max-w-4xl');
            modalInner.classList.add('h-[90vh]'); // Make it tall
            modalInner.classList.add('flex');
            modalInner.classList.add('flex-col');
            modalBody.classList.add('flex-1');
            modalBody.classList.add('overflow-y-auto'); // Scrollable
            
            document.getElementById('appModal').classList.remove('hidden');
            document.getElementById('appModal').classList.add('flex');
            
            // Restore modal width on close hook
            const oldClose = window.closeAppModal;
            window.closeAppModal = function() {
                modalInner.classList.remove('max-w-4xl', 'h-[90vh]', 'flex-col', 'flex');
                modalInner.classList.add('max-w-lg');
                modalBody.classList.remove('flex-1', 'overflow-y-auto');
                
                oldClose();
                window.closeAppModal = oldClose; // restore
            };
        }

        function downloadHtmlToPdf() {
            if(typeof html2pdf === 'undefined') {
                alert('Library PDF belum dimuat sepenuhnya, mohon tunggu sebentar.');
                return;
            }
            
            const element = document.getElementById('pdf-export-content');
            const btns = document.getElementById('pdfActionBtns');
            btns.style.display = 'none'; // hide buttons during render

            // configure html2pdf
            const opt = {
                margin:       10,
                filename:     'Surat_Tugas.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                btns.style.display = 'flex';
                closeAppModal();
                showNotification('File PDF Surat Tugas diunduh!');
            });
        }
        
    

        let rangkumanPenyiarMonthFilter = '';
        window.setRangkumanPenyiarMonthFilter = function(val) {
            rangkumanPenyiarMonthFilter = val;
            renderRangkumanAbsensiView();
        }

        function renderRangkumanAbsensiView() {
            const container = document.getElementById('viewContainer');

            if (currentUser.role === 'penyiar') {
                let myLogs = attendanceLogs.filter(l => l.penyiarId === currentUser.data.id);
                if (rangkumanPenyiarMonthFilter) {
                    myLogs = myLogs.filter(l => l.date && l.date.startsWith(rangkumanPenyiarMonthFilter));
                }

                let periodTitle = rangkumanPenyiarMonthFilter ? `Laporan Kehadiran Periode Bulan ${new Date(rangkumanPenyiarMonthFilter + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` : `Laporan Kehadiran Periode Berjalan`;

                container.innerHTML = `
                    <div class="space-y-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">Rangkuman Absensi Penyiar</h3>
                                <p class="text-xs text-slate-400">Total Jam Siaran Periode Bulanan & Export Laporan PDF Resmi.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="month" value="${rangkumanPenyiarMonthFilter}" onchange="setRangkumanPenyiarMonthFilter(this.value)" class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                                <button onclick="setRangkumanPenyiarMonthFilter('')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">Reset</button>
                                <button onclick="exportPenyiarAttendancePDF()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                                    <i class="fa-solid fa-file-pdf"></i> Preview & Export PDF Bulanan
                                </button>
                            </div>
                        </div>

                        <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                            <div class="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
                                <span class="font-bold text-white">${periodTitle}</span>
                                <span class="text-slate-400">Total Jam: <strong class="text-indigo-400 font-bold">${myLogs.length * 2} Jam</strong></span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs text-slate-300">
                                    <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                                        <tr>
                                            <th class="p-4">Tanggal</th>
                                            <th class="p-4">Program Siaran</th>
                                            <th class="p-4">Jam Check-In</th>
                                            <th class="p-4">Jam Check-Out</th>
                                            <th class="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-800/60">
                                        ${myLogs.map(l => `
                                            <tr class="hover:bg-slate-800/30">
                                                <td class="p-4 font-mono">${l.date}</td>
                                                <td class="p-4 font-bold text-white">${l.programName}</td>
                                                <td class="p-4 font-mono text-emerald-400">${l.checkIn}</td>
                                                <td class="p-4 font-mono text-amber-400">${l.checkOut}</td>
                                                <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">${l.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // ADMIN REKAPAN SIARAN PENYIAR (OPSI PER PENYIAR & GLOBAL)
                container.innerHTML = `
                    <div class="space-y-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">Rekapan Siaran Penyiar (Admin Dashboard)</h3>
                                <p class="text-xs text-slate-400">Opsi filter rekapan siaran per penyiar spesifik atau global stasiun.</p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button onclick="exportAdminGlobalPDF()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                                    <i class="fa-solid fa-file-pdf"></i> Unduh Rekapan Global
                                </button>
                            </div>
                        </div>

                        <!-- FILTER CONTROLS FOR ADMIN -->
                        <div class="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                            <div class="w-full sm:w-1/2">
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Filter Opsi Penyiar:</label>
                                <select id="adminRekapanFilterSelect" onchange="filterAdminRekapan()" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white">
                                    <option value="GLOBAL">-- Global Semua Penyiar --</option>
                                    ${penyiars.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
                                </select>
                            </div>
                            <div class="w-full sm:w-1/2 flex items-end gap-2 mt-auto">
                                <button onclick="downloadSelectedRekapanPDF()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-download"></i> Unduh Rekapan Sesuai Pilihan
                                </button>
                            </div>
                        </div>

                        <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs text-slate-300">
                                    <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                                        <tr>
                                            <th class="p-4">Penyiar</th>
                                            <th class="p-4">Program</th>
                                            <th class="p-4">Tanggal</th>
                                            <th class="p-4">Waktu Siaran</th>
                                            <th class="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="adminRekapanTableBody" class="divide-y divide-slate-800/60">
                                    </tbody>
                                </table>
                            </div>
                            <div id="adminRekapanPagination" class="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/50">
                            </div>
                        </div>
                    </div>
                `;
                setTimeout(() => filterAdminRekapan(1), 0);
            }
        }

        let adminRekapanCurrentPage = 1;
        function filterAdminRekapan(page = null) {
            const selectEl = document.getElementById('adminRekapanFilterSelect');
            if (!selectEl) return;
            const val = selectEl.value;
            const tbody = document.getElementById('adminRekapanTableBody');
            const paginationContainer = document.getElementById('adminRekapanPagination');

            if (page !== null) {
                adminRekapanCurrentPage = page;
            } else {
                adminRekapanCurrentPage = 1;
            }

            let filtered = attendanceLogs;
            if (val !== 'GLOBAL') {
                filtered = attendanceLogs.filter(l => l.penyiarId === val);
            }

            const itemsPerPage = 10;
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            
            if (adminRekapanCurrentPage < 1) adminRekapanCurrentPage = 1;
            if (adminRekapanCurrentPage > totalPages) adminRekapanCurrentPage = totalPages;

            const startIndex = (adminRekapanCurrentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = filtered.slice(startIndex, endIndex);

            if (tbody) {
                tbody.innerHTML = paginatedData.map(l => `
                    <tr class="hover:bg-slate-800/30">
                        <td class="p-4 font-bold text-white">${l.penyiarName}</td>
                        <td class="p-4 text-indigo-300">${l.programName}</td>
                        <td class="p-4 font-mono text-slate-400">${l.date}</td>
                        <td class="p-4 font-mono text-xs">${l.checkIn} - ${l.checkOut}</td>
                        <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">${l.status}</span></td>
                    </tr>
                `).join('') || `<tr><td colspan="5" class="p-6 text-center text-slate-500 italic">Tidak ada rekapan untuk penyiar ini.</td></tr>`;
            }

            if (paginationContainer) {
                paginationContainer.innerHTML = `
                    <div class="text-xs text-slate-400">
                        Menampilkan <span class="font-bold text-white">${totalItems === 0 ? 0 : startIndex + 1}</span> 
                        sampai <span class="font-bold text-white">${Math.min(endIndex, totalItems)}</span> 
                        dari <span class="font-bold text-white">${totalItems}</span> data
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="filterAdminRekapan(${adminRekapanCurrentPage - 1})" ${adminRekapanCurrentPage === 1 ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <div class="text-xs font-bold text-slate-300 px-3">
                            Halaman ${adminRekapanCurrentPage} / ${totalPages}
                        </div>
                        <button onclick="filterAdminRekapan(${adminRekapanCurrentPage + 1})" ${adminRekapanCurrentPage === totalPages ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                `;
            }
        }
        function downloadSelectedRekapanPDF() {
            const val = document.getElementById('adminRekapanFilterSelect').value;
            if (val === 'GLOBAL') {
                exportAdminGlobalPDF();
            } else {
                exportAdminPersonalPDF(val);
            }
        }

        function exportPenyiarAttendancePDF() {
            const p = currentUser.data;
            let myLogs = attendanceLogs.filter(l => l.penyiarId === p.id);
            if (rangkumanPenyiarMonthFilter) {
                myLogs = myLogs.filter(l => l.date && l.date.startsWith(rangkumanPenyiarMonthFilter));
            }
            
            let periodTitle = rangkumanPenyiarMonthFilter ? `Bulan ${new Date(rangkumanPenyiarMonthFilter + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` : `Bulan ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;

            const htmlContent = `
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">REKAPITULASI SIARAN PENYIAR</h3>
                        <p class="text-xs text-slate-600">Periode: ${periodTitle}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded text-slate-800">
                        <div><strong>Nama Penyiar:</strong> ${p.name}</div>
                        <div><strong>ID Penyiar:</strong> ${p.id}</div>
                        <div><strong>Kategori:</strong> ${p.category}</div>
                        <div><strong>Total Jam Siaran:</strong> ${myLogs.length * 2} Jam</div>
                    </div>

                    <table class="w-full border-collapse border border-slate-300 text-left mt-4">
                        <thead>
                            <tr class="bg-slate-200 text-slate-900">
                                <th class="border border-slate-300 p-2">Tanggal</th>
                                <th class="border border-slate-300 p-2">Program Acara</th>
                                <th class="border border-slate-300 p-2">Check-In</th>
                                <th class="border border-slate-300 p-2">Check-Out</th>
                                <th class="border border-slate-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myLogs.map(l => `
                                <tr>
                                    <td class="border border-slate-300 p-2 font-mono">${l.date}</td>
                                    <td class="border border-slate-300 p-2 font-semibold">${l.programName}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.checkIn}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.checkOut}</td>
                                    <td class="border border-slate-300 p-2">${l.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            triggerPrintModal(htmlContent, p.name);
        }

                function exportAdminPersonalPDF(penyiarId) {
            const p = penyiars.find(x => x.id === penyiarId);
            if (!p) return;
            const myLogs = attendanceLogs.filter(l => l.penyiarId === p.id);

            const htmlContent = `
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">REKAPITULASI SIARAN PENYIAR</h3>
                        <p class="text-xs text-slate-600">Periode: Bulan ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded text-slate-800">
                        <div><strong>Nama Penyiar:</strong> ${p.name}</div>
                        <div><strong>ID Penyiar:</strong> ${p.id}</div>
                        <div><strong>Kategori:</strong> ${p.category}</div>
                        <div><strong>Total Jam Siaran:</strong> ${myLogs.length * 2} Jam</div>
                    </div>

                    <table class="w-full border-collapse border border-slate-300 text-left mt-4">
                        <thead>
                            <tr class="bg-slate-200 text-slate-900">
                                <th class="border border-slate-300 p-2">Tanggal</th>
                                <th class="border border-slate-300 p-2">Program Acara</th>
                                <th class="border border-slate-300 p-2">Check-In</th>
                                <th class="border border-slate-300 p-2">Check-Out</th>
                                <th class="border border-slate-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myLogs.map(l => `
                                <tr>
                                    <td class="border border-slate-300 p-2 font-mono">${l.date}</td>
                                    <td class="border border-slate-300 p-2 font-semibold">${l.programName}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.checkIn}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.checkOut}</td>
                                    <td class="border border-slate-300 p-2">${l.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            triggerPrintModal(htmlContent);
        }

function exportAdminGlobalPDF() {
            const htmlContent = `
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">REKAPITULASI SIARAN PENYIAR - GLOBAL</h3>
                        <p class="text-xs text-slate-600">Periode Operasional: Bulan ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <table class="w-full border-collapse border border-slate-300 text-left">
                        <thead>
                            <tr class="bg-slate-200 text-slate-900">
                                <th class="border border-slate-300 p-2">Penyiar</th>
                                <th class="border border-slate-300 p-2">Program</th>
                                <th class="border border-slate-300 p-2">Tanggal</th>
                                <th class="border border-slate-300 p-2">Waktu Siaran</th>
                                <th class="border border-slate-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${attendanceLogs.map(l => `
                                <tr>
                                    <td class="border border-slate-300 p-2 font-semibold">${l.penyiarName}</td>
                                    <td class="border border-slate-300 p-2">${l.programName}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.date}</td>
                                    <td class="border border-slate-300 p-2 font-mono">${l.checkIn} - ${l.checkOut}</td>
                                    <td class="border border-slate-300 p-2">${l.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            triggerPrintModal(htmlContent);
        }

        /* ==========================================================================
           6. ACHIEVEMENT / EVENT MENU WITH DEADLINE REMINDER
           ========================================================================== */

        function renderAchievementView() {
              const container = document.getElementById('viewContainer');
  
              if (currentUser.role === 'penyiar') {
                  container.innerHTML = `
                      <div class="space-y-6">
                          <div>
                              <h3 class="text-xl font-bold text-white">Event & Achievement Penyiaran</h3>
                              <p class="text-xs text-slate-400">Ikuti tantangan siaran khusus, kumpulkan poin dan kirim bukti event.</p>
                          </div>
  
                          ${achievementBroadcasts.length > 0 ? `
                          <div class="glass-card p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20">
                              <h4 class="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2"><i class="fa-solid fa-bell"></i> Broadcast Aktivitas Penyiar Lain</h4>
                              <div class="space-y-2 max-h-32 overflow-y-auto">
                                  ${achievementBroadcasts.map(b => `
                                      <div class="flex items-start gap-2 text-[11px] text-slate-300">
                                          <i class="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i>
                                          <span>${b.text}</span>
                                      </div>
                                  `).join('')}
                              </div>
                          </div>
                          ` : ''}
                          
                          ${achievementBroadcasts.length > 0 ? `
                          <div class="mb-6 bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-xl">
                              <div class="text-xs font-bold text-indigo-300 mb-2"><i class="fa-solid fa-bullhorn"></i> Aktivitas Penyiar Lain</div>
                              <ul class="text-[11px] text-slate-300 space-y-1">
                                  ${achievementBroadcasts.slice(0,3).map(b => `<li>${b.text}</li>`).join('')}
                              </ul>
                          </div>
                          ` : ''}
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                              ${achievements.map(ach => {
                      const myParticipated = ach.participants.find(p => p.penyiarId === currentUser.data.id);
                      if (myParticipated && myParticipated.status === 'Diabaikan') return '';
                      return `
                                      <div class="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden">
                                          <div class="space-y-2">
                                              <div class="flex justify-between items-start mb-2">
                                                  <span class="px-2.5 py-1 rounded-full ${myParticipated && myParticipated.status === 'Tidak Diterima' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'} text-[10px] font-bold flex items-center gap-1.5">
                                                      <i class="fa-solid ${myParticipated && myParticipated.status === 'Tidak Diterima' ? 'fa-xmark' : 'fa-trophy'}"></i> CHALLENGE EVENT ${myParticipated && myParticipated.status === 'Tidak Diterima' ? '(0 POIN)' : '(+50 POIN)'}
                                                  </span>
                                                  <span class="text-[10px] text-rose-400 font-bold flex items-center gap-1.5">
                                                      <i class="fa-regular fa-clock"></i> Tenggat: ${ach.deadline}
                                                  </span>
                                              </div>
                                              <h4 class="text-lg font-bold text-white">${ach.title}</h4>
                                              <div class="text-[11px] ${myParticipated && myParticipated.status === 'Tidak Diterima' ? 'text-rose-400' : 'text-slate-400'}">Hadiah: ${myParticipated && myParticipated.status === 'Tidak Diterima' ? `<s class="text-rose-500/50">${ach.reward}</s> (Gagal)` : ach.reward}</div>

                                          </div>
                                          
                                          <div class="flex items-center text-xs text-slate-400 mt-2">
                                              Peserta: ${ach.participants.filter(p => p.status !== 'Diabaikan').length}/${ach.quota}
                                          </div>
  
                                          <div class="border-t border-slate-800 pt-4 flex gap-3">
                                              ${!myParticipated ? `
                                                  <button onclick="ignoreChallenge('${ach.id}')" class="flex-1 py-2 bg-transparent border border-rose-500/50 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl transition-colors">
                                                      Abaikan
                                                  </button>
                                                  <button ${ach.participants.filter(p => p.status !== 'Diabaikan').length >= ach.quota ? 'disabled title="Kuota Penuh"' : ''} onclick="acceptChallenge('${ach.id}')" class="flex-1 py-2 ${ach.participants.filter(p => p.status !== 'Diabaikan').length >= ach.quota ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'} font-bold text-xs rounded-xl transition-colors">
                                                      ${ach.participants.filter(p => p.status !== 'Diabaikan').length >= ach.quota ? 'Kuota Penuh' : 'Ikuti'}
                                                  </button>
                                              ` : myParticipated.status === 'Selesai' ? `
                                                  <button disabled class="flex-1 py-2 bg-transparent border border-amber-500/50 text-amber-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                                                      <i class="fa-solid fa-gift"></i> Selamat!
                                                  </button>
                                                  <button onclick="openCertificateModal('${ach.id}')" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors">
                                                      <i class="fa-solid fa-envelope-open-text"></i> Pesan
                                                  </button>
                                              ` : myParticipated.status === 'Tidak Diterima' ? `
                                                  <button disabled class="flex-1 py-2 bg-transparent border border-rose-500/50 text-rose-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                                                      <i class="fa-solid fa-xmark"></i> Tidak Diterima
                                                  </button>
                                                  <button onclick="openSubmitProofModal('${ach.id}')" class="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20">
                                                      Kirim Ulang
                                                  </button>
                                              ` : `
                                                  <button disabled class="flex-1 py-2 bg-transparent border border-emerald-500/50 text-emerald-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                                                      <i class="fa-solid fa-check"></i> Diterima
                                                  </button>
                                                  <button ${myParticipated.proofLink ? 'disabled' : ''} onclick="openSubmitProofModal('${ach.id}')" class="flex-1 py-2 ${myParticipated.proofLink ? 'bg-slate-700 text-slate-400' : 'bg-amber-500 hover:bg-amber-400 text-slate-900'} font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20">
                                                      ${myParticipated.proofLink ? 'Bukti Terkirim' : 'Kirim Bukti'}
                                                  </button>
                                              `}
                                          </div>
                                      </div>
                                  `;
                  }).join('')}
                          </div>
                      </div>
                  `;
              } else {
                  container.innerHTML = `
                      <div class="space-y-6">
                          <div class="flex justify-between items-center">
                              <div>
                                  <h3 class="text-xl font-bold text-white">Event & Achievement Radio JCCFM</h3>
                                  <p class="text-xs text-slate-400">Ikuti tantangan siaran khusus, kirim bukti, kumpulkan poin dan dapatkan reward eksklusif</p>
                              </div>
                              <button onclick="openCreateAchievementModal()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2">
                                  <i class="fa-solid fa-plus"></i> Buat Event Baru
                              </button>
                          </div>
  
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                              ${achievements.map(ach => `
                                  <div class="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden">
                                      <div class="absolute top-4 right-4">
                                          <button onclick="deleteAchievement('${ach.id}')" class="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-colors">
                                              <i class="fa-solid fa-trash"></i>
                                          </button>
                                      </div>
                                      
                                      <div class="space-y-2 pr-10">
                                          <div class="flex justify-between items-start mb-2">
                                              <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1.5">
                                                  <i class="fa-solid fa-trophy"></i> CHALLENGE EVENT (+50 POIN)
                                              </span>
                                          </div>
                                          <h4 class="text-lg font-bold text-white">${ach.title}</h4>
                                          <div class="text-[11px] text-slate-400">Reward: ${ach.reward}</div>
                                          <div class="text-[11px] text-rose-400 font-bold flex items-center gap-1.5 mt-2">
                                              <i class="fa-regular fa-clock"></i> Tenggat: ${ach.deadline}
                                          </div>
                                      </div>
  
                                      <div class="border-t border-slate-800/80 pt-4 bg-slate-900/50 -mx-6 px-6 pb-2 -mb-6">
                                          <div class="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Status Pengiriman Bukti (Admin & Penyiar):</div>
                                          <div class="space-y-2 mb-4">
                                              ${ach.participants.map(p => `
                                                  <div class="flex flex-col gap-1 text-[11px]">
                                                      <div class="flex justify-between">
                                                          <span class="font-bold text-white">${p.penyiarId}: <a href="${p.proofLink || '#'}" target="_blank" class="${p.proofLink ? 'text-indigo-400 hover:underline' : 'text-slate-500'}">${p.proofLink ? 'Link Drive Bukti Siaran' : (p.status === 'Diabaikan' ? 'Abaikan Tantangan' : 'Belum Kirim Bukti')}</a></span>
                                                      </div>
                                                      <div class="flex justify-between items-center">
                                                          <span class="${p.status === 'Selesai' ? 'text-emerald-500' : p.status === 'Tidak Diterima' ? 'text-rose-500' : 'text-slate-400'} font-medium">${p.status}</span>
                                                          ${p.status !== 'Selesai' && p.status !== 'Tidak Diterima' && p.proofLink ? `
                                                          <div class="flex gap-2">
                                                              <button onclick="approveAchievementProof('${ach.id}', '${p.penyiarId}')" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold">ACC Selesai</button>
                                                              <button onclick="rejectAchievementProof('${ach.id}', '${p.penyiarId}')" class="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold">Tolak</button>
                                                          </div>` : ''}
                                                      </div>
                                                  </div>
                                              `).join('') || '<p class="text-[11px] text-slate-500 italic">Belum ada bukti yang dikirimkan.</p>'}
                                          </div>
                                          
                                          <div class="flex justify-between items-center text-xs text-slate-400 mt-4 border-t border-slate-800/80 pt-3">
                                              <span>Kuota Penyiar: ${ach.quota} Orang</span>
                                          </div>
                                      </div>
                                  </div>
                              `).join('')}
                          </div>
                      </div>
                  `;
              }
          }
          
          
        function openCreateAchievementModal() {
            const modalContent = `
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4">Buat Event Challenge Baru</h3>
                    <form id="createAchForm" onsubmit="saveNewAchievement(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Judul Event / Tantangan</label>
                            <input type="text" id="achTitle" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Deskripsi & Syarat</label>
                            <textarea id="achDesc" required rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1">Reward (Poin/Hadiah)</label>
                                <input type="text" id="achReward" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm" placeholder="Contoh: 50 Poin">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1">Kuota Penyiar</label>
                                <input type="number" id="achQuota" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm" min="1" value="5">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Tenggat Waktu Apply</label>
                            <input type="date" id="achDeadline" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm">
                        </div>
                        <div class="pt-4 flex gap-3">
                            <button type="button" onclick="closeAppModal()" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm">Batal</button>
                            <button type="submit" class="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm">Terbitkan Event</button>
                        </div>
                    </form>
                </div>
            `;
            openAppModal('Buat Event Baru', modalContent);
        }

        function saveNewAchievement(e) {
            e.preventDefault();
            const newAch = {
                id: "ACH-" + Date.now(),
                title: document.getElementById('achTitle').value,
                description: document.getElementById('achDesc').value,
                reward: document.getElementById('achReward').value,
                quota: parseInt(document.getElementById('achQuota').value),
                deadline: document.getElementById('achDeadline').value,
                period: "Juli - Agustus 2026",
                participants: []
            };
            achievements.unshift(newAch);
            closeAppModal();
            if (typeof addNotification !== 'undefined') {
                addNotification("Event Challenge Baru", `Tantangan baru diterbitkan dengan deadline: ${newAch.deadline}`, "challenge");
            }
            showNotification('Event tantangan diterbitkan!');
            renderAchievementView();
        }

        function approveAchievementProof(achId, penyiarId) {
            const ach = achievements.find(a => a.id === achId);
            if(ach) {
                const part = ach.participants.find(p => p.penyiarId === penyiarId);
                if(part) {
                    part.status = 'Selesai';
                    showNotification('Bukti di-ACC! Poin ditambahkan.');
                    renderAchievementView();
                }
            }
        }

        function rejectAchievementProof(achId, penyiarId) {
            const ach = achievements.find(a => a.id === achId);
            if(ach) {
                const part = ach.participants.find(p => p.penyiarId === penyiarId);
                if(part) {
                    part.status = 'Tidak Diterima';
                    showNotification('Bukti Ditolak!');
                    renderAchievementView();
                }
            }
        }

        function deleteAchievement(achId) {
            if(confirm('Yakin ingin menghapus event ini?')) {
                const achToDelete = achievements.find(a => a.id === achId);
                if (achToDelete && typeof achievementBroadcasts !== 'undefined') {
                    achievementBroadcasts = achievementBroadcasts.filter(b => !b.text.includes(achToDelete.title));
                }
                achievements = achievements.filter(a => a.id !== achId);
                showNotification('Event dihapus');
                renderAchievementView();
            }
        }
        function ignoreChallenge(achId) {
            const ach = achievements.find(a => a.id === achId);
            if (!ach) return;
            ach.participants.push({
                penyiarId: currentUser.data.id,
                status: 'Diabaikan',
                proofLink: ''
            });
            renderAchievementView();
        }

        function acceptChallenge(achId) {
            const ach = achievements.find(a => a.id === achId);
            if (!ach) return;
            
            const activeParticipants = ach.participants.filter(p => p.status !== 'Diabaikan').length;
            if (activeParticipants >= ach.quota) {
                showNotification('Maaf, kuota untuk tantangan ini sudah penuh.', 'error');
                return;
            }

            ach.participants.push({
                penyiarId: currentUser.data.id,
                status: 'Mengikuti',
                proofLink: ''
            });
            if (typeof achievementBroadcasts !== 'undefined') {
                achievementBroadcasts.unshift({
                    text: `${currentUser.data.name} telah menerima & mengikuti tantangan "${ach.title}"`
                });
            }
            showNotification('Tantangan berhasil diikuti!');
            renderAchievementView();
        }

        function openCertificateModal(achId) {
            const ach = achievements.find(a => a.id === achId);
            if(!ach) return;
            const htmlContent = `
                <div class="text-center py-10 space-y-8">
                    <div class="text-emerald-600 text-6xl mb-6">
                        <i class="fa-solid fa-award"></i>
                    </div>
                    <h2 class="text-3xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-emerald-500 inline-block pb-2">Sertifikat Apresiasi</h2>
                    <p class="text-slate-600 text-lg mt-8">Diberikan kepada:</p>
                    <p class="text-2xl font-bold text-indigo-700 uppercase">${currentUser.data.name}</p>
                    <div class="w-full max-w-lg mx-auto bg-slate-100 p-6 rounded-xl border border-slate-200 shadow-inner my-8">
                        <p class="text-slate-700 leading-relaxed">
                            Atas partisipasi aktif dan keberhasilannya dalam menyelesaikan <strong>Event & Tantangan Penyiaran</strong>:
                        </p>
                        <p class="text-xl font-bold text-slate-900 mt-3">"${ach.title}"</p>
                    </div>
                    <p class="text-slate-500 text-sm italic">
                        Poin penghargaan telah ditambahkan ke profil Anda. Terus tingkatkan performa siaran Anda!
                    </p>
                    <div class="pt-8 print:hidden">
                        <button onclick="window.print()" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 mx-auto transition-all">
                            <i class="fa-solid fa-print text-xl"></i> Cetak / Unduh PDF
                        </button>
                    </div>
                </div>
            `;
            triggerPrintModal(htmlContent);
        }

        function openJoinAchievementModal(achId) {
            const ach = achievements.find(a => a.id === achId);
            if(!ach) return;
            const modalContent = `
                <div class="space-y-4">
                    <p class="text-sm font-bold text-white">${ach.title}</p>
                    <div class="bg-slate-900 p-4 rounded-xl text-xs text-slate-400 mb-4">
                        Silakan masukkan link (Google Drive / Social Media) sebagai bukti Anda telah menyelesaikan tantangan ini.
                    </div>
                    <form id="joinAchForm" onsubmit="saveJoinAchievement(event, '${achId}')" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Link Bukti</label>
                            <input type="url" id="achProofLink" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm" placeholder="https://...">
                        </div>
                        <div class="pt-4 flex gap-3">
                            <button type="button" onclick="closeAppModal()" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm">Batal</button>
                            <button type="submit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm">Kirim Bukti</button>
                        </div>
                    </form>
                </div>
            `;
            openAppModal('Kirim Bukti Tantangan', modalContent);
        }

        function saveJoinAchievement(e, achId) {
            e.preventDefault();
            const link = document.getElementById('achProofLink').value;
            const ach = achievements.find(a => a.id === achId);
            if(!ach) return;
            
            const myPart = ach.participants.find(p => p.penyiarId === currentUser.data.id);
            if (myPart) {
                myPart.proofLink = link;
                myPart.status = 'Menunggu Admin';
            } else {
                ach.participants.push({
                    penyiarId: currentUser.data.id,
                    proofLink: link,
                    status: 'Menunggu Admin'
                });
            }
            if (typeof achievementBroadcasts !== 'undefined') {
                achievementBroadcasts.unshift({
                    text: `${currentUser.data.name} telah mengirimkan bukti untuk tantangan "${ach.title}"`
                });
            }
            closeAppModal();
            showNotification('Bukti berhasil dikirim!');
            renderAchievementView();
        }



          
        function printRekapanCuti() {
            const bulan = (document.getElementById('filterBulanCuti') || { value: '' }).value; // format YYYY-MM
            const penyiarId = (document.getElementById('filterPenyiarCuti') || { value: 'all' }).value;

            let filteredLeaves = leaveRequests;
            
            let filterText = "Periode: Semua Waktu";
            if (bulan) {
                const [year, month] = bulan.split('-');
                const monthName = new Date(year, month - 1, 1).toLocaleString('id-ID', { month: 'long' });
                filterText = `Periode: ${monthName} ${year}`;
                
                filteredLeaves = filteredLeaves.filter(l => l.startDate.startsWith(bulan) || l.endDate.startsWith(bulan));
            }

            if (penyiarId !== 'all') {
                const penyiar = penyiars.find(p => p.id === penyiarId);
                filterText += ` | Penyiar: ${penyiar ? penyiar.name : 'Unknown'}`;
                filteredLeaves = filteredLeaves.filter(l => l.penyiarId === penyiarId);
            } else {
                filterText += ' | Penyiar: Semua Penyiar';
            }

            const htmlContent = `
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">REKAPITULASI PENGAJUAN CUTI & IZIN PENYIAR</h3>
                        <p class="text-xs text-slate-600">${filterText}</p>
                    </div>
                    
                    <table class="w-full text-left border-collapse border border-slate-300">
                        <thead class="bg-slate-100">
                            <tr>
                                <th class="border border-slate-300 px-3 py-2">ID</th>
                                <th class="border border-slate-300 px-3 py-2">Nama Penyiar</th>
                                <th class="border border-slate-300 px-3 py-2">Jenis</th>
                                <th class="border border-slate-300 px-3 py-2">Tanggal</th>
                                <th class="border border-slate-300 px-3 py-2">Alasan</th>
                                <th class="border border-slate-300 px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredLeaves.length > 0 ? filteredLeaves.map(l => `
                                <tr>
                                    <td class="border border-slate-300 px-3 py-2">${l.id}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-semibold">${l.penyiarName}</td>
                                    <td class="border border-slate-300 px-3 py-2">${l.type}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-mono">${l.startDate} s/d ${l.endDate}</td>
                                    <td class="border border-slate-300 px-3 py-2">${l.reason}</td>
                                    <td class="border border-slate-300 px-3 py-2 font-bold ${l.status === 'ACC' ? 'text-emerald-600' : (l.status === 'Ditolak' ? 'text-rose-600' : 'text-amber-600')}">${l.status}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="6" class="border border-slate-300 px-3 py-4 text-center text-slate-500 italic">Tidak ada data cuti/izin pada periode ini.</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            `;
            
            triggerPrintModal(htmlContent);
        }

        /* ==========================================================================
           9. PENGELOLAAN CUTI / IJIN
           ========================================================================== */

        let cutiMonthFilter = '';
        window.setCutiMonthFilter = function(val) {
            cutiMonthFilter = val;
            renderCutiView();
        }

        window.deleteCuti = function(id) {
            if (confirm('Yakin ingin menghapus pengajuan ini?')) {
                const idx = leaveRequests.findIndex(x => x.id === id);
                if (idx !== -1) {
                    leaveRequests.splice(idx, 1);
                    showNotification('Pengajuan cuti/ijin berhasil dihapus.');
                    renderCutiView();
                }
            }
        }

          function renderCutiView() {
            const container = document.getElementById('viewContainer');

            if (currentUser.role === 'penyiar') {
                let myLeaves = leaveRequests.filter(l => l.penyiarId === currentUser.data.id);
                if (cutiMonthFilter) {
                    myLeaves = myLeaves.filter(l => l.startDate && l.startDate.startsWith(cutiMonthFilter));
                }

                container.innerHTML = `
                    <div class="space-y-6">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold text-white">Pengajuan Cuti / Ijin Penyiar</h3>
                                <p class="text-xs text-slate-400">Ajukan surat cuti/ijin sebelum tenggat waktu yang ditentukan admin.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="month" value="${cutiMonthFilter}" onchange="setCutiMonthFilter(this.value)" class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                                <button onclick="setCutiMonthFilter('')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">Reset</button>
                                <button onclick="openAddLeaveModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                                    <i class="fa-solid fa-plus"></i> Ajukan Cuti Baru
                                </button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            ${myLeaves.map(l => `
                                <div class="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-white">${l.type}</h4>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${l.status === 'ACC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${l.status}</span>
                                        </div>
                                        <p class="text-slate-300">${l.reason}</p>
                                        <div class="text-[11px] text-slate-400 font-mono">Tanggal: ${l.startDate} s/d ${l.endDate}</div>
                                        <div class="text-[11px] text-rose-400 font-semibold">Tenggat Pengajuan: ${l.deadline}</div>
                                        ${l.adminNotes ? `<div class="text-indigo-300 italic mt-1">Catatan Admin: ${l.adminNotes}</div>` : ''}
${l.status === 'ACC' ? `<div class="mt-3"><button onclick="printSuratIzin('${l.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow flex items-center gap-2"><i class="fa-solid fa-print"></i> Cetak Surat Izin</button></div>` : ''}
                                    </div>
                                    <div class="flex items-center">
                                        <button onclick="deleteCuti('${l.id}')" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"><i class="fa-solid fa-trash mr-1"></i> Hapus</button>
                                    </div>
                                </div>
                            `).join('') || '<p class="text-xs text-slate-500 italic">Belum ada riwayat pengajuan cuti.</p>'}
                        </div>
                    </div>
                `;
            } else {
                let filteredLeaves = leaveRequests;
                if (cutiMonthFilter) {
                    filteredLeaves = filteredLeaves.filter(l => l.startDate && l.startDate.startsWith(cutiMonthFilter));
                }

                container.innerHTML = `
                    <div class="space-y-6">
                        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">Persetujuan Cuti / Ijin Penyiar</h3>
                                <p class="text-xs text-slate-400">Review dan berikan persetujuan (ACC) atau penolakan surat cuti.</p>
                            </div>
                            <div class="flex flex-wrap items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50">
                                <input type="month" value="${cutiMonthFilter}" onchange="setCutiMonthFilter(this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white">
                                <button onclick="setCutiMonthFilter('')" class="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-2 py-1.5 text-xs font-bold transition">Reset</button>

                                <select id="filterPenyiarCuti" class="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[150px]">
                                    <option value="all">Semua Penyiar</option>
                                    ${penyiars.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                </select>
                                <button onclick="printRekapanCuti()" class="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-md transition-colors flex items-center gap-1.5">
                                    <i class="fa-solid fa-print"></i> Cetak Rekapan
                                </button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            ${filteredLeaves.map(l => `
                                <div class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-white">${l.penyiarName} (${l.type})</h4>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${l.status === 'ACC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${l.status}</span>
                                        </div>
                                        <p class="text-slate-300">${l.reason}</p>
                                        <div class="text-slate-400 font-mono">Durasi: ${l.startDate} s/d ${l.endDate} | Deadline: ${l.deadline}</div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="approveLeave('${l.id}', 'ACC')" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">ACC</button>
                                        <button onclick="approveLeave('${l.id}', 'Ditolak')" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl">Tolak</button>
                                        <button onclick="deleteCuti('${l.id}')" class="px-3 py-2 bg-rose-900/50 hover:bg-rose-800 text-rose-300 font-bold rounded-xl"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        function printSuratIzin(leaveId) {
            const l = leaveRequests.find(x => x.id === leaveId);
            if (!l) return;
            const htmlContent = `
                <div class="space-y-4 font-sans text-xs">
                    <div class="text-center border-b pb-2 mb-4">
                        <h3 class="text-base font-bold text-slate-900">SURAT KETERANGAN IZIN / CUTI</h3>
                        <p class="text-xs text-slate-600">ID Pengajuan: ${l.id}</p>
                    </div>
                    <div class="bg-slate-50 p-4 rounded border border-slate-200 text-slate-800 leading-relaxed">
                        <p class="mb-2">Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                        <table class="mb-4">
                            <tr><td class="pr-4 font-semibold">Nama Penyiar</td><td>: ${l.penyiarName}</td></tr>
                            <tr><td class="pr-4 font-semibold">ID Penyiar</td><td>: ${l.penyiarId}</td></tr>
                        </table>
                        <p class="mb-2">Telah diberikan izin untuk melaksanakan <strong>${l.type}</strong> dengan rincian sebagai berikut:</p>
                        <table class="mb-4">
                            <tr><td class="pr-4 font-semibold">Alasan / Keterangan</td><td>: ${l.reason}</td></tr>
                            <tr><td class="pr-4 font-semibold">Tanggal Mulai</td><td>: ${l.startDate}</td></tr>
                            <tr><td class="pr-4 font-semibold">Tanggal Selesai</td><td>: ${l.endDate}</td></tr>
                        </table>
                        <p>Status Pengajuan: <strong>${l.status}</strong></p>
                        ${l.adminNotes ? `<p class="mt-2">Catatan Admin: <em>${l.adminNotes}</em></p>` : ''}
                    </div>
                </div>
            `;
            triggerPrintModal(htmlContent);
        }

function openAddLeaveModal() {
            const body = `
                <form onsubmit="saveNewLeave(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Jenis Cuti / Ijin</label>
                        <select id="leaveType" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                            <option value="Cuti Tahunan">Cuti Tahunan</option>
                            <option value="Ijin Sakit">Ijin Sakit</option>
                            <option value="Ijin Keperluan Keluarga">Ijin Keperluan Keluarga</option>
                            <option value="Keperluan Lainnya">Keperluan Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Alasan</label>
                        <textarea id="leaveReason" required rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Mulai Tanggal</label>
                            <input type="date" id="leaveStart" required value="2026-08-01" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Sampai Tanggal</label>
                            <input type="date" id="leaveEnd" required value="2026-08-03" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Tenggat Batas Pengajuan</label>
                        <input type="date" id="leaveDeadline" required value="2026-07-28" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white [color-scheme:dark]">
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">
                        Kirim Pengajuan Cuti
                    </button>
                </form>
            `;
            openAppModal('Pengajuan Cuti / Ijin Baru', body);
        }

        function saveNewLeave(e) {
            e.preventDefault();
            const newL = {
                id: "CUT-" + Date.now(),
                penyiarId: currentUser.data.id,
                penyiarName: currentUser.data.name,
                type: document.getElementById('leaveType').value,
                reason: document.getElementById('leaveReason').value,
                startDate: document.getElementById('leaveStart').value,
                endDate: document.getElementById('leaveEnd').value,
                deadline: document.getElementById('leaveDeadline').value,
                status: "Pending",
                adminNotes: ""
            };
            leaveRequests.unshift(newL);
            closeAppModal();
            addNotification("Pengajuan Cuti", `Pengajuan cuti oleh ${currentUser.data.name} menunggu review`, "leave");
            showNotification('Pengajuan cuti berhasil dikirim');
            renderCutiView();
        }

        function approveLeave(id, status) {
            const l = leaveRequests.find(item => item.id === id);
            if (l) {
                l.status = status;
                l.adminNotes = status === 'ACC' ? 'Disetujui oleh Admin' : 'Ditolak oleh Admin';
                showNotification(`Cuti ${status}`);
                renderCutiView();
            }
        }

        /* ==========================================================================
           8. DATABASE PENDENGAR WITH SEARCH BAR & EXPORT TO EXCEL (.XLS/.CSV)
           ========================================================================== */

        function renderCustomerView() {
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">Database Pendengar Radio</h3>
                            <p class="text-xs text-slate-400">Pencarian data pendengar dan ekspor ke Excel (CSV format).</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="exportListenersToExcel()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                                <i class="fa-solid fa-file-excel"></i> Eksport ke Excel
                            </button>
                            <button onclick="openAddListenerModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                                <i class="fa-solid fa-user-plus"></i> Tambah Pendengar
                            </button>
                        </div>
                    </div>

                    <!-- SEARCH BAR FOR LISTENERS -->
                    <div class="glass-card p-4 rounded-2xl border border-slate-800">
                        <div class="relative">
                            <i class="fa-solid fa-search absolute left-3.5 top-3 text-slate-500"></i>
                            <input type="text" id="listenerSearchInput" onkeyup="filterListenersTable()" placeholder="Cari nama pendengar, alamat, atau program favorit..." class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500">
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-300">
                                <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th class="p-4">Nama Pendengar</th>
                                        <th class="p-4">Alamat</th>
                                        <th class="p-4">No. HP / WA</th>
                                        <th class="p-4">Gender</th>
                                        <th class="p-4">Program Favorit</th>
                                        <th class="p-4">Pencatat</th>
                                    </tr>
                                </thead>
                                <tbody id="listenerTableBody" class="divide-y divide-slate-800/60">
                                    ${listenersData.map(l => `
                                        <tr class="hover:bg-slate-800/30">
                                            <td class="p-4 font-bold text-white">${l.name}</td>
                                            <td class="p-4 text-slate-300">${l.address}</td>
                                            <td class="p-4 font-mono">${l.phone}</td>
                                            <td class="p-4">${l.gender}</td>
                                            <td class="p-4 text-indigo-300">${l.favoriteProgram}</td>
                                            <td class="p-4 text-slate-500 text-[10px]">${l.addedBy}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }

        function filterListenersTable() {
            const query = document.getElementById('listenerSearchInput').value.toLowerCase();
            const tbody = document.getElementById('listenerTableBody');

            const filtered = listenersData.filter(l =>
                l.name.toLowerCase().includes(query) ||
                l.address.toLowerCase().includes(query) ||
                l.favoriteProgram.toLowerCase().includes(query) ||
                l.phone.includes(query)
            );

            tbody.innerHTML = filtered.map(l => `
                <tr class="hover:bg-slate-800/30">
                    <td class="p-4 font-bold text-white">${l.name}</td>
                    <td class="p-4 text-slate-300">${l.address}</td>
                    <td class="p-4 font-mono">${l.phone}</td>
                    <td class="p-4">${l.gender}</td>
                    <td class="p-4 text-indigo-300">${l.favoriteProgram}</td>
                    <td class="p-4 text-slate-500 text-[10px]">${l.addedBy}</td>
                </tr>
            `).join('') || `<tr><td colspan="6" class="p-6 text-center text-slate-500 italic">Tidak ditemukan pendengar yang sesuai.</td></tr>`;
        }

        function openAddListenerModal() {
            const body = `
                <form onsubmit="saveNewListener(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Pendengar</label>
                        <input type="text" id="lisName" required placeholder="Nama..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">No. HP / WA</label>
                            <input type="text" id="lisPhone" required placeholder="0812..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Gender</label>
                            <select id="lisGender" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Alamat / Wilayah</label>
                        <input type="text" id="lisAddress" required placeholder="Kecamatan..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Program Radio Favorit</label>
                        <select id="lisProg" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                            ${radioPrograms.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2">
                        Simpan Pendengar Baru
                    </button>
                </form>
            `;
            openAppModal('Tambah Database Pendengar', body);
        }

        function saveNewListener(e) {
            e.preventDefault();
            const newL = {
                id: "LIS-" + Date.now(),
                name: document.getElementById('lisName').value,
                address: document.getElementById('lisAddress').value,
                phone: document.getElementById('lisPhone').value,
                gender: document.getElementById('lisGender').value,
                favoriteProgram: document.getElementById('lisProg').value,
                addedBy: currentUser.data.name
            };
            listenersData.unshift(newL);
            closeAppModal();
            showNotification('Pendengar baru berhasil disimpan');
            renderCustomerView();
        }

        function exportListenersToExcel() {
            let csvContent = "data:text/csv;charset=utf-8,ID,Nama Pendengar,Alamat,No HP,Gender,Program Favorit,Pencatat\n";
            listenersData.forEach(l => {
                csvContent += `"${l.id}","${l.name}","${l.address}","${l.phone}","${l.gender}","${l.favoriteProgram}","${l.addedBy}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "database_pendengar_jccfm.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('Database pendengar berhasil dieksport ke file Excel (CSV)');
        }

        /* ==========================================================================
           9. ADMIN KOP & DOKUMENTASI TEMPLATE EDITOR
           ========================================================================== */


        function renderTickerSettings() {
            const container = document.getElementById('viewContainer');
            container.innerHTML = `
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold text-white">Kelola Ticker News</h3>
                            <p class="text-xs text-slate-400">Atur teks berjalan di bagian atas halaman (pengumuman).</p>
                        </div>
                        <button onclick="document.getElementById('addTickerModal').classList.remove('hidden')" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-colors">
                            <i class="fa-solid fa-plus"></i> Tambah Pengumuman
                        </button>
                    </div>

                    <div class="space-y-3" id="tickerListContainer">
                        ${tickerNewsList.map((ticker, index) => `
                            <div class="glass-card p-4 rounded-xl border border-slate-800 flex justify-between items-center gap-4">
                                <div class="flex-1 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">${index + 1}</div>
                                    <p class="text-slate-300 text-sm font-medium">${ticker}</p>
                                </div>
                                <button onclick="deleteTickerNews(${index})" class="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Modal Add Ticker -->
                <div id="addTickerModal" class="hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl overflow-hidden transform transition-all">
                        <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h3 class="font-bold text-white flex items-center gap-2">
                                <i class="fa-solid fa-bullhorn text-indigo-400"></i> Tambah Pengumuman
                            </h3>
                            <button onclick="document.getElementById('addTickerModal').classList.add('hidden')" class="text-slate-400 hover:text-white transition-colors">
                                <i class="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1">Teks Pengumuman Baru</label>
                                <textarea id="newTickerContent" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm" placeholder="Contoh: Jangan lupa jadwal siaran minggu ini..."></textarea>
                            </div>
                            <div class="flex gap-3 justify-end pt-2">
                                <button onclick="document.getElementById('addTickerModal').classList.add('hidden')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors">Batal</button>
                                <button onclick="addTickerNews()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/30 transition-colors">Simpan Pengumuman</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function addTickerNews() {
            const val = document.getElementById('newTickerContent').value.trim();
            if(!val) return alert('Teks tidak boleh kosong!');
            tickerNewsList.push(val);
            document.getElementById('tickerContent').innerText = tickerNewsList.join(" • ");
            renderTickerSettings();
        }

        function deleteTickerNews(index) {
            if(confirm('Yakin ingin menghapus pengumuman ini?')) {
                tickerNewsList.splice(index, 1);
                document.getElementById('tickerContent').innerText = tickerNewsList.join(" • ");
                renderTickerSettings();
            }
        }

        function renderAdminSettingsView() {
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="max-w-3xl mx-auto space-y-6">
                    <div class="glass-card p-6 rounded-3xl border border-slate-800">
                        <h3 class="text-xl font-bold text-white mb-2">Editor KOP & Template Surat / Dokumentasi</h3>
                        <p class="text-xs text-slate-400 mb-6">Sesuaikan isian KOP surat, alamat stasiun, penandatangan resmi, serta header dokumentasi laporan yang akan tercetak otomatis.</p>

                        <form onsubmit="saveKopConfig(event)" class="space-y-4 text-xs">
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Nama Stasiun Radio (KOP)</label>
                                <input type="text" id="cfgStationName" required value="${kopSuratConfig.stationName}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Alamat & Kontak Stasiun (KOP)</label>
                                <input type="text" id="cfgAddress" required value="${kopSuratConfig.address}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Judul Template Dokumen / Laporan</label>
                                <input type="text" id="cfgDocHeader" required value="${kopSuratConfig.docTemplateHeader}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-semibold text-slate-300 mb-1">Kota Penerbitan</label>
                                    <input type="text" id="cfgCity" required value="${kopSuratConfig.city}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                                </div>
                                <div>
                                    <label class="block font-semibold text-slate-300 mb-1">Jabatan Penandatangan</label>
                                    <input type="text" id="cfgSigneeTitle" required value="${kopSuratConfig.signeeTitle}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                                </div>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap Penandatangan (Pejabat)</label>
                                <input type="text" id="cfgSigneeName" required value="${kopSuratConfig.signeeName}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                            </div>

                            <!-- TTD UPLOAD SECTION -->
                            <div class="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-3">
                                <div class="flex items-center gap-2 mb-1">
                                    <i class="fa-solid fa-signature text-indigo-400"></i>
                                    <label class="font-semibold text-slate-200 text-xs">Upload Gambar Tanda Tangan (TTD)</label>
                                </div>
                                <p class="text-[11px] text-slate-500">Upload gambar TTD (PNG transparan direkomendasikan). Gambar akan otomatis muncul di semua dokumen PDF yang dicetak.</p>
                                
                                <!-- Preview area -->
                                <div id="ttdPreviewWrap" class="flex items-center gap-4">
                                    ${kopSuratConfig.ttdImage
                                        ? `<div class="relative">
                                            <img id="ttdPreviewImg" src="${kopSuratConfig.ttdImage}" class="h-16 object-contain border border-slate-600 rounded-xl bg-white/5 px-2" alt="TTD Preview">
                                           </div>
                                           <span class="text-emerald-400 text-[11px] font-semibold flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> TTD sudah diset</span>`
                                        : `<div class="w-32 h-16 border border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 text-[10px]">Belum ada TTD</div>`
                                    }
                                </div>
                                
                                <div class="flex flex-wrap gap-2">
                                    <label for="cfgTtdUpload" class="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl transition-colors">
                                        <i class="fa-solid fa-upload"></i> ${kopSuratConfig.ttdImage ? 'Ganti Gambar TTD' : 'Upload Gambar TTD'}
                                    </label>
                                    <input type="file" id="cfgTtdUpload" accept="image/*" class="hidden" onchange="previewTtdUpload(event)">
                                    ${kopSuratConfig.ttdImage
                                        ? `<button type="button" onclick="removeTtdImage()" class="flex items-center gap-2 px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white text-[11px] font-bold rounded-xl transition-colors">
                                            <i class="fa-solid fa-trash"></i> Hapus TTD
                                           </button>`
                                        : ''
                                    }
                                </div>
                            </div>

                            <button type="submit" class="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl mt-4">
                                Simpan Konfigurasi Kop & Template
                            </button>
                        </form>
                    </div>
                </div>
            `;
        }

        function saveKopConfig(e) {
            e.preventDefault();
            kopSuratConfig.stationName = document.getElementById('cfgStationName').value;
            kopSuratConfig.address = document.getElementById('cfgAddress').value;
            kopSuratConfig.docTemplateHeader = document.getElementById('cfgDocHeader').value;
            kopSuratConfig.city = document.getElementById('cfgCity').value;
            kopSuratConfig.signeeTitle = document.getElementById('cfgSigneeTitle').value;
            kopSuratConfig.signeeName = document.getElementById('cfgSigneeName').value;
            // ttdImage already saved live via previewTtdUpload()
            showNotification('Konfigurasi KOP & template surat berhasil diperbarui!');
        }

        function previewTtdUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                kopSuratConfig.ttdImage = e.target.result;
                // update preview without full re-render
                const wrap = document.getElementById('ttdPreviewWrap');
                if (wrap) {
                    wrap.innerHTML = `
                        <div class="relative">
                            <img id="ttdPreviewImg" src="${e.target.result}" class="h-16 object-contain border border-slate-600 rounded-xl bg-white/5 px-2" alt="TTD Preview">
                        </div>
                        <span class="text-emerald-400 text-[11px] font-semibold flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> TTD berhasil diupload</span>`;
                }
                showNotification('Gambar TTD berhasil diupload!');
            };
            reader.readAsDataURL(file);
        }
        window.previewTtdUpload = previewTtdUpload;

        function removeTtdImage() {
            kopSuratConfig.ttdImage = null;
            renderAdminSettingsView();
            showNotification('Gambar TTD dihapus.');
        }
        window.removeTtdImage = removeTtdImage;

        /* ==========================================================================
           PROGRAM LIST & MODAL HELPERS
           ========================================================================== */

        function renderProgramListView() {
            const container = document.getElementById('viewContainer');

            container.innerHTML = `
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold text-white">Daftar Schedule & Program Radio JCCFM</h3>
                            <p class="text-xs text-slate-400">Jadwal resmi program penyiaran on-air yang digunakan saat Check-In.</p>
                        </div>
                        ${currentUser.role === 'admin' ? `
                            <button onclick="openAddProgramModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                                <i class="fa-solid fa-plus"></i> Tambah Program Radio
                            </button>
                        ` : ''}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${radioPrograms.map(p => `
                            <div class="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                                <div class="space-y-1">
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                        ${p.category}
                                    </span>
                                    <h4 class="text-base font-bold text-white">${p.name}</h4>
                                    <div class="text-xs text-amber-400 font-mono font-semibold">
                                        <i class="fa-solid fa-clock mr-1"></i> Jam Acara: ${p.time}
                                    </div>
                                </div>
                                ${currentUser.role === 'admin' ? `
                                    <button onclick="deleteProgram('${p.id}')" class="p-2 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded-xl">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function openAddProgramModal() {
            const body = `
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
            `;
            openAppModal('Tambah Program Radio', body);
        }

        function saveNewProgram(e) {
            e.preventDefault();
            radioPrograms.push({
                id: "PROG-" + Date.now(),
                name: document.getElementById('progName').value,
                time: document.getElementById('progTime').value,
                category: document.getElementById('progCat').value
            });
            closeAppModal();
            showNotification('Program radio ditambahkan');
            renderProgramListView();
        }

        function deleteProgram(id) {
            radioPrograms = radioPrograms.filter(p => p.id !== id);
            showNotification('Program dihapus');
            renderProgramListView();
        }

        function triggerPrintModal(htmlBody, penyiarName = null) {
            document.getElementById('kopStationName').innerText = kopSuratConfig.stationName;
            document.getElementById('kopStationAddress').innerText = kopSuratConfig.address;
            document.getElementById('kopCityDate').innerText = `${kopSuratConfig.city}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            document.getElementById('kopTitle').innerText = `${kopSuratConfig.signeeTitle}`;
            document.getElementById('kopSignee').innerText = kopSuratConfig.signeeName;
            document.getElementById('printableContent').innerHTML = htmlBody;

            // Render TTD image in signature area
            const ttdArea = document.getElementById('kopTtdArea');
            if (ttdArea) {
                if (kopSuratConfig.ttdImage) {
                    ttdArea.innerHTML = `<img src="${kopSuratConfig.ttdImage}" style="height:60px;max-width:150px;object-fit:contain;display:block;margin:auto;" alt="TTD">`;
                } else {
                    ttdArea.innerHTML = '';
                }
            }

            const leftArea = document.getElementById('kopSignatureLeft');
            if (leftArea) {
                if (penyiarName) {
                    leftArea.innerHTML = `
                        <div class="text-center min-w-[200px]">
                            <p class="font-bold text-slate-900">Penyiar</p>
                            <div class="h-16 my-1"></div>
                            <p class="font-bold text-slate-900 underline">${penyiarName}</p>
                        </div>
                    `;
                } else {
                    leftArea.innerHTML = `
                        <div class="flex flex-col justify-end h-full pb-2">
                            <p class="text-slate-500 text-left">Dokumen ini diterbitkan secara elektronik oleh Portal Resmi JCCFM.</p>
                            <p class="text-[10px] text-slate-400 mt-1 text-left">Verified Security Token: JCC-PDF-AUTH-2026</p>
                        </div>
                    `;
                }
            }
            const modal = document.getElementById('printModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closePrintModal() {
            const modal = document.getElementById('printModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function openAppModal(title, bodyHtml) {
            document.getElementById('appModalTitle').innerText = title;
            document.getElementById('appModalBody').innerHTML = bodyHtml;
            const modal = document.getElementById('appModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeAppModal() {
            const modal = document.getElementById('appModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
            if (typeof window.closePrintModal === 'function' && document.getElementById('printModal') && !document.getElementById('printModal').classList.contains('hidden')) {
                closePrintModal();
            }
        }

        function showNotification(message, type = 'success') {
            const notif = document.createElement('div');
            notif.className = `fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold text-white animate-bounce ${type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'}`;
            notif.innerHTML = `<i class="fa-solid fa-circle-info mr-2"></i> ${message}`;
            document.body.appendChild(notif);
            setTimeout(() => { notif.remove(); }, 3000);
        }
    

        function renderAdminProfile() {
            const container = document.getElementById('viewContainer');
            container.innerHTML = `
                <div class="max-w-4xl mx-auto space-y-6">
                    <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div class="flex items-center gap-5">
                            <img src="${adminData.photo}" class="w-24 h-24 rounded-full border-4 border-indigo-500/30 object-cover">
                            <div>
                                <h2 class="text-2xl font-bold text-white mb-1">${adminData.name}</h2>
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
                                <p class="font-semibold text-white">${adminData.email}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">Password</p>
                                <p class="font-semibold text-white">${adminData.password}</p>
                            </div>
                        </div>
                        
                        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                            <h3 class="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Kontak & Alamat</h3>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">No. Handphone</p>
                                <p class="font-semibold text-white">${adminData.phone || '-'}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 font-medium mb-1">Alamat Lengkap</p>
                                <p class="font-semibold text-white">${adminData.address || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        
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

        function openEditAdminProfileModal() {
            const body = `
                <form onsubmit="saveAdminProfile(event)" class="space-y-4 text-sm">
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                        <input type="text" id="editAdminName" value="${adminData.name}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Email Akses</label>
                            <input type="email" id="editAdminEmail" value="${adminData.email}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Password</label>
                            <input type="text" id="editAdminPass" value="${adminData.password}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">Foto Profil</label>
                        <div class="flex items-center gap-4">
                            <img id="adminPhotoPreview" src="${adminData.photo}" class="w-14 h-14 rounded-full object-cover border border-slate-700 shrink-0">
                            <input type="file" id="editAdminPhotoFile" accept="image/*" onchange="previewAdminPhoto(event)" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-1 text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer">
                        </div>
                        <input type="hidden" id="editAdminPhoto" value="${adminData.photo}">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">No. Handphone</label>
                            <input type="text" id="editAdminPhone" value="${adminData.phone || ''}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Alamat</label>
                            <input type="text" id="editAdminAddress" value="${adminData.address || ''}" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 outline-none">
                        </div>
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            `;
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
                document.getElementById('topUserGreeting').innerText = `Halo, ${currentUser.data.name.split(' ')[0]}`;
                document.getElementById('topUserAvatar').src = currentUser.data.photo;
            }

            closeAppModal();
            showNotification('Profil Admin berhasil diperbarui!', 'success');
            if (document.getElementById('pageTitle').innerText === 'Profil Biodata Admin') {
                renderAdminProfile();
            }
        }

  // Auto-attached to window for legacy onclick handlers
window.startClock = startClock;
window.renderLoginView = renderLoginView;
window.quickFill = quickFill;
window.handleLogin = handleLogin;
window.setupDashboardApp = setupDashboardApp;
window.renderNavigationMenu = renderNavigationMenu;
window.switchView = switchView;
window.addTickerNews = addTickerNews;
window.deleteTickerNews = deleteTickerNews;
window.toggleSidebarMobile = toggleSidebarMobile;
window.logout = logout;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.renderNotificationItems = renderNotificationItems;
window.updateNotificationBadge = updateNotificationBadge;
window.markAllNotificationsRead = markAllNotificationsRead;
window.addNotification = addNotification;
window.renderPenyiarDashboard = renderPenyiarDashboard;
window.updateDeviceClock = updateDeviceClock;
window.renderPenyiarAttendancePanel = renderPenyiarAttendancePanel;
window.performCheckIn = performCheckIn;
window.startCountdownTimer = startCountdownTimer;
window.manualCheckout = manualCheckout;
window.autoCheckout = autoCheckout;
window.finalizeCheckout = finalizeCheckout;
window.initPenyiarChart = initPenyiarChart;
window.renderPenyiarProfile = renderPenyiarProfile;
  window.renderAdminProfile = renderAdminProfile;
  window.previewAdminPhoto = previewAdminPhoto;
  window.openEditAdminProfileModal = openEditAdminProfileModal;
  window.saveAdminProfile = saveAdminProfile;
window.handlePenyiarPasswordChange = handlePenyiarPasswordChange;
window.openCVExportModal = openCVExportModal;
window.renderAdminDashboard = renderAdminDashboard;
window.initAdminChart = initAdminChart;
window.renderAdminPenyiarMaster = renderAdminPenyiarMaster;
window.openAddPenyiarModal = openAddPenyiarModal;
window.saveNewPenyiar = saveNewPenyiar;
window.deletePenyiar = deletePenyiar;
window.openCategoryModal = openCategoryModal;
window.addCategory = addCategory;
window.removeCategory = removeCategory;

window.renderAgendaView = renderAgendaView;
window.openCreateAgendaModal = openCreateAgendaModal;
window.saveNewAgenda = saveNewAgenda;
window.deleteAgenda = deleteAgenda;
window.openCreateSuratTugasModal = openCreateSuratTugasModal;
window.saveNewSuratTugas = saveNewSuratTugas;
window.terimaSuratTugas = terimaSuratTugas;
window.openBandingModal = openBandingModal;
window.saveBanding = saveBanding;
window.openLaporanTugasModal = openLaporanTugasModal;
window.saveLaporanTugas = saveLaporanTugas;
window.accSuratTugas = accSuratTugas;
window.terimaBanding = terimaBanding;
window.tolakBanding = tolakBanding;
window.deleteSuratTugas = deleteSuratTugas;
window.previewPDFSuratTugas = previewPDFSuratTugas;
window.downloadHtmlToPdf = downloadHtmlToPdf;
    
window.renderRangkumanAbsensiView = renderRangkumanAbsensiView;
window.filterAdminRekapan = filterAdminRekapan;
window.downloadSelectedRekapanPDF = downloadSelectedRekapanPDF;
window.exportPenyiarAttendancePDF = exportPenyiarAttendancePDF;
window.exportAdminPersonalPDF = exportAdminPersonalPDF;
window.exportAdminGlobalPDF = exportAdminGlobalPDF;
window.renderAchievementView = renderAchievementView;
window.openJoinAchievementModal = openJoinAchievementModal;
window.saveAchievementSubmission = window.saveJoinAchievement; // changed to use the correct function or undefined
window.openCreateAchievementModal = openCreateAchievementModal;
window.saveNewAchievement = saveNewAchievement;
window.approveAchievementProof = approveAchievementProof;
window.rejectAchievementProof = rejectAchievementProof;
window.deleteAchievement = deleteAchievement;
window.renderCutiView = renderCutiView;
window.printRekapanCuti = printRekapanCuti;
window.printSuratIzin = printSuratIzin;
window.openAddLeaveModal = openAddLeaveModal;
window.saveNewLeave = saveNewLeave;
window.approveLeave = approveLeave;
window.renderCustomerView = renderCustomerView;
window.filterListenersTable = filterListenersTable;
window.openAddListenerModal = openAddListenerModal;
window.saveNewListener = saveNewListener;
window.exportListenersToExcel = exportListenersToExcel;
window.renderAdminSettingsView = renderAdminSettingsView;
window.saveKopConfig = saveKopConfig;
window.renderProgramListView = renderProgramListView;
window.openAddProgramModal = openAddProgramModal;
window.saveNewProgram = saveNewProgram;
window.deleteProgram = deleteProgram;
window.triggerPrintModal = triggerPrintModal;
window.closePrintModal = closePrintModal;
window.openAppModal = openAppModal;
window.closeAppModal = closeAppModal;
window.showNotification = showNotification;

  window.acceptChallenge = typeof acceptChallenge !== 'undefined' ? acceptChallenge : function(){ alert('Belum diimplementasi'); };
  window.ignoreChallenge = typeof ignoreChallenge !== 'undefined' ? ignoreChallenge : function(){ alert('Belum diimplementasi'); };
  window.openSubmitProofModal = typeof openJoinAchievementModal !== 'undefined' ? openJoinAchievementModal : function(){ alert('Belum diimplementasi'); };
  window.saveJoinAchievement = typeof saveJoinAchievement !== 'undefined' ? saveJoinAchievement : function(){ alert('Belum diimplementasi'); };
  window.openCertificateModal = typeof openCertificateModal !== 'undefined' ? openCertificateModal : function(){ alert('Belum diimplementasi'); };

