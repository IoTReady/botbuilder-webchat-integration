// import * as nodemailer from 'nodemailer';
var nodemailer = require('nodemailer');
var builder = require('botbuilder');

const gmailEmail = "YOUR_GMAIL_ADDRESS_HERE";
const gmailPassword = "YOUR_GMAIL_PASSWORD_HERE";
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

function padToFour(number) {
    if (number<=9999) { number = ("000"+number).slice(-4); }
    return number;
  }

function sendNewOTP(session,userEmail) {
    const otp = padToFour(Math.floor(Math.random()*9999));
    const email = {
        from: '"Dara Artbot" <dara@jaaga.in>',
        to: userEmail, // this comes from session.message....
        subject: 'One Time Password for Dara.Network',
        text: `${otp} is your password. \n\nPlease type it back to me in our chat window to verify that your email address is really yours. 
        \n\n
        Thanks for joining the Dara Network and I'll chat with you soon!
        \n\n
        -Dara`,
    };
    // store for comparison
    session.userData.otp = {otp: otp, expiry: Math.floor(Date.now()/1000)+3600};

    mailTransport.sendMail(email)
    .then(() => {
      console.log(`New otp email sent to ${userEmail}`);
      //session.send('An otp sent to your mail.');
    })
    .catch((error) => console.error(`There was an error while sending the otp email to ${userEmail}`, error));
}

// send OTP
// sendNewOTP('vipinsaini1989@gmail.com');

// Compare OTP
function checkOTP(session, userOTP, userEmail) {
    let otpCorrect = false;
    // prompt for otp - include cancel option?
    // userOTP = session.message.text; //or something similar

    
    if (session.userData.otp && userOTP) {
        /*
        let currentTime = Math.floor(Date.now()/1000);
        if (currentTime > session.userData.otp.expiry) {
            // otp expired
            sendNewOTP(session,userEmail);
            // reprompt and let user know there's another otp in their inbox.
            return callback(true);
        } 
        else
        */
       console.log("checkOTP userOTP=", userOTP + ", session.userData.otp=" + session.userData.otp.otp + ":");
        console.log("userOTP.indexOf(session.userData.otp.otp) = ", userOTP.indexOf(session.userData.otp.otp));
            if (userOTP.indexOf(session.userData.otp.otp) > -1) {
            // user authenticated
            session.userData.otp = null;
            otpCorrect = true;
            // session.send('You are valid user');
            // session.beginDialog('swapId',{data:email})
            // send success message to user
            // backchannel message to change user id
        }  
    }
    return otpCorrect;
}

function gettext(key, session) {
    return session.localizer.gettext(session.preferredLocale(), key);
}

function emailEvent(eventName, value, address) {
    var msg = new builder.Message().address(address);
    msg.data.type = 'event';
    msg.data.name = eventName;
    msg.data.value = value;

    console.log('function check', msg);

    return msg;
}


module.exports = [(session, args, next) => {
    console.log('Starting processEmailAndSendOTP:', args);
    console.log('otp Obj', session.userData.otp);

   
    if (args && args.data) {
        let email = args.data;
        session.dialogData.email = args.data;

         //catch the loop that happens after they have already verified 
        //they are re-verifing, so don't change the data...
        if (session.userData.profile.email && session.userData.profile.email == email) {
            next({ otpVerified: true });
        } else {
            //they are changing to a new email address
            session.userData.profile.email = email;
            session.userData.profile.emailVerified = false;

            console.log('check userEmail:', email);
            sendNewOTP(session, email);
            var text = session.gettext("confirmEmailEntered", email);
            var choices = [session.gettext("Skip")];
            builder.Prompts.choice(session, text, choices, { maxRetries: 0, listStyle: 3 });
        }
      
    }
    else {
        //check the case when they have entered 4 digits randomly...
        var lastMsg = session.message.text;
        var fourDigitRegex = /[0-9]{4}/;

        //ensure that we have an email address...
        let email = session.userData.profile.email;

        if (email && (lastMsg.search(fourDigitRegex) == 0)) {
            //set the dialog data and otp to pass to the next waterfall.
            session.dialogData.email = email;
            next({ otp: lastMsg });
        } else {

            //do the normal dialog....
            session.send(gettext("UpdateEmailAgain", session));
            //session.endDialog()
            session.replaceDialog('/defaultMenu');
        }
    }
},
(session, result, next) => {
    console.log('OTP Part 2', result);
    let email = session.dialogData.email;
    
    if (result && result.response && result.response.index == 0) {
        //they tapped skip
        session.endDialog(session.gettext("OTPSkipMessage"));
    } else if (result && result.otpVerified) {
        console.log("in result.otpVerified");
        //this case is for when we've detected the OTP and started a new global dialog for it and already processed it. 
        session.endDialog();
    } else if (email && email == session.userData.profile.emailVerified) {
        console.log("in email = verifiedEmail");
        //this case is for when we've detected the OTP and started a new global dialog for it and already processed it. 
        session.endDialog();
    } else {
        //used for the case where they enter a 4 digit code out of dialog...
        var userOTP = result.otp || session.message.text.trim();
        let verified = checkOTP(session, userOTP, email);
        
        console.log("verified otp?", verified);
        if (verified) {
            session.send(session.gettext("otpIsCorrect", email));
            session.userData.profile.emailVerified = email;

            console.log("in old swapId: session.message.address.channelId", session.message.address.channelId);
            if (session.message.address.channelId == 'webchat') {
                let emailToPass = JSON.stringify({ email: email });
                var reply = emailEvent('emailVerfied', emailToPass, session.message.address);
                session.send(reply);
            }
            console.log("about to call endDialog in processEmailAndSendOTP");
            session.endDialogWithResult({ otpVerified: true });
        } else {
            // otp entered is incorrect
            session.send(gettext("wrongOTP", session));
            console.log("about to recall  processEmailAndSendOTP after !verified");
            session.beginDialog('processEmailAndSendOTP', { data: email });
        }
    }
}];
