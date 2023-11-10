const aws = require('aws-sdk');
const fs = require('fs');
const mailcomposer = require('mailcomposer.js');
 

aws.config.update({
  accessKeyId:'',
  secretAccessKey:'',
  region:''
});

  
const configSetName = 'Dominate.ai';
const UTFconfig = 'UTF-8';
const senderId = 'notification.dominate@dominate.ai';

const ses = new aws.SES();

async function mail(recipients, subject, messageBody, htmlTempalate, msgSender, fileName) {
  return new Promise(async (resolve, reject) => {
    console.log('init email', fileName);
    let mail;
    if( fileName ){
      mail = mailcomposer({
              from: senderId,
              replyTo: senderId,
              to: recipients,
              subject: subject,
              text: JSON.stringify(messageBody) + JSON.stringify(fileName),
              html:htmlTempalate,
              attachments: [
                  {
                    path:fileName,
                    // content: fileName,
                    filename: "download.pdf",
                    // type: 'application/pdf',
                    // disposition: 'attachment',
                    // contentId: 'myPdf'
                  },
                ],
            });
        } else {
          mail = mailcomposer({
            from: senderId,
            replyTo: senderId,
            to: recipients,
            subject: subject,
            text: JSON.stringify(messageBody),
            html:htmlTempalate
          });
        }
      let message = await mail.build(async function(err, message){
          if( message ){
            try {
              const sendEmail = await ses.sendRawEmail({RawMessage: {Data: message}}).promise();
              if( sendEmail ){
                console.log("Email has been sent to recipients: " +  recipients);
                return true
              }
            } catch (err) {
              console.log( err );
              return false;
            }
          }
        });
  })
    // return Promise.resolve().then(() => {
    //     let sendRawEmailPromise;
    //     let mail;
    //     if( fileName ){
    //          mail = mailcomposer({
    //             from: senderId,
    //             replyTo: senderId,
    //             to: recipients,
    //             subject: subject,
    //             text: JSON.stringify(messageBody),
    //             html:htmlTempalate,
    //             attachments: [
    //               {
    //                 content: fileName,
    //                 filename: fileName.split("/")[1],
    //                 type: 'application/pdf',
    //                 disposition: 'attachment',
    //                 contentId: 'myPdf'
    //               },
    //             ],
    //           });
    //     } else {
    //          mail = mailcomposer({
    //             from: senderId,
    //             replyTo: senderId,
    //             to: recipients,
    //             subject: subject,
    //             text: JSON.stringify(messageBody),
    //             html:htmlTempalate
    //         });
    //     }
      
    //     return new Promise((resolve, reject) => {
    //       mail.build((err, message) => {
    //         if (err) {
    //           reject(`Error sending raw email: ${err}`);
    //         }
    //         // sendRawEmailPromise = 
    //         ses.sendRawEmail({RawMessage: {Data: message}}).then( data => console.log("Message Send") )
    //       });
      
    //       // resolve(sendRawEmailPromise);
    //     });
    //   });
}

module.exports = {
    mail: mail
}