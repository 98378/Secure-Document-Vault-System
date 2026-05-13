const logEvent =
require('../utils/logger');

const Document =
require('../models/Document');

const {

    encryptFile,

    decryptFile

} = require(
    '../utils/encryption'
);

const generateSignature =
require('../utils/signature');

const fs =
require('fs');

const path =
require('path');

// =====================================
// UPLOAD DOCUMENT
// =====================================

const uploadDocument =
async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message:
                'No file uploaded'

            });
        }

        const file =
        req.file;

        // =====================================
        // ENCRYPT FILE
        // =====================================

        const encryptedPath =
        `encrypted/${file.filename}.enc`;

        encryptFile(

            file.path,

            encryptedPath

        );

        // =====================================
        // GENERATE SHA-256 HASH
        // =====================================

        const hash =
        generateSignature(
            file.path
        );

        // =====================================
        // SAVE DOCUMENT
        // =====================================

        const document =
        await Document.create({

            fileName:
            file.originalname,

            encryptedPath,

            owner:
            req.user.id,

            hash,

            signature:
            hash,

            verified:false

        });

        // =====================================
        // LOG EVENT
        // =====================================

        await logEvent(

            req.user.id,

            'UPLOAD',

            `${file.originalname} uploaded`

        );

        res.status(201).json({

            message:
            'Document uploaded successfully',

            document

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
// GET DOCUMENTS
// =====================================

const getDocuments =
async (req, res) => {

    try {

        const docs =

        await Document.find({

            owner:req.user.id

        });

        res.json(docs);

    }

    catch (error) {

        res.status(500).json({

            message:
            error.message

        });
    }
};

// =====================================
// VERIFY DOCUMENT
// =====================================

const verifyDocument =
async (req, res) => {

    try {

        const file =
        req.file;

        if (!file) {

            return res.status(400).json({

                message:
                'No file uploaded'

            });
        }

        // =====================================
        // GENERATE CURRENT HASH
        // =====================================

        const currentHash =
        generateSignature(
            file.path
        );

        // =====================================
        // FIND ORIGINAL DOCUMENT
        // =====================================

        const originalDoc =

        await Document.findOne({

            fileName:
            file.originalname

        });

        if (!originalDoc) {

            return res.status(404).json({

                message:
                'Original document not found'

            });
        }

        // =====================================
        // VERIFY HASH
        // =====================================

        const verified =

        currentHash ===
        originalDoc.hash;

        // =====================================
        // UPDATE VERIFIED STATUS
        // =====================================

        if (verified) {

            originalDoc.verified =
            true;

            await originalDoc.save();

            // =====================================
            // SUCCESS LOG
            // =====================================

            await logEvent(

                req.user.id,

                'VERIFY_SUCCESS',

                `${file.originalname} verification success`

            );
        }

        else {

            // =====================================
            // FAILED LOG
            // =====================================

            await logEvent(

                req.user.id,

                'VERIFY_FAILED',

                `${file.originalname} verification failed`

            );
        }

        // =====================================
        // DELETE TEMP VERIFY FILE
        // =====================================

        if (
            fs.existsSync(file.path)
        ) {

            fs.unlinkSync(file.path);
        }

        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            verified,

            fileName:
            originalDoc.fileName,

            uploadedAt:
            originalDoc.uploadedAt,

            originalHash:
            originalDoc.hash,

            currentHash

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
// DOWNLOAD DOCUMENT
// =====================================

const downloadDocument =
async (req, res) => {

    try {

        const id =
        req.params.id;

        const document =

        await Document.findById(id);

        if (!document) {

            return res.status(404).json({

                message:
                'Document not found'

            });
        }

        // =====================================
        // CHECK OWNER
        // =====================================

        if (

            req.user.role !== 'admin' &&

            document.owner.toString() !==
            req.user.id

        ) {

            return res.status(403).json({

                message:
                'Access denied'

            });
        }

        // =====================================
        // CREATE DOWNLOADS FOLDER
        // =====================================

        if (
            !fs.existsSync('downloads')
        ) {

            fs.mkdirSync(
                'downloads'
            );
        }

        const decryptedPath =
        path.join(

            'downloads',

            document.fileName

        );

        // =====================================
        // DECRYPT FILE
        // =====================================

        decryptFile(

            document.encryptedPath,

            decryptedPath

        );

        // =====================================
        // DOWNLOAD FILE
        // =====================================

        res.download(

            decryptedPath,

            document.fileName,

            (err) => {

                // DELETE TEMP FILE

                if (

                    fs.existsSync(
                        decryptedPath
                    )

                ) {

                    fs.unlinkSync(
                        decryptedPath
                    );
                }
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

// =====================================
// DELETE DOCUMENT
// =====================================

const deleteDocument =
async (req, res) => {

    try {

        const document =

        await Document.findById(

            req.params.id

        );

        if (!document) {

            return res.status(404).json({

                message:
                'Document not found'

            });
        }

        // =====================================
        // CHECK OWNER
        // =====================================

        if (

            req.user.role !== 'admin' &&

            document.owner.toString() !==
            req.user.id

        ) {

            return res.status(403).json({

                message:
                'Access denied'

            });
        }

        // =====================================
        // DELETE ENCRYPTED FILE
        // =====================================

        if (

            fs.existsSync(

                document.encryptedPath

            )

        ) {

            fs.unlinkSync(

                document.encryptedPath

            );
        }

        // =====================================
        // DELETE DOCUMENT
        // =====================================

        await document.deleteOne();

        // =====================================
        // LOG EVENT
        // =====================================

        await logEvent(

            req.user.id,

            'DELETE',

            `${document.fileName} deleted`

        );

        res.status(200).json({

            message:
            'Document deleted successfully'

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

    uploadDocument,

    getDocuments,

    verifyDocument,

    downloadDocument,

    deleteDocument

};