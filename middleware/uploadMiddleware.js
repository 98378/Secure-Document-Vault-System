const multer =
require('multer');

const path =
require('path');

// =====================================
// STORAGE
// =====================================

const storage =
multer.diskStorage({

    destination:
    (req, file, cb) => {

        cb(

            null,

            'uploads/'

        );
    },

    filename:
    (req, file, cb) => {

        cb(

            null,

            Date.now() +

            path.extname(

                file.originalname

            )

        );
    }
});

// =====================================
// FILE FILTER
// =====================================

const fileFilter =
(req, file, cb) => {

    const allowedExtensions = [

        '.pdf',

        '.png',

        '.jpg',

        '.jpeg',

        '.txt'

    ];

    const ext =

    path.extname(

        file.originalname

    ).toLowerCase();

    if (

        allowedExtensions.includes(ext)

    ) {

        cb(

            null,

            true

        );

    }

    else {

        cb(

            new Error(

                'Only PDF, PNG, JPG, JPEG and TXT files are allowed'

            ),

            false

        );
    }
};

// =====================================
// MULTER CONFIG
// =====================================

const upload =
multer({

    storage,

    fileFilter,

    limits:{

        fileSize:
        5 * 1024 * 1024
    }

});

// =====================================
// EXPORT
// =====================================

module.exports =
upload;