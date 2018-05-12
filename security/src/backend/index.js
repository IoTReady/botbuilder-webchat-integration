var request = require('request');

function getToken(callback) {
    console.log("getting token");
    request.post('https://directline.botframework.com/v3/directline/tokens/generate', {
        'auth': {
            'bearer': process.env.WEBCHAT_SECRET
        }
        }, (err, res, body) => {
            let response = {
                status: 503,
                body: err
            };
            if (!err && res.statusCode==200) {
                response = {
                    status: 200, /* Defaults to 200 */
                    body: JSON.parse(body)
                };
            }
            callback(response);
        });
}

module.exports = function (context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    if (req.query && req.query.uid || (req.body && req.body.uid)) {
        getToken(response => {
            console.log(response);
            context.res = response;
            context.done();
        });
    }
    else {
        let response = {
            status: 400,
            body: "Please pass a uid on the query string or in the request body"
        };
        console.log(response);
        context.res = response;
        context.done();
    }
};

if (process.argv && process.argv[2] == '--test') {
    console.log('Now running in test mode');
    req={query:{uid:"abc"}};
    getToken(response => {
        console.log(response);
    });
}

