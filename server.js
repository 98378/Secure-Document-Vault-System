const express =
require('express');

const dotenv =
require('dotenv');

const helmet =
require('helmet');

const cors =
require('cors');

const cookieParser =
require('cookie-parser');

const rateLimit =
require('express-rate-limit');

const session =
require('express-session');

const passport =
require('passport');

const multer =
require('multer');

const fs =
require('fs');

const https =
require('https');

const http =
require('http');

const path =
require('path');

// =====================================
// LOAD ENV
// =====================================

dotenv.config();

console.log(
'Google ID:',
process.env.GOOGLE_CLIENT_ID
);

console.log(
'Google Secret:',
process.env.GOOGLE_CLIENT_SECRET
);

// =====================================
// PASSPORT CONFIG
// =====================================

require('./config/passport');

// =====================================
// DATABASE
// =====================================

const connectDB =
require('./config/db');

connectDB();

// =====================================
// EXPRESS APP
// =====================================

const app =
express();

// =====================================
// SSL CERTIFICATES
// =====================================

const sslOptions = {

    key:fs.readFileSync(

        path.join(
            __dirname,
            'ssl',
            'server.key'
        )

    ),

    cert:fs.readFileSync(

        path.join(
            __dirname,
            'ssl',
            'server.cert'
        )

    )

};

// =====================================
// BODY PARSER
// =====================================

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended:true
    })
);

// =====================================
// SECURITY MIDDLEWARE
// =====================================

app.use(cors());

app.use(cookieParser());

app.use(helmet());

// =====================================
// FORCE HTTPS
// =====================================

app.use(

    (req, res, next) => {

        if (

            req.headers['x-forwarded-proto']

            !== 'https'

            &&

            req.hostname !== 'localhost'

        ) {

            return res.redirect(

                `https://${req.headers.host}${req.url}`

            );
        }

        next();
    }

);

// =====================================
// SESSION
// =====================================

app.use(

    session({

        secret:
        'securevaultsecret',

        resave:false,

        saveUninitialized:false,

        cookie:{

            secure:true,

            httpOnly:true,

            sameSite:'strict'

        }

    })

);

// =====================================
// PASSPORT
// =====================================

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

// =====================================
// RATE LIMITER
// =====================================

const limiter =
rateLimit({

    windowMs:
    15 * 60 * 1000,

    max:100,

    message:
    'Too many requests from this IP'

});

app.use(limiter);

// =====================================
// STATIC FOLDERS
// =====================================

app.use(
    express.static('public')
);

app.use(
    express.static('views')
);

app.use(

    '/uploads',

    express.static('uploads')

);

app.use(

    '/encrypted',

    express.static('encrypted')

);

// =====================================
// ROUTES
// =====================================

app.use(

    '/api/auth',

    require('./routes/authRoutes')

);

app.use(

    '/api/documents',

    require('./routes/documentRoutes')

);

app.use(

    '/api/admin',

    require('./routes/adminRoutes')

);

// =====================================
// HOME ROUTE
// =====================================

app.get(

    '/',

    (req, res) => {

        res.sendFile(

            __dirname +
            '/views/dashboard.html'

        );
    }

);

// =====================================
// MULTER ERROR HANDLER
// =====================================

app.use(

    (error, req, res, next) => {

        // FILE SIZE ERROR

        if (

            error instanceof multer.MulterError &&

            error.code === 'LIMIT_FILE_SIZE'

        ) {

            return res.status(400).json({

                message:
                'File size must not exceed 5MB'

            });
        }

        // INVALID FILE TYPE

        if (

            error.message ===

            'Only PDF, PNG, JPG, JPEG and TXT files are allowed'

        ) {

            return res.status(400).json({

                message:
                error.message

            });
        }

        next(error);
    }

);

// =====================================
// PORTS
// =====================================

const HTTPS_PORT =
3000;

const HTTP_PORT =
8080;

// =====================================
// HTTPS SERVER
// =====================================

https.createServer(

    sslOptions,

    app

).listen(

    HTTPS_PORT,

    () => {

        console.log(

            `HTTPS Server running on https://localhost:${HTTPS_PORT}`

        );
    }

);

// =====================================
// HTTP REDIRECT SERVER
// =====================================

http.createServer(

    (req, res) => {

        res.writeHead(

            301,

            {

                Location:
                `https://localhost:${HTTPS_PORT}${req.url}`

            }

        );

        res.end();
    }

).listen(

    HTTP_PORT,

    () => {

        console.log(

            `HTTP Redirect running on http://localhost:${HTTP_PORT}`

        );
    }

);