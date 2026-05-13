document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // SECURITY STATUS ANIMATION
    // =========================

    const securityStatuses =
    document.querySelectorAll(
        '.status-safe'
    );

    securityStatuses.forEach((status) => {

        status.style.opacity = '0';

        setTimeout(() => {

            status.style.transition =
            '0.5s';

            status.style.opacity = '1';

        }, 500);

    });

    // =========================
    // LIVE CLOCK
    // =========================

    const clockElement =
    document.getElementById(
        'liveClock'
    );

    if (clockElement) {

        setInterval(() => {

            const now =
            new Date();

            clockElement.innerHTML =

            now.toLocaleTimeString();

        }, 1000);
    }

    // =========================
    // THREAT ALERT SYSTEM
    // =========================

    const threatLevel =
    document.getElementById(
        'threatLevel'
    );

    if (threatLevel) {

        const levels = [

            'LOW',

            'MEDIUM',

            'HIGH'

        ];

        let current = 0;

        setInterval(() => {

            threatLevel.innerText =
            levels[current];

            if (
                levels[current] === 'LOW'
            ) {

                threatLevel.style.color =
                '#00FFB2';

            }

            else if (
                levels[current] === 'MEDIUM'
            ) {

                threatLevel.style.color =
                '#FFD166';

            }

            else {

                threatLevel.style.color =
                '#FF4D6D';
            }

            current++;

            if (
                current >= levels.length
            ) {

                current = 0;
            }

        }, 5000);
    }

    // =========================
    // RECENT ACTIVITY FEED
    // =========================

    const activityFeed =
    document.getElementById(
        'activityFeed'
    );

    if (activityFeed) {

        const activities = [

            'New encrypted file uploaded',

            'Integrity verification completed',

            'Suspicious login blocked',

            'Admin updated permissions',

            'HTTPS certificate verified'

        ];

        let index = 0;

        setInterval(() => {

            const item =
            document.createElement(
                'li'
            );

            item.className =

            'list-group-item bg-dark text-light border-secondary';

            item.innerText =
            activities[index];

            activityFeed.prepend(
                item
            );

            if (
                activityFeed.children.length > 5
            ) {

                activityFeed.removeChild(

                    activityFeed.lastChild

                );
            }

            index++;

            if (
                index >= activities.length
            ) {

                index = 0;
            }

        }, 4000);
    }

    // =========================
    // CYBER GLOW EFFECT
    // =========================

    const glowCards =
    document.querySelectorAll(
        '.cyber-card'
    );

    glowCards.forEach((card) => {

        card.addEventListener(

            'mousemove',

            (e) => {

                const rect =

                card.getBoundingClientRect();

                const x =
                e.clientX - rect.left;

                const y =
                e.clientY - rect.top;

                card.style.background =

                `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(0,194,255,0.15),
                    #111827
                )
                `;
            }
        );

        card.addEventListener(

            'mouseleave',

            () => {

                card.style.background =
                '#111827';
            }
        );
    });

    // =========================
    // SECURITY NOTIFICATIONS
    // =========================

    const notifications = [

        'Firewall Successfully Enabled',

        'AES-256 Encryption Active',

        'JWT Authentication Verified',

        'No Malware Detected',

        'Secure Connection Established'

    ];

    const notificationBox =
    document.getElementById(
        'securityNotification'
    );

    if (notificationBox) {

        let currentNotification = 0;

        setInterval(() => {

            notificationBox.innerHTML =

            `
            <i class="fa-solid fa-shield-check"></i>
            ${notifications[currentNotification]}
            `;

            currentNotification++;

            if (

                currentNotification >=
                notifications.length

            ) {

                currentNotification = 0;
            }

        }, 3500);
    }

});

// =====================================
// LOGOUT
// =====================================

const logoutBtn =
document.getElementById(
    'logoutBtn'
);

if (logoutBtn) {

    logoutBtn.addEventListener(

        'click',

        () => {

            localStorage.removeItem(
                'token'
            );

            localStorage.removeItem(
                'role'
            );

            window.location.href =
            '/login.html';
        }
    );
}

// =====================================
// LOGGED USER INFO
// =====================================

const token =
localStorage.getItem(
    'token'
);

if (token) {

    const payload =
    JSON.parse(

        atob(

            token.split('.')[1]

        )

    );

    const userName =
    document.getElementById(
        'loggedUserName'
    );

    const userEmail =
    document.getElementById(
        'loggedUserEmail'
    );

    const userRole =
    document.getElementById(
        'loggedUserRole'
    );

    if (userName) {

        userName.innerHTML =
        payload.username;
    }

    if (userEmail) {

        userEmail.innerHTML =
        payload.email;
    }

    if (userRole) {

        userRole.innerHTML =
        payload.role.toUpperCase();
    }
}

// =====================================
// REAL DASHBOARD STATS
// =====================================

const loadDashboardStats =
async () => {

    try {

        const response =
        await fetch(

            'https://localhost:3000/api/admin/stats',

            {

                headers:{

                    Authorization:
                    `Bearer ${localStorage.getItem('token')}`

                }

            }

        );

        const data =
        await response.json();

        document.getElementById(
            'encryptedFiles'
        ).innerHTML =

        data.totalFiles;

        document.getElementById(
            'verifiedDocs'
        ).innerHTML =

        data.verifiedFiles;

        document.getElementById(
            'activeUsers'
        ).innerHTML =

        data.totalUsers;

        document.getElementById(
            'threatAlerts'
        ).innerHTML =

        data.threatAlerts;

    }

    catch (error) {

        console.log(error);
    }
};

loadDashboardStats();