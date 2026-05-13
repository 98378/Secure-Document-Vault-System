const crypto =
require('crypto');

const fs =
require('fs');

// =====================================
// SECRET KEY
// =====================================

const algorithm =
'aes-256-cbc';

const secretKey =
crypto

.createHash('sha256')

.update('securevaultsecretkey')

.digest();

// =====================================
// ENCRYPT
// =====================================

const encryptFile = (

    inputPath,

    outputPath

) => {

    const iv =
    crypto.randomBytes(16);

    const cipher =
    crypto.createCipheriv(

        algorithm,

        secretKey,

        iv

    );

    const input =
    fs.createReadStream(
        inputPath
    );

    const output =
    fs.createWriteStream(
        outputPath
    );

    output.write(iv);

    input

    .pipe(cipher)

    .pipe(output);
};

// =====================================
// DECRYPT
// =====================================

const decryptFile = (

    inputPath,

    outputPath

) => {

    const inputBuffer =
    fs.readFileSync(
        inputPath
    );

    const iv =
    inputBuffer.slice(0, 16);

    const encryptedData =
    inputBuffer.slice(16);

    const decipher =
    crypto.createDecipheriv(

        algorithm,

        secretKey,

        iv

    );

    const decrypted =
    Buffer.concat([

        decipher.update(
            encryptedData
        ),

        decipher.final()

    ]);

    fs.writeFileSync(

        outputPath,

        decrypted

    );
};

module.exports = {

    encryptFile,

    decryptFile

};
