// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('bot');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hashtable = require(__dirname + '/hashtable.js');

// Setup Express Server
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

var config = require('fs').readFileSync(__dirname + '/config.json');
config = JSON.parse(config); //字串轉物件

var carous = require('fs').readFileSync(__dirname + '/carousel.json');
carous = JSON.parse(carous); //字串轉物件

var littletest = require('fs').readFileSync(__dirname + '/littletest.json');
littletest = JSON.parse(littletest); //字串轉物件

app.get('/api', function (request, response) {
    response.send('API is running');
});

app.get('/lifftest', function (request, response) {
    console.log('GET /lifftest');
    request.header("Content-Type", 'text/html');
    var fs = require('fs');
    fs.readFile(__dirname + '/mytest.html', 'utf8', function (err, data) {
        if (err) {
            res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/logs', function (request, response) {
    var stream = require('fs').createReadStream('logs/messaging.log');
    stream.pipe(response);
});

app.post('/getlineuserid', function (request, response) {
    console.log('post /getlineuserid');
    var userId = request.body.userId;
    var displayName = request.body.displayName;
    var pictureUrl = request.body.pictureUrl;
    //console.log("1 " + userId);
    //console.log("2 " + displayName);
    //console.log("3 " + pictureUrl);
    response.send('200');
    SendGiftMessage(request.body, 'tstiisacompanyfortatung');
});


app.post('/messages', function (request, response) {
    response.send('');
    logger.info(request.body);
    var results = request.body.events;
    logger.info(JSON.stringify(results));
    logger.info('receive message count: ' + results.length);
    for (var idx = 0; idx < results.length; idx++) {
        var acct = results[idx].source.userId;
        var reply_token = results[idx].replyToken;
        logger.info('reply token: ' + results[idx].replyToken);
        logger.info('createdTime: ' + results[idx].timestamp);
        logger.info('from: ' + results[idx].source.userId);
        logger.info('type: ' + results[idx].type);
        logger.info('aa  type: ' + results[idx].message.type);
        console.log("--------------------------------------------------------------" + JSON.stringify(results[idx]));
        if (results[idx].type == 'message') {
            if (results[idx].message.type == 'text') {
                /*SendMessage(acct, results[idx].message.text, 'tstiisacompanyfortatung', reply_token, function (ret) {
                });*/
                /*SendMessage(acct, 'line://app/{1592804495-p35qKYNB}', 'tstiisacompanyfortatung', reply_token, function (ret) {
                });*/
                SendFlexMessage(acct, results[idx].message.text, 'tstiisacompanyfortatung', reply_token, function (ret) { });
                //SendltMessage(acct, results[idx].message.text, 'tstiisacompanyfortatung', reply_token, function (ret) {});
                //SenduseridMessage(acct, results[idx].message.text, 'tstiisacompanyfortatung', reply_token, function (ret) { });
                //distance();
                //distHaversine();
            }
        }
    }
});

var http = require('http');
var server = http.Server(app);	// create express server
var options = {
    pingTimeout: 60000,
    pingInterval: 3000
};
var listener = server.listen(process.env.port || process.env.PORT || 3978, function () {
    logger.info('Server listening to ' + listener.address().port);
});

process.on('uncaughtException', function (err) {
    logger.error('uncaughtException occurred: ' + (err.stack ? err.stack : err));
});

/*********************************************************888 */
function distHaversine() {
    var p1 = { lat: 25.064258, lng: 121.522554 };
    var p2 = { lat: 25.059610, lng: 121.513416 };
    var rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; // earth's mean radius in km
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat))
        * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log("------------------------------------------------------------------------com" + d);
}
function distance() {
    var o = { lat: 25.064258, lng: 121.522554 };
    var d = { lat: 25.059610, lng: 121.513416 };
    var EARTH_RADIUS = 6378137.0;
    var lat1 = o.lat * Math.PI / 180.0;
    var lat2 = d.lat * Math.PI / 180.0;
    var a = lat1 - lat2;
    var b = (o.lng - d.lng) * Math.PI / 180.0;
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2))) * EARTH_RADIUS;
    dis = Math.round(dis * 10000) / 10000;
    console.log("------------------------------------------------------------------------my" + dis);
}
/**********************************************************/

//1593046997-AoeqdVRD 100%
//1593046997-1dNyPqzG 50%
//1593046997-3zOeargL 80%

