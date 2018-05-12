/*
Generating token is asynchronous process so we have to use Callback here.
One limitation of token is that it always have an expiry date.
To secure that part please refer: 
user_exprience/remember_user/frontend/rembrToken.js
*/

function generateToken(userId, callback) {
    try {
        var url = 'https://daraartbot-functions.azurewebsites.net/api/webChatToken?uid=' + userId;
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (!data) {
                    callback(error, null);
                } else {
                    token = data.token;

                    botConnection = new BotChat.DirectLine({
                        domain: params['domain'],
                        token: token,
                        webSocket: params['webSocket'] && params['webSocket'] === 'false' // defaults to true
                    });

                    return callback(null, token);
                }
            })
            .catch(err => console.error(err));
    } catch (err) {
        alert(err);
        console.error(err);
    }
}