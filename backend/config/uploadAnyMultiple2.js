
const { Readable } = require('stream');
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const CLIENT_ID = "105023783434-8ajkfcrd8egmhto1e0hegh1asdbolhbe.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04UEsznvMlWHpCgYIARAAGAQSNwF-L9Irgpcqmk3uymlDvf_Ad3qHGawjKxEkuROyOjixI3rliMLeMBsgTSv8dthS_qUsYNUjxkU";

const multer = require('multer');
const upload = multer();
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: "v3",
    auth: oauth2Client
});




async function uploadAnyMultiple2(files) {
    const uploadedFiles = [];

    try {
        for (const file of files) {
            const fileName = file.originalname;
            const mimeType = file.mimetype;
            const fileBuffer = file.buffer;

            // Create a readable stream from the file buffer
            const readableStream = Readable.from(fileBuffer);

            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: mimeType,
                },
                media: {
                    mimeType: mimeType,
                    body: readableStream, // Use the readable stream here
                },
            });

            console.log(response.data);

            // Generating public URL
            const fileId = response.data.id;

            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const result = await drive.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
            });

            const webViewLink = result.data.webViewLink;
            const webContentLink = result.data.webContentLink;

            console.log(`Uploaded file: ${fileName}`);
            console.log('WebViewLink:', webViewLink);
            console.log('WebContentLink:', webContentLink);
            uploadedFiles.push({
                fname: fileName,
                url: fileId,
                mimetype: mimeType
            })
        }

    } catch (error) {
        console.log('Error uploading files:', error.message);
    }
    if (uploadedFiles.length > 0) {
        return uploadedFiles
    }
    return false;
}
async function uploadAnyFile(file) {
    let uploadedFile;

    try {

        const fileName = file.originalname;
        const mimeType = file.mimetype;
        const fileBuffer = file.buffer;

        // Create a readable stream from the file buffer
        const readableStream = Readable.from(fileBuffer);

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: readableStream, // Use the readable stream here
            },
        });

        console.log(response.data);

        // Generating public URL
        const fileId = response.data.id;

        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        const webViewLink = result.data.webViewLink;
        const webContentLink = result.data.webContentLink;

        console.log(`Uploaded file: ${fileName}`);
        console.log('WebViewLink:', webViewLink);
        console.log('WebContentLink:', webContentLink);
        uploadedFile = {
            fname: fileName,
            url: fileId,
            mimetype: mimeType
        };


    } catch (error) {
        console.log('Error uploading files:', error.message);
    }
    if (uploadedFile) {
        return uploadedFile
    }
    return false;
}


//TO DELETE SINGLE FILE


async function deleteSingleFile(fileId) {
    try {
        const response = await drive.files.delete({
            fileId: fileId,
        });
        console.log(response.data, response.status);
        return true;
    } catch (error) {

        console.log(error.message);
        return false;
    }
}





//To DELETE MULTIPLE FILES


async function deleteFiles(FileIds) {
    try {
        for (const fileId of FileIds) {
            const response = await drive.files.delete({
                fileId: fileId,
            });
            console.log(`File with ID ${fileId} deleted successfully. Status: ${response.status}`);

        }
        return true;
    } catch (error) {
        console.log('Error deleting files:', error.message);
        return false;
    }

}








module.exports = { uploadAnyMultiple2, uploadAnyFile, deleteFiles, deleteSingleFile };