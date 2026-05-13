// =====================================
// ADMIN TOKEN
// =====================================

const token =
localStorage.getItem(
    'token'
);

// =====================================
// LOAD DASHBOARD STATS
// =====================================

const loadStats =
async () => {

    try {

        const response =
        await fetch(

            'https://localhost:3000/api/admin/stats',

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        // =====================================
        // UPDATE STATS
        // =====================================

        document.getElementById(
            'totalUsers'
        ).innerHTML =

        data.totalUsers;

        document.getElementById(
            'protectedFiles'
        ).innerHTML =

        data.totalFiles;

        document.getElementById(
            'threatAlerts'
        ).innerHTML =

        data.threatAlerts;

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// LOAD USERS
// =====================================

const loadUsers =
async () => {

    try {

        const response =
        await fetch(

            'https://localhost:3000/api/admin/users',

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const users =
        await response.json();

        const usersTable =
        document.getElementById(
            'usersTable'
        );

        usersTable.innerHTML = '';

        users.forEach((user) => {

            const row =
            document.createElement('tr');

            row.innerHTML =

            `
            <td>
            ${user.username}
            </td>

            <td>
            ${user.email}
            </td>

            <td>

            <span class="badge bg-info">

            ${user.role}

            </span>

            </td>

            <td>

            <span class="badge bg-success">

            Active

            </span>

            </td>

            <td>

            <button
            class="btn btn-sm btn-warning manage-btn">

            Manage

            </button>

            </td>
            `;

            // =====================================
            // MANAGE BUTTON
            // =====================================

            row.querySelector(
                '.manage-btn'
            ).addEventListener(

                'click',

                () => {

                    const action = prompt(

`Choose Action:

1 = Make Admin
2 = Make Manager
3 = Make User
4 = Delete User`
                    );

                    // MAKE ADMIN

                    if (action === '1') {

                        updateRole(
                            user._id,
                            'admin'
                        );
                    }

                    // MAKE MANAGER

                    else if (action === '2') {

                        updateRole(
                            user._id,
                            'manager'
                        );
                    }

                    // MAKE USER

                    else if (action === '3') {

                        updateRole(
                            user._id,
                            'user'
                        );
                    }

                    // DELETE USER

                    else if (action === '4') {

                        deleteUser(
                            user._id
                        );
                    }
                }
            );

            usersTable.appendChild(
                row
            );
        });

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// UPDATE ROLE
// =====================================

const updateRole =
async (id, role) => {

    try {

        const response =

        await fetch(

            `https://localhost:3000/api/admin/users/${id}/role`,

            {

                method:'PUT',

                headers:{

                    'Content-Type':
                    'application/json',

                    Authorization:
                    `Bearer ${token}`

                },

                body:JSON.stringify({

                    role

                })

            }

        );

        const data =
        await response.json();

        alert(
            data.message
        );

        loadUsers();

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// DELETE USER
// =====================================

const deleteUser =
async (id) => {

    const confirmDelete =

    confirm(
        'Delete this user?'
    );

    if (!confirmDelete) {

        return;
    }

    try {

        const response =

        await fetch(

            `https://localhost:3000/api/admin/users/${id}`,

            {

                method:'DELETE',

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        alert(
            data.message
        );

        loadUsers();

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// LOAD LOGS
// =====================================

const loadLogs =
async () => {

    try {

        const response =
        await fetch(

            'https://localhost:3000/api/admin/logs',

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const logs =
        await response.json();

        const logsTable =
        document.getElementById(
            'logsTable'
        );

        logsTable.innerHTML = '';

        logs.forEach((log) => {

            let badge = '';

            // =====================================
            // ACTION COLORS
            // =====================================

            if (
                log.action === 'UPLOAD'
            ) {

                badge =
                `
                <span class="badge bg-primary">

                UPLOAD

                </span>
                `;
            }

            else if (
                log.action === 'LOGIN'
            ) {

                badge =
                `
                <span class="badge bg-success">

                LOGIN

                </span>
                `;
            }

            else if (
                log.action === 'REGISTER'
            ) {

                badge =
                `
                <span class="badge bg-warning text-dark">

                REGISTER

                </span>
                `;
            }

            else if (
                log.action === 'VERIFY_SUCCESS'
            ) {

                badge =
                `
                <span class="badge bg-info">

                VERIFIED

                </span>
                `;
            }

            else if (
                log.action === 'VERIFY_FAILED'
            ) {

                badge =
                `
                <span class="badge bg-danger">

                TAMPER DETECTED

                </span>
                `;
            }

            else {

                badge =
                `
                <span class="badge bg-secondary">

                ${log.action}

                </span>
                `;
            }

            logsTable.innerHTML +=

            `
            <tr>

            <td>
            ${log.user}
            </td>

            <td>
            ${badge}
            </td>

            <td>
            ${log.details}
            </td>

            <td>
            ${new Date(
                log.timestamp
            ).toLocaleString()}
            </td>

            </tr>
            `;
        });

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// INITIAL LOAD
// =====================================

loadStats();

loadUsers();

loadLogs();

// =====================================
// AUTO REFRESH
// =====================================

setInterval(() => {

    loadStats();

    loadUsers();

    loadLogs();

}, 5000);

