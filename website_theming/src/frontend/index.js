// generating uuid
function uuid(a, b) {
    for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(
            16) : '-');
    return b
}

// variable declaration
let uid = uuid();
const params = {};
var flag = false;
var btnStatus = false;
var key = {};
var timeout = 0;
var botConnection;

const user = {
    id: params['userid'] || "abc",
    name: params['username'] || "Mr.abc"
};
const bot = {
    id: params['botid'],
    name: params['botname']
};



function changeHeader(newColor) {
    document.querySelector('.wc-header span').innerText = 'Creative Bot'
    document.querySelector('.wc-header').style.background = '#2c214a';
}

function displayChatIcon(uid) {
    generateToken(uid, (err, status) => {
        if (err) {
            console.error("Token is not generated");
            alert(error);
        } else {
            document.querySelector('.floatingBtn').src =
                'https://dara.network/wp-content/uploads/2018/03/dara_smirk_trans_circle.png';
            document.body.style.cursor = 'auto';
        }
    })
}
// To toggle web chat window
$(document).ready(function () {
    $("#floatBtn").click(function () {
        toggleFunc();
    });
});

function toggleFunc() {
    $("#BotChatGoesHere").animate({
        width: "toggle"
    }, () => {

        if (flag == false) {
            if ($("#BotChatGoesHere").is(":hidden") == false) {
                //    generateToken(uid);
                startConversation();

                var r = $('<div class="closeButton" id="closeButton">X</div>');
                $('.wc-header').append(r);

                $('.wc-header span').html('Dara Art Bot');
                $('.wc-header').css('background-color', '#2c214a');

                if ($('.wc-message-content')) {
                    $('.wc-message-content').css('backgroundColor', '#2c214a');
                }

                $(document).ready(function () {
                    $("#closeButton").click(function () {
                        $("#BotChatGoesHere").animate({
                            width: "toggle"
                        });
                    });
                });

            }
        }
    });
}

function startConversation() {
    flag = true;

    BotChat.App({
        bot: bot,
        botConnection: botConnection,
        user: user
    }, document.getElementById('BotChatGoesHere'));

    // console.log('bot connection', botConnection);
    if (botConnection.connectionStatus$) {
        document.querySelector('.floatingBtn').style.cursor = 'pointer';
    }
}

displayChatIcon(uid);