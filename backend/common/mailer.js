const sgMail = require('@sendgrid/mail');
var configResolve = require("./configResolver");
var config = configResolve.getConfig();
const fs = require("fs");

sgMail.setApiKey(config.SENDGRID_API_KEY);
var sender = config.smtp.senderEmail;


function mail(recipients, subject, messageBody, htmlTempalate, msgSender, fileName) {
    return new Promise((resolve, reject) => {
        let messageBodyJson = JSON.stringify(messageBody);
        var messageSender = undefined;
        if (msgSender == undefined) {
            messageSender = sender;
        } else {
            messageSender = msgSender;
        }
        var toAddresses = [recipients];

        if (fileName) {
            const msg = {
                to: toAddresses,
                from: messageSender,
                replyto: messageSender,
                subject: subject,
                text: messageBodyJson,
                html: htmlTempalate,
                attachments: [
                    {
                        content: fileName,
                        filename: fileName.split("/")[1],
                        type: 'application/pdf',
                        disposition: 'attachment',
                        contentId: 'myPdf'
                    },
                ]
            };

            sgMail.send(msg).then((res) => {
                console.log('Email Sent');
                if (fileName) {
                    fs.unlink(fileName, (success) => {
                        console.log("File deleted : " + fileName);
                    }, (err) => {
                        console.log("Failed to delete file : " + fileName);
                    });
                }
                resolve({ "success": true })
            }).catch((err) => {
                console.log('Error', err);
                reject(err);
            });
        } else {

            const msg = {
                to: toAddresses,
                from: messageSender,
                replyto: messageSender,
                subject: subject,
                text: messageBodyJson,
                html: htmlTempalate,
            };

            sgMail.send(msg).then((res) => {
                console.log('Email Sent');
                resolve({ "success": true })
            }).catch((err) => {
                console.log('Error from sendGrid:', err);
                reject(err);
            });
        }
    });
}

function base64_encode(data) {
    return new Buffer(data).toString('base64');
}


module.exports = {
    mail: mail
}