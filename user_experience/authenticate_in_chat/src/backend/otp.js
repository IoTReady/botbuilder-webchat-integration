
const nodemailer = require('nodemailer');
const builder = require('botbuilder');

const gmailEmail = "YOUR_GMAIL_ADDRESS";
const gmailPassword = "YOUR_GMAIL_PASSWORD";
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

// four digit otp
function padToFour(number) {
    if (number <= 9999) {
        number = ("000" + number).slice(-4);
    }
    return number;
}

// send otp to email address
function sendNewOTP(session, userEmail) {
    const otp = padToFour(Math.floor(Math.random() * 9999));
    const email = {
        from: '"Dara Artbot" <dara@jaaga.in>',
        to: userEmail, // this comes from session.message....
        subject: 'One Time Password for Dara.Network',
        text: `${otp} is your password. \n\nPlease type it back to me in our chat window to verify that your email address is really yours. 
        \n\n
        Thanks for joining us and I'll chat with you soon!`,
    };
    // store for comparison
    // expiry session for 10 min
    session.conversationData.otpInfo = {
        otp: otp,
        expiry: Math.floor(Date.now() / 1000) + 600
    };

    mailTransport.sendMail(email)
        .then(() => {
            console.log(`New otp email sent to ${userEmail}`);
        })
        .catch((error) => console.error(`Error while sending the otp email to ${userEmail}`, error));
}

/////////////////////////////////////////////////
bot.dialog("/", [(session, args) => {
        builder.Prompts.text(session, "What is your email id?")
    },
    (session, result) => {
        if (result.response) {
            session.conversationData.email = result.response; // this data sustains for full session
            session.beginDialog("getOTP", {
                data: result.response
            });
        } else {
            session.replaceDialog("/");
        }
    }
])


bot.dialog('getOTP', [(session, args) => {
        if (args.data) {
            sendNewOTP(session, args.data);
            builder.Prompts.text(session, "An OTP sent to your email id, Please return it back");
        } else {
            builder.Prompts.text(session, "Sorry !! Please enter a valid OTP");
        }
    },
    (session, result) => {
        let otp = session.conversationData.otpInfo.otp;
        let validTime = session.conversationData.otpInfo.expiry;
        let currentTime = Math.floor(Date.now() / 1000);
        if (currentTime < validTime) {
            if (otp == result.response) {
                session.endDialog("Thanks for verfiying the OTP")
            } else {
                session.replaceDialog('getOTP', {
                    reprompt: true
                });
            }
        } else {
            session.send("Your session has expired");
            session.beginDialog("getOTP", {
                data: session.conversationData.email
            });
        }

    }
])