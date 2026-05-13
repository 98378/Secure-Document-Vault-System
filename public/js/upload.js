const uploadForm =
document.getElementById(
    'uploadForm'
);

// =====================================
// CHECK AUTH
// =====================================

const token =
localStorage.getItem(
    'token'
);

if (!token) {

    window.location.href =
    '/login.html';
}

// =====================================
// USER INFO
// =====================================

try {

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

// =====================================
// UPLOAD DOCUMENT
// =====================================

if (uploadForm) {

    uploadForm.addEventListener(

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
                    'Please select a file'
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

                    'https://localhost:3000/api/documents/upload',

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
                    'uploadResult'
                );

                if (response.ok) {

                    resultBox.innerHTML =

                    `
                    <div class="alert alert-success">

                    <h5>
                    Upload Successful 🔥
                    </h5>

                    <p>
                    File encrypted successfully
                    </p>

                    <p>
                    SHA-256 Signature Generated
                    </p>

                    </div>
                    `;

                    fileInput.value = '';

                    loadDocuments();

                }

                else {

                    resultBox.innerHTML =

                    `
                    <div class="alert alert-danger">

                    ${data.message}

                    </div>
                    `;
                }

            }

            catch (error) {

                console.log(error);

                alert(
                    'Upload failed'
                );
            }

        }

    );
}

// =====================================
// LOAD DOCUMENTS
// =====================================

const loadDocuments =
async () => {

    try {

        const response =

        await fetch(

            'https://localhost:3000/api/documents',

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const documents =
        await response.json();

        const documentsTable =

        document.getElementById(
            'documentsTable'
        );

        if (!documentsTable) {

            return;
        }

        documentsTable.innerHTML = '';

        // EMPTY STATE

        if (documents.length === 0) {

            documentsTable.innerHTML =

            `
            <tr>

            <td colspan="5"
            class="text-center text-secondary">

            No documents uploaded yet

            </td>

            </tr>
            `;

            return;
        }

        // DOCUMENTS LOOP

        documents.forEach((doc) => {

            const row =
            document.createElement('tr');

            row.innerHTML =

            `
            <td>

            ${doc.fileName}

            </td>

            <td>

            ${new Date(
                doc.uploadedAt
            ).toLocaleString()}

            </td>

            <td
            style="
            max-width:200px;
            overflow:auto;
            font-size:12px;
            ">

            ${doc.hash}

            </td>

            <td>

            <span class="badge ${doc.verified ? 'bg-success' : 'bg-warning'}">

            ${doc.verified ? 'Verified' : 'Pending'}

            </span>

            </td>

            <td>

            <button
            class="btn btn-primary btn-sm download-btn">

            Download

            </button>

            <button
            class="btn btn-danger btn-sm ms-2 delete-btn">

            Delete

            </button>

            </td>
            `;

            // DOWNLOAD EVENT

            row.querySelector(
                '.download-btn'
            ).addEventListener(

                'click',

                () => {

                    downloadDocument(
                        doc._id
                    );
                }
            );

            // DELETE EVENT

            row.querySelector(
                '.delete-btn'
            ).addEventListener(

                'click',

                () => {

                    deleteDocument(
                        doc._id
                    );
                }
            );

            documentsTable.appendChild(
                row
            );
        });

    }

    catch (error) {

        console.log(error);
    }
};

// =====================================
// DOWNLOAD DOCUMENT
// =====================================

const downloadDocument =
async (id) => {

    try {

        const response =

        await fetch(

            `https://localhost:3000/api/documents/download/${id}`,

            {

                method:'GET',

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        if (!response.ok) {

            alert('Download failed');

            return;
        }

        const blob =
        await response.blob();

        const url =
        window.URL.createObjectURL(blob);

        const a =
        document.createElement('a');

        a.href = url;

        a.download = 'document';

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    }

    catch (error) {

        console.log(error);

        alert('Download failed');
    }
};

// =====================================
// DELETE DOCUMENT
// =====================================

const deleteDocument =
async (id) => {

    const confirmDelete =

    confirm(
        'Are you sure you want to delete this document?'
    );

    if (!confirmDelete) {

        return;
    }

    try {

        const response =

        await fetch(

            `https://localhost:3000/api/documents/${id}`,

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

        if (response.ok) {

            alert(
                'Document deleted successfully'
            );

            loadDocuments();

        }

        else {

            alert(
                data.message
            );
        }

    }

    catch (error) {

        console.log(error);

        alert(
            'Delete failed'
        );
    }
};

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

// =====================================
// INITIAL LOAD
// =====================================

loadDocuments();
