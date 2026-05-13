const AuditLog =
require('../models/AuditLog');

const User =
require('../models/User');

const Document =
require('../models/Document');

// =====================================
// GET LOGS
// =====================================

const getLogs =
async (req, res) => {

    try {

        const logs =

        await AuditLog.find()

        .sort({

            timestamp:-1

        });

        res.json(logs);

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// GET USERS
// =====================================

const getUsers =
async (req, res) => {

    try {

        const users =

        await User.find()

        .select('-password');

        res.json(users);

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// UPDATE USER ROLE
// =====================================

const updateUserRole =
async (req, res) => {

    try {

        const {

            role

        } = req.body;

        const user =

        await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message:
                'User not found'

            });
        }

        user.role =
        role;

        await user.save();

        res.json({

            message:
            'Role updated successfully'

        });

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// DELETE USER
// =====================================

const deleteUser =
async (req, res) => {

    try {

        const user =

        await User.findById(

            req.params.id

        );

        if (!user) {

            return res.status(404).json({

                message:
                'User not found'

            });
        }

        await user.deleteOne();

        res.json({

            message:
            'User deleted successfully'

        });

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// DASHBOARD STATS
// =====================================

const getDashboardStats =
async (req, res) => {

    try {

        const totalUsers =

        await User.countDocuments();

        const totalFiles =

        await Document.countDocuments();

        const verifiedFiles =

        await Document.countDocuments({

            verified:true

        });

        const threatAlerts =

        await AuditLog.countDocuments({

            action:'VERIFY_FAILED'

        });

        res.status(200).json({

            totalUsers,

            totalFiles,

            verifiedFiles,

            threatAlerts

        });

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// EXPORTS
// =====================================

module.exports = {

    getLogs,

    getUsers,

    updateUserRole,

    deleteUser,

    getDashboardStats
};