function SendGiftMessage(user, password) {
    console.log(user.userId);
    console.log(user.displayName);
    console.log(user.pictureUrl);
    if (password == 'tstiisacompanyfortatung') {
        var name = "恭喜 " + user.displayName;
        var data = {
            'to': user.userId,
            'messages': [{
                "type": "flex",
                "altText": "e同購會員綁定",
                "contents": {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "特獎",
                                "weight": "bold",
                                "color": "#444444",
                                "size": "xl"
                            }
                        ]
                    },
                    "hero": {
                        "type": "image",
                        "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/TAW-A150Ls.jpg",
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                            "type": "uri",
                            "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                        }
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "md",
                        "action": {
                            "type": "uri",
                            "uri": "https://linecorp.com"
                        },
                        "contents": [
                            {
                                "type": "text",
                                "text": "TATUNG大同 15KG定頻洗衣機 (TAW-A150L)",
                                "size": "xl",
                                "weight": "bold"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "spacing": "md",
                                "contents": [
                                    {
                                        "type": "image",
                                        "url": user.pictureUrl,
                                        "aspectMode": "cover",
                                        "aspectRatio": "4:3",
                                        "size": "sm",
                                        "gravity": "bottom"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": name,
                                                "size": "sm",
                                                "color": "#444444"
                                            },
                                            {
                                                "type": "text",
                                                "text": "抽到特獎",
                                                "size": "sm",
                                                "color": "#444444"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "button",
                                "action": {
                                    "type": "uri",
                                    "label": "綁定會員即可擁有",
                                    "uri": "https://linecorp.com"
                                }
                            }
                        ]
                    }
                }
            }]
        }
    }
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/bot/message/push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            'Authorization': 'Bearer <' + config.channel_access_token + '>'
        }
    }
    var https = require('https');
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            logger.info('Response: ' + chunk);
        });
    });
    req.write(JSON.stringify(data));
    req.end();
    try {
        callback(true);
    } catch (e) { };
}

function SenduseridMessage(userId, message, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        let data = {
            'to': userId,
            'messages': [
                { 'type': 'text', 'text': message }
            ]
        };
        logger.info('傳送訊息給' + userId);
        /*ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (!ret) {
                PostToLINE(data, config.channel_access_token, this.callback);
            } 
        });*/
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
            data.to = "U7c1457b5dde59688fcb18788535f6a04";
            data.messages = [
                { 'type': 'text', 'text': userId + " 說: " + message }
            ];
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

function SendltMessage(userId, message, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        let data = {
            'to': userId,
            'messages': [
                littletest
            ]
        };
        logger.info('傳送訊息給' + userId);
        /*ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (!ret) {
                PostToLINE(data, config.channel_access_token, this.callback);
            } 
        });*/
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

// 傳送訊息給 LINE 使用者
function SendFlexMessage(userId, message, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        if (message == "圖片") {
            var data = {
                'to': userId,
                'messages': [
                    littletest
                ]
            };
        }
        else if (message != "測試測試") {
            var data = {
                'to': userId,
                'messages': [
                    {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": carous
                    }
                ]
            };
        }

        logger.info('傳送訊息給 ' + userId);
        /*ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (!ret) {
                PostToLINE(data, config.channel_access_token, this.callback);
            } 
        });*/
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

/*{
                        "type": "bubble",
                        "hero": {
                            "type": "image",
                            "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/TAW-A150Ls.jpg",
                            "size": "full",
                            "aspectRatio": "20:13",
                            "aspectMode": "cover",
                            "action": {
                                "type": "uri",
                                "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                            }
                        },
                        "body": { //body位置
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "action": {
                                "type": "uri",
                                "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                            },
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "TATUNG大同 15KG定頻洗衣機 (TAW-A150L)",
                                    "size": "xl",
                                    "weight": "bold",
                                    "action": {
                                        "type": "uri",
                                        "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                    }
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "促銷商品",
                                                    "weight": "bold",
                                                    "margin": "sm",
                                                    "flex": 0,
                                                    "action": {
                                                        "type": "uri",
                                                        "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                                    }
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "2018/6/29~2018/7/11",
                                                    "size": "sm",
                                                    "align": "end",
                                                    "color": "#aaaaaa",
                                                    "action": {
                                                        "type": "uri",
                                                        "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "促銷價",
                                                    "weight": "bold",
                                                    "margin": "sm",
                                                    "flex": 0,
                                                    "action": {
                                                        "type": "uri",
                                                        "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                                    }
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "15,490元",
                                                    "size": "sm",
                                                    "align": "end",
                                                    "color": "#aaaaaa",
                                                    "action": {
                                                        "type": "uri",
                                                        "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "text",
                                    "text": "．全自動NEURO & FUZZLY智慧型控制。 ．6種洗衣行程(標準、強洗、快洗、柔洗、毛毯、浸泡)。 ．五道立體噴射水流，洗淨力超強。 ．Air Bubble洗淨新概念。 ．噴淋式洗清，節水又清淨。 ．強化玻璃透明上蓋。 ．自動偵測洗衣無段式水位:手動六段。 ．不鏽鋼洗衣槽。 ．槽洗淨功能，防霉除菌一次搞定。 ．上蓋透明視窗，洗衣動作一目瞭然。 ．兒童安全鎖。",
                                    "wrap": true,
                                    "color": "#aaaaaa",
                                    "size": "xxs",
                                    "action": {
                                        "type": "uri",
                                        "uri": "https://www.google.com.tw"
                                    }
                                }
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "spacer",
                                    "size": "xxl"
                                },
                                {
                                    "type": "button",
                                    "style": "primary",
                                    "color": "#905c44",
                                    "action": {
                                        "type": "uri",
                                        "label": "登入e同購",
                                        "uri": "https://www.etungo.com.tw/login.html"
                                    }
                                }
                            ]
                        }
                    }*/ //contents end



// 傳送訊息給 LINE 使用者
function SendMessage(userId, message, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        var data = {
            'to': userId,
            'messages': [
                { 'type': 'text', 'text': message }
            ]
        };
        logger.info('傳送訊息給 ' + userId);
        /*ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (!ret) {
                PostToLINE(data, config.channel_access_token, this.callback);
            } 
        });*/
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

// 傳送[可點選圖片]給 LINE 使用者
function SendImagemap(userId, baseUrl, altText, imagemap, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        var data = {
            'to': userId,
            'messages': [{
                "type": "imagemap",
                "baseUrl": baseUrl,
                "altText": altText,
                "baseSize": {
                    "height": 693,
                    "width": 1040
                },
                "actions": imagemap
            }]
        };
        logger.info('傳送訊息給 ' + userId);
        logger.info('傳送圖片網址: ' + baseUrl);
        /*ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (!ret) {
                PostToLINE(data, config.channel_access_token, this.callback);
            } 
        });*/
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}
// 傳送【選單】給 LINE 使用者
function SendButtons(userId, image_url, title, text, buttons, alt_text, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        var data = {
            'to': userId,
            'messages': [{
                'type': 'template',
                'altText': alt_text,
                'template': {
                    'type': 'buttons',
                    'thumbnailImageUrl': image_url,
                    'title': title,
                    'text': text,
                    'actions': buttons
                }
            }]
        };
        logger.info('傳送訊息給 ' + userId);
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

// 傳送【確認】給 LINE 使用者
function SendConfirm(userId, text, buttons, alt_text, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        var data = {
            'to': userId,
            'messages': [{
                'type': 'template',
                'altText': alt_text,
                'template': {
                    'type': 'confirm',
                    'text': text,
                    'actions': buttons
                }
            }]
        };
        logger.info('傳送訊息給 ' + userId);
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

// 傳送【可滾動選單】給 LINE 使用者
function SendCarousel(userId, columns, password, reply_token, callback) {
    if (password == 'tstiisacompanyfortatung') {
        var data = {
            'to': userId,
            'messages': [{
                'type': 'template',
                'altText': '請至行動裝置檢視訊息',
                'template': {
                    'type': 'carousel',
                    'columns': columns
                }
            }]
        };
        logger.info('傳送訊息給 ' + userId);
        ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
            if (ret) {
                this.callback(true);
            } else {
                PostToLINE(data, config.channel_access_token, this.callback);
            }
        }.bind({ callback: callback }));
    } else {
        callback(false);
    }
}

// 直接回覆訊息給 LINE 使用者
function ReplyMessage(data, channel_access_token, reply_token, callback) {
    data.replyToken = reply_token;
    logger.info(JSON.stringify(data));
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            logger.info('Response: ' + chunk);
        });
        res.on('end', function () {
        });
        logger.info('Reply message status code: ' + res.statusCode);
        if (res.statusCode == 200) {
            logger.info('Reply message success');
            this.callback(true);
        } else {
            logger.info('Reply message failure');
            this.callback(false);
        }
    }.bind({ callback: callback }));
    req.write(JSON.stringify(data));
    req.end();
}

