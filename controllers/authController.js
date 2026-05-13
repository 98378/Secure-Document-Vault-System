const logEvent =
require('../utils/logger');

const User =
require('../models/User');

const bcrypt =
require('bcrypt');

const speakeasy =
require('speakeasy');

const QRCode =
require('qrcode');

const generateToken =
require('../utils/generateToken');

// =========================
// REGISTER
// =========================

const register = async (req, res) => {

    try {

        const {

            username,

            email,

            password,

            role

        } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (

            !username ||

            !email ||

            !password ||

            !role

        ) {

            return res.status(400).json({

                message:
                'All fields are required'

            });
        }

        // =========================
        // PASSWORD POLICY
        // =========================

        const strongPassword =

        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (

            !strongPassword.test(
                password
            )

        ) {

            return res.status(400).json({

                message:
                'Password must contain uppercase, lowercase, number, special character and be at least 8 characters'

            });
        }

        // =========================
        // CHECK USER
        // =========================

        const userExists =

        await User.findOne({

            email

        });

        if (userExists) {

            return res.status(400).json({

                message:
                'User already exists'

            });
        }

        // =========================
        // HASH PASSWORD
        // =========================

        const salt =

        await bcrypt.genSalt(10);

        const hashedPassword =

        await bcrypt.hash(

            password,

            salt

        );

        // =========================
        // CREATE USER
        // =========================

        const user =

        await User.create({

            username,

            email,

            password:
            hashedPassword,

            role

        });

        // =========================
        // LOG EVENT
        // =========================

        await logEvent(

            email,

            'REGISTER',

            'New user registered'

        );

        // =========================
        // RESPONSE
        // =========================
res.status(201).json({

    message:
    'User registered successfully',

    token:
    generateToken(user),

    userId:
    user._id,

    role:
    user.role,

    username:
    user.username,

    email:
    user.email

});

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =========================
// LOGIN
// =========================

const login = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (

            !email ||

            !password

        ) {

            return res.status(400).json({

                message:
                'Please enter email and password'

            });
        }

        // =========================
        // FIND USER
        // =========================

        const user =

        await User.findOne({

            email

        });

        if (!user) {

            return res.status(401).json({

                message:
                'Invalid email or password'

            });
        }

        // =========================
        // COMPARE PASSWORD
        // =========================

        const isMatch =

        await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message:
                'Invalid email or password'

            });
        }

        // =========================
        // CHECK 2FA
        // =========================

        if (user.is2FAEnabled) {

            return res.status(200).json({

                requires2FA:true,

                userId:user._id,

                message:
                'Enter Google Authenticator code'

            });
        }

        // =========================
        // LOG EVENT
        // =========================

        await logEvent(

            email,

            'LOGIN',

            'User logged in'

        );

        // =========================
        // LOGIN SUCCESS
        // =========================

        res.status(200).json({

            message:
            'Login successful',

            token:
            generateToken(user),

            role:
            user.role,

            username:
            user.username,

            email:
            user.email

        });

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =========================
// SETUP 2FA
// =========================

const setup2FA =
async (req, res) => {

    try {

        const user =

        await User.findById(
            req.user.id
        );

        const secret =
        speakeasy.generateSecret({

            name:
            `SecureVaultX (${user.email})`

        });

        user.twoFactorSecret =
        secret.base32;

        await user.save();

        // =========================
        // QR CODE
        // =========================

        QRCode.toDataURL(

            secret.otpauth_url,

            (err, dataURL) => {

                if (err) {

                    return res.status(500).json({

                        message:
                        'QR generation failed'

                    });
                }

                res.json({

                    qrCode:dataURL,

                    secret:
                    secret.base32

                });
            }

        );

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =========================
// VERIFY 2FA
// =========================

const verify2FA =
async (req, res) => {

    try {

        const {

            token,

            userId

        } = req.body;

        // =========================
        // FIND USER
        // =========================

        const user =

        await User.findById(
            userId
        );

        if (!user) {

            return res.status(404).json({

                message:
                'User not found'

            });
        }

        // =========================
        // VERIFY OTP
        // =========================

        const verified =
        speakeasy.totp.verify({

            secret:
            user.twoFactorSecret,

            encoding:'base32',

            token

        });

        if (!verified) {

            return res.status(400).json({

                message:
                'Invalid authentication code'

            });
        }

        // =========================
        // ENABLE 2FA
        // =========================

        if (!user.is2FAEnabled) {

            user.is2FAEnabled =
            true;

            await user.save();

            await logEvent(

                user.email,

                '2FA_ENABLED',

                'Google Authenticator enabled'

            );
        }

        // =========================
        // LOGIN EVENT
        // =========================

        await logEvent(

            user.email,

            'LOGIN',

            'User logged in with 2FA'

        );

        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({

            message:
            '2FA verification successful',

            token:
            generateToken(user),

            role:
            user.role,

            username:
            user.username,

            email:
            user.email

        });

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =========================
// EXPORTS
// =========================

module.exports = {

    register,

    login,

    setup2FA,

    verify2FA

};