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

// =====================================
// CONTROLLERS
// =====================================

const {

    getLogs,

    getUsers,

    updateUserRole,

    deleteUser,

    getDashboardStats

} = require(
    '../controllers/adminController'
);

// =====================================
// SECURITY LOGS
// ADMIN + MANAGER
// =====================================

router.get(

    '/logs',

    protect,

    authorizeRoles(

        'admin',

        'manager'

    ),

    getLogs

);

// =====================================
// GET USERS
// ADMIN ONLY
// =====================================

router.get(

    '/users',

    protect,

    authorizeRoles(
        'admin'
    ),

    getUsers

);

// =====================================
// UPDATE USER ROLE
// ADMIN ONLY
// =====================================

router.put(

    '/users/:id/role',

    protect,

    authorizeRoles(
        'admin'
    ),

    updateUserRole

);

// =====================================
// DELETE USER
// ADMIN ONLY
// =====================================

router.delete(

    '/users/:id',

    protect,

    authorizeRoles(
        'admin'
    ),

    deleteUser

);

// =====================================
// DASHBOARD STATS
// ADMIN ONLY
// =====================================

router.get(

    '/stats',

    protect,

    authorizeRoles(
        'admin'
    ),

    getDashboardStats

);

module.exports =
router;

