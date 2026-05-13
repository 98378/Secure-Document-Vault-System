const crypto =
require('crypto');

const fs =
require('fs');

const generateSignature =
(filePath) => {

    const fileBuffer =
    fs.readFileSync(filePath);

    const hash =
    crypto
    .createHash('sha256')
    .update(fileBuffer)
    .digest('hex');

    return hash;
};

module.exports =
generateSignature;