const express =
require('express');

const router =
express.Router();

const passport =
require('passport');

// =====================================
// CONTROLLERS
// =====================================

const {

    register,

    login,

    setup2FA,

    verify2FA

} = require(
    '../controllers/authController'
);

// =====================================
// MIDDLEWARE
// =====================================

const protect =
require('../middleware/authMiddleware');

// =====================================
// NORMAL AUTH
// =====================================

router.post(

    '/register',

    register

);

router.post(

    '/login',

    login

);

// =====================================
// GOOGLE LOGIN
// =====================================

router.get(

    '/google',

    passport.authenticate(

        'google',

        {

            scope:[

                'profile',

                'email'

            ]

        }

    )

);

// =====================================
// GOOGLE CALLBACK
// =====================================

router.get(

    '/google/callback',

    passport.authenticate(

        'google',

        {

            failureRedirect:
            '/login.html'

        }

    ),

    (req, res) => {

        res.redirect(
            '/upload.html'
        );
    }

);

// =====================================
// SETUP 2FA
// =====================================

router.get(

    '/2fa/setup',

    protect,

    setup2FA

);

// =====================================
// VERIFY 2FA
// =====================================

router.post(

    '/2fa/verify',

    verify2FA

);

module.exports =
router;