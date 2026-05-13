const AuditLog =
require('../models/AuditLog');

const logEvent =
async (

    user,

    action,

    details

) => {

    try {

        await AuditLog.create({

            user,

            action,

            details

        });

    } catch (error) {

        console.log(error);
    }
};

module.exports =
logEvent;