// 取得 LINE 使用者資訊
function GetProfile(userId, callback) {
    var https = require('https');
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/bot/profile/' + userId,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer <' + config.channel_access_token + '>'
        }
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            logger.info('Response: ' + chunk);
            if (res.statusCode == 200) {
                var result = JSON.parse(chunk);
                logger.info('displayName: ' + result.displayName);
                logger.info('userId: ' + result.userId);
                logger.info('pictureUrl: ' + result.pictureUrl);
                logger.info('statusMessage: ' + result.statusMessage);
                callback(result);
            } if (res.statusCode == 401) {
                logger.info('IssueAccessToken');
                IssueAccessToken();
            }
        });
    }).end();
}

function PostToLINE(data, channel_access_token, callback) {
    logger.info(JSON.stringify(data));
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/bot/message/push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            logger.info('Response: ' + chunk);
        });
    });
    req.write(JSON.stringify(data));
    req.end();
    try {
        callback(true);
    } catch (e) { };
}
function IssueAccessToken() {
    var https = require('https');
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/oauth/accessToken',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    options.form = {};
    options.form.grant_type = 'client_credentials';
    options.form.client_id = config.channel_id;
    options.form.client_secret = config.channel_secret;

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            logger.info('Response: ' + chunk);
            if (res.statusCode == 200) {
                var result = JSON.parse(chunk);
                config.channel_access_token = result.access_token;
                var fs = require('fs');
                fs.writeFile(__dirname + '/config.json', JSON.stringify(config), function (err) {
                    if (err) {
                        logger.error(e);
                    }
                });
            }
        });
    }).end();
}