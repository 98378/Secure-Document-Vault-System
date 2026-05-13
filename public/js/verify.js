const token =
localStorage.getItem(
    'token'
);

// =====================================
// USER INFO
// =====================================

try {

    if (token) {

        const payload =
        JSON.parse(

            atob(

                token.split('.')[1]

            )

        );

        document.getElementById(
            'loggedUserName'
        ).innerHTML =
        payload.username;

        document.getElementById(
            'loggedUserEmail'
        ).innerHTML =
        payload.email;

        document.getElementById(
            'loggedUserRole'
        ).innerHTML =
        payload.role.toUpperCase();
    }

    // LIVE CLOCK

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

}

catch (error) {

    console.log(error);
}

const verifyForm =
document.getElementById(
    'verifyForm'
);

// =====================================
// VERIFY DOCUMENT
// =====================================

if (verifyForm) {

    verifyForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const fileInput =

            document.getElementById(
                'document'
            );

            const file =
            fileInput.files[0];

            if (!file) {

                alert(
                    'Select a file'
                );

                return;
            }

            const formData =
            new FormData();

            formData.append(

                'document',

                file

            );

            try {

                const response =

                await fetch(

                    'https://localhost:3000/api/documents/verify',

                    {

                        method:'POST',

                        headers:{

                            Authorization:
                            `Bearer ${token}`

                        },

                        body:formData

                    }

                );

                const data =
                await response.json();

                const resultBox =

                document.getElementById(
                    'verificationResult'
                );

                // VERIFIED

                if (data.verified === true) {

                    resultBox.innerHTML =

                    `
                    <div class="alert alert-success">

                    <h3>
                    Integrity Verified ✅
                    </h3>

                    <hr>

                    <p>
                    File has NOT been modified
                    </p>

                    <p>
                    <strong>Original Hash:</strong>

                    <br>

                    ${data.originalHash}

                    </p>

                    <p>
                    <strong>Current Hash:</strong>

                    <br>

                    ${data.currentHash}

                    </p>

                    </div>
                    `;
                }

                // FAILED

                else {

                    resultBox.innerHTML =

                    `
                    <div class="alert alert-danger">

                    <h3>
                    Integrity Failed ❌
                    </h3>

                    <hr>

                    <p>
                    WARNING:
                    File was modified
                    </p>

                    <p>
                    <strong>Original Hash:</strong>

                    <br>

                    ${data.originalHash}

                    </p>

                    <p>
                    <strong>Current Hash:</strong>

                    <br>

                    ${data.currentHash}

                    </p>

                    </div>
                    `;
                }

                // REFRESH LOGS

                loadVerificationLogs();

            }

            catch (error) {

                console.log(error);
            }

        }

    );
}

// =====================================
// LOAD VERIFICATION LOGS
// =====================================

const loadVerificationLogs =
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
            'verificationLogs'
        );

        if (!logsTable) {

            return;
        }

        logsTable.innerHTML = '';

        // FILTER VERIFICATION LOGS

        const verificationLogs =

        logs.filter((log) =>

            log.action === 'VERIFY_SUCCESS' ||

            log.action === 'VERIFY_FAILED'
        );

        // EMPTY STATE

        if (verificationLogs.length === 0) {

            logsTable.innerHTML =

            `
            <tr>

            <td colspan="4"
            class="text-center text-secondary">

            No verification activity yet

            </td>

            </tr>
            `;

            return;
        }

        verificationLogs.forEach((log) => {

            const badge =

            log.action === 'VERIFY_SUCCESS'

            ?

            `
            <span class="badge bg-success">

            VERIFIED

            </span>
            `

            :

            `
            <span class="badge bg-danger">

            FAILED

            </span>
            `;

            logsTable.innerHTML +=

            `
            <tr>

            <td>

            ${log.details}

            </td>

            <td>

            ${badge}

            </td>

            <td>

            ${log.user}

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

loadVerificationLogs();

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

            localStorage.removeItem(
                'user'
            );

            window.location.href =
            '/login.html';
        }
    );
}

