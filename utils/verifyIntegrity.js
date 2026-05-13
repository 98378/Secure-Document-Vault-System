const crypto = require('crypto');

const fs = require('fs');

const verifyIntegrity = (
    filePath,
    originalHash
) => {

    const fileBuffer =
        fs.readFileSync(filePath);

    const currentHash =
        crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');

    return currentHash === originalHash;
};

module.exports = verifyIntegrity;