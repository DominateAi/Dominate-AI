const MailComposer = require("nodemailer/lib/mail-composer");

async function composeNewEmail( mailbody ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var mail = new MailComposer(mailbody);
            mail.compile().build(function( err, message ){
                if( err ){
                    reject(err);
                }
                const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
                resolve( encodedMessage );
            });

        } catch ( err ){
            reject( err );
        }
    })
}



module.exports = composeNewEmail;