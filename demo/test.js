var winston = require('winston');
//请求
request = require('request');
//1.引入邮件功能
nodemailer = require('nodemailer');
alexAddress = 'alexchyandroid@gmail.com';
leoAddress = 'alexchyandroid@gmail.com';
toAddress = alexAddress;
count = 1;
doReport();

function doEmail(to, title, body) {
    //2创建一个传输对象
    let transporter = nodemailer.createTransport({
        host: 'smtp.sina.com',
        port: 465,
        secure: true,
        auth: {
            user: 'alexusedforsfv@sina.com', //邮箱的账号
            pass: 'Alex1127' //邮箱的密码
        }
    });
    //3、用unicode字符设置电子邮件数据
    let mailOptions = {
        from: '"alex" <alexusedforsfv@sina.com>', //邮件来源
        //to: 'nzleo@foxmail.com', //邮件发送到哪里，多个邮箱使用逗号隔开
        to: to,
        subject: title, // 邮件主题
        text: body, // 存文本类型的邮件正文
        html: body // html类型的邮件正文
    };
    //4、使用第二步定义的传输对象发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return myLog(error);
        }
        myLog(' doEmail  ' + 'to = ' + to + 'title = ' + title + 'body = ' + body);
    });
}

function doRequest() {
    try {
        request('https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/silver-fern-job-search-work-visa', function(error, response, body) {
            if (error || response == null || response.hasOwnProperty("statusCode")) {
                myLog('contain error ' + error);
                doEmail(toAddress, 'error', 'error = ' + error + 'response = ' + response);
                setTimeout(doRequest, 10 * 60 * 1000);
                return;
            }
            if (response.statusCode == 200) {
                if (body.indexOf("This visa is closed and will open on") != -1) {
                    myLog('contain closed');
                    count++;
                    setTimeout(doRequest, 3 * 1000);
                } else {
                    myLog('contain opened');
                    doEmail(toAddress, response.body, 'success');
                    count = 0;
                    return;
                }
            } else {
                myLog('statusCode not 200 ' + response.statusCode);
                doEmail(toAddress, 'statusCode', 'statusCode = ' + statusCode);
                setTimeout(doRequest, 60 * 1000);
                return;
            }
            myLog('error = ' + error + 'code = ' + response.statusCode);
        })
    } catch (err) {
        myLog('catch err ' + err);
        doEmail(toAddress, 'err', 'error = ' + err);
        setTimeout(doRequest, 10 * 60 * 1000);
    }
}


function doReport() {
    if (count == 0) {
        return;
    }
    doEmail(toAddress, '已发送信息数：' + count);
    setTimeout(doReport, 60 * 60 * 1000);
}

function myLog(msg) {
    winston.info(msg, { timestamp: Date.now(), pid: process.pid });
}
doRequest();