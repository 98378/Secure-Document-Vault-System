const API_URL =
'https://localhost:3000/api/auth';

// ==========================
// TOAST NOTIFICATION
// ==========================

const showToast = (

    message,

    type = 'success'

) => {

    const toast =
    document.createElement('div');

    toast.className =
    `custom-toast ${type}`;

    toast.innerText =
    message;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);
};

// ==========================
// PASSWORD STRENGTH
// ==========================

const passwordInput =
document.getElementById(
    'password'
);

if (passwordInput) {

    const strengthText =
    document.getElementById(
        'passwordStrength'
    );

    const strengthBar =
    document.getElementById(
        'strengthBar'
    );

    if (
        strengthBar &&
        strengthText
    ) {

        strengthBar.style.display =
        'none';

        strengthText.innerHTML =
        '';

        passwordInput.addEventListener(

            'input',

            () => {

                const password =
                passwordInput.value;

                if (
                    password.length > 0
                ) {

                    strengthBar.style.display =
                    'block';

                }

                else {

                    strengthBar.style.display =
                    'none';

                    strengthText.innerHTML =
                    '';

                    return;
                }

                const strongPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

                if (
                    password.length < 6
                ) {

                    strengthText.innerHTML =
                    'Weak Password';

                    strengthText.style.color =
                    '#FF4D6D';

                    strengthBar.style.width =
                    '30%';

                    strengthBar.style.background =
                    '#FF4D6D';
                }

                else if (
                    strongPassword.test(
                        password
                    )
                ) {

                    strengthText.innerHTML =
                    'Strong Password 🔥';

                    strengthText.style.color =
                    '#00FFB2';

                    strengthBar.style.width =
                    '100%';

                    strengthBar.style.background =
                    '#00FFB2';
                }

                else {

                    strengthText.innerHTML =
                    'Medium Password';

                    strengthText.style.color =
                    '#FFD166';

                    strengthBar.style.width =
                    '60%';

                    strengthBar.style.background =
                    '#FFD166';
                }

            }

        );
    }
}

// ==========================
// SHOW / HIDE PASSWORD
// ==========================

const togglePassword =
document.getElementById(
    'togglePassword'
);

if (
    togglePassword &&
    passwordInput
) {

    togglePassword.addEventListener(

        'click',

        () => {

            const type =

            passwordInput.getAttribute(
                'type'
            ) === 'password'

            ? 'text'

            : 'password';

            passwordInput.setAttribute(
                'type',
                type
            );

            togglePassword.innerHTML =

            type === 'password'

            ? '<i class="fa-solid fa-eye"></i>'

            : '<i class="fa-solid fa-eye-slash"></i>';

        }

    );
}

// ==========================
// SAVE USER DATA
// ==========================

const saveUserData =
(data, username, email) => {

    localStorage.setItem(

        'token',

        data.token

    );

    localStorage.setItem(

        'role',

        data.role

    );

    localStorage.setItem(

        'user',

        JSON.stringify({

            username:
            data.username || username,

            email:
            data.email || email,

            role:
            data.role

        })

    );
};

// ==========================
// ROLE REDIRECT
// ==========================

const redirectByRole =
(role) => {

    if (role === 'admin') {

        window.location.href =
        '/admin.html';
    }

    else if (role === 'manager') {

        window.location.href =
        '/verify.html';
    }

    else {

        window.location.href =
        '/upload.html';
    }
};

// ==========================
// REGISTER
// ==========================

const registerForm =
document.getElementById(
    'registerForm'
);

if (registerForm) {

    registerForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const username =
            document.getElementById(
                'username'
            ).value;

            const email =
            document.getElementById(
                'email'
            ).value;

            const password =
            document.getElementById(
                'password'
            ).value;

            const role =
            document.getElementById(
                'role'
            ).value;

            try {

                // ==========================
                // REGISTER USER
                // ==========================

                const response =
                await fetch(

                    `${API_URL}/register`,

                    {

                        method:'POST',

                        headers:{

                            'Content-Type':
                            'application/json'

                        },

                        body:JSON.stringify({

                            username,

                            email,

                            password,

                            role

                        })

                    }

                );

                const data =
                await response.json();

                if (response.ok) {

                    saveUserData(
                        data,
                        username,
                        email
                    );

                    // ==========================
                    // SAVE USER ID
                    // ==========================
localStorage.setItem(

    'tempUserId',

    data.userId

);
                    showToast(
                        'Registration Successful 🔥'
                    );

                    // ==========================
                    // SHOW 2FA SETUP
                    // ==========================

                    const setupResponse =
                    await fetch(

                        `${API_URL}/2fa/setup`,

                        {

                            headers:{

                                Authorization:
                                `Bearer ${data.token}`

                            }

                        }

                    );

                    const setupData =
                    await setupResponse.json();

                    document.getElementById(
                        'registerForm'
                    ).style.display =
                    'none';

                    document.getElementById(
                        'twoFactorSetup'
                    ).style.display =
                    'block';

                    document.getElementById(
                        'qrCode'
                    ).src =
                    setupData.qrCode;
                }

                else {

                    showToast(

                        data.message,

                        'error'

                    );
                }

            }

            catch (error) {

                console.log(error);

                showToast(

                    'Server Error',

                    'error'

                );
            }

        }

    );
}

