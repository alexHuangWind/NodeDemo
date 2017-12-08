//日志框架
var winston = require('winston');
var mylogger = new winston.myLogger();
//请求
request = require('request');
//1创建一个
nodemailer = require('nodemailer');
count = 0;
doReport();
function doEmail(to,title,body) {
     myLog('begin doEmail  ' + 'to = '+to + 'title = '+title+ 'body = '+body);
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
        myLog('Message %s sent: %s', info.messageId, info.response);
    });
}

function doRequest() {
    request('https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/silver-fern-job-search-work-visa', function(error, response, body) {
        myLog('error = ' + error +'response = ' + response +'body = ' + body );
        if (!error && response.statusCode == 200) {
            if (body.indexOf("This visa is closed and will open on") != -1) {
                myLog('closed');
                count++;
                setTimeout(doRequest, 3*1000);
            } else {
                myLog('包含 opened');
                doEmail('alexchyandroid@gmail.com',response.body,'success');
                count = 0;
            }
        }
    })
}

function doReport() {
    doEmail('alexchyandroid@gmail.com','已发送信息数：'+count);
    setTimeout(doReport, 60*60*1000);
}
function myLog(msg){
winston.info(msg, {timestamp: Date.now(), pid: process.pid});
}
doRequest();