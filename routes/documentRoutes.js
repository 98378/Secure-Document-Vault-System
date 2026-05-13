const express =
require('express');

const router =
express.Router();

// =====================================
// MIDDLEWARES
// =====================================

const protect =
require('../middleware/authMiddleware');

const authorizeRoles =
require('../middleware/roleMiddleware');

const upload =
require('../middleware/uploadMiddleware');

// =====================================
// CONTROLLERS
// =====================================

const {

    uploadDocument,

    getDocuments,

    verifyDocument,

    downloadDocument,

    deleteDocument

} = require(
    '../controllers/documentController'
);

// =====================================
// UPLOAD DOCUMENT
// USER / MANAGER / ADMIN
// =====================================

router.post(

    '/upload',

    protect,

    authorizeRoles(

        'user',

        'manager',

        'admin'

    ),

    upload.single('document'),

    uploadDocument

);

// =====================================
// GET DOCUMENTS
// ALL AUTHENTICATED USERS
// =====================================

router.get(

    '/',

    protect,

    authorizeRoles(

        'user',

        'manager',

        'admin'

    ),

    getDocuments

);

// =====================================
// VERIFY DOCUMENT
// MANAGER / ADMIN ONLY
// =====================================

router.post(

    '/verify',

    protect,

    authorizeRoles(

        'manager',

        'admin'

    ),

    upload.single('document'),

    verifyDocument

);

// =====================================
// DOWNLOAD DOCUMENT
// USER / MANAGER / ADMIN
// =====================================

router.get(

    '/download/:id',

    protect,

    authorizeRoles(

        'user',

        'manager',

        'admin'

    ),

    downloadDocument

);

// =====================================
// DELETE DOCUMENT
// USER / MANAGER / ADMIN
// =====================================

router.delete(

    '/:id',

    protect,

    authorizeRoles(

        'user',

        'manager',

        'admin'

    ),

    deleteDocument

);

module.exports =
router;