// ==========================
// VERIFY 2FA SETUP
// ==========================

const verify2FABtn =
document.getElementById(
    'verify2FABtn'
);

if (verify2FABtn) {

    verify2FABtn.addEventListener(

        'click',

        async () => {

            const otp =
            document.getElementById(
                'otpInput'
            ).value;

            try {

                const response =
                await fetch(

                    `${API_URL}/2fa/verify`,

                    {

                        method:'POST',

                        headers:{

                            'Content-Type':
                            'application/json'

                        },

                        body:JSON.stringify({

                            token:otp,

                            userId:
                            JSON.parse(
                                localStorage.getItem(
                                    'user'
                                )
                            )?.id ||

                            localStorage.getItem(
                                'tempUserId'
                            )

                        })

                    }

                );

                const data =
                await response.json();

                if (response.ok) {

                    saveUserData(
                        data,
                        data.username,
                        data.email
                    );

                    localStorage.removeItem(
                        'tempUserId'
                    );

                    showToast(
                        '2FA Enabled Successfully 🔥'
                    );

                    setTimeout(() => {

                        redirectByRole(
                            data.role
                        );

                    }, 1500);
                }

                else {

                    showToast(

                        data.message,

                        'error'

                    );
                }

            }

            catch (error) {

                console.log(error);
            }

        }

    );
}

// ==========================
// LOGIN
// ==========================

const loginForm =
document.getElementById(
    'loginForm'
);

if (loginForm) {

    loginForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const email =
            document.getElementById(
                'email'
            ).value;

            const password =
            document.getElementById(
                'password'
            ).value;

            try {

                const response =
                await fetch(

                    `${API_URL}/login`,

                    {

                        method:'POST',

                        headers:{

                            'Content-Type':
                            'application/json'

                        },

                        body:JSON.stringify({

                            email,

                            password

                        })

                    }

                );

                const data =
                await response.json();

                // ==========================
                // NEEDS 2FA
                // ==========================

                if (data.requires2FA) {

                    localStorage.setItem(

                        'tempUserId',

                         data.userId

                        );
                    document.getElementById(
                        'loginForm'
                    ).style.display =
                    'none';

                    document.getElementById(
                        'twoFactorForm'
                    ).style.display =
                    'block';

                    showToast(
                        'Enter Google Authenticator code'
                    );

                    return;
                }

                // ==========================
                // NORMAL LOGIN
                // ==========================

                if (response.ok) {

                    saveUserData(
                        data,
                        data.username,
                        data.email
                    );

                    showToast(
                        'Login Successful ✅'
                    );

                    setTimeout(() => {

                        redirectByRole(
                            data.role
                        );

                    }, 1500);
                }

                else {

                    showToast(

                        data.message ||

                        'Invalid email or password',

                        'error'

                    );
                }

            }

            catch (error) {

                console.log(error);

                showToast(

                    'Invalid email or password',

                    'error'

                );
            }

        }

    );
}

// ==========================
// LOGIN OTP VERIFY
// ==========================

const twoFactorForm =
document.getElementById(
    'twoFactorForm'
);

if (twoFactorForm) {

    twoFactorForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const otp =
            document.getElementById(
                'otpCode'
            ).value;

            try {

                const response =
                await fetch(

                    `${API_URL}/2fa/verify`,

                    {

                        method:'POST',

                        headers:{

                            'Content-Type':
                            'application/json'

                        },

                        body:JSON.stringify({

                            token:otp,

                            userId:
                            localStorage.getItem(
                                'tempUserId'
                            )

                        })

                    }

                );

                const data =
                await response.json();

                if (response.ok) {

                    saveUserData(
                        data,
                        data.username,
                        data.email
                    );

                    localStorage.removeItem(
                        'tempUserId'
                    );

                    showToast(
                        '2FA Verification Successful 🔥'
                    );

                    setTimeout(() => {

                        redirectByRole(
                            data.role
                        );

                    }, 1500);
                }

                else {

                    showToast(

                        data.message,

                        'error'

                    );
                }

            }

            catch (error) {

                console.log(error);
            }

        }

    );
}

// ==========================
// LOGOUT
// ==========================

const logout =
() => {

    localStorage.clear();

    window.location.href =
    '/login.html';
};

// ==========================
// GLOBAL LOGOUT
// ==========================

window.logout =
logout;