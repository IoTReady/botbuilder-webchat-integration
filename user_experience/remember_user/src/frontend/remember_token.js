/* 
Generating token is asynchronous process so we have to use a callback here.
The default expiry time for Direct Line tokens is 30 minutes. We store them and track this expiry time to avoid needlessly refreshing the token (and resetting the conversation).
If the token has expired, we ask for a fresh one.
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

                    var currentTime = Math.floor(new Date().getTime() / 1000);

                    if (localStorage.getItem('tokenTime')) {
                        // geting token from local storage
                        timeout = localStorage.getItem('tokenTime'); 
                    }

                    var expireTime = currentTime - timeout;

                    if (expireTime > 1740) {
                        var tokenTime = Math.floor(new Date().getTime() / 1000);
                        token = data.token;
                        localStorage.setItem('tokenTime', tokenTime);
                    } else if (localStorage.getItem("tokenId")) {
                        token = localStorage.getItem("tokenId");
                    } else {
                        token = data.token;
                    }

                    botConnection = new BotChat.DirectLine({
                        domain: params['domain'],
                        token: token,
                        webSocket: params['webSocket'] && params['webSocket'] === 'false' // defaults to true
                    });

                    // setting local storage
                    key.token = token;
                    localStorage.setItem("tokenId", token);

                    return callback(null, token);
                }
            })
            .catch(err => console.error(err));
    } catch (err) {
        alert(err);
        console.error(err);
    }
}