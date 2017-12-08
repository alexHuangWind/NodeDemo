request = require('request');
//1创建一个
nodemailer = require('nodemailer');
count = 0;
doReport();

function doEmail(msg) {
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
        to: 'nzleo@foxmail.com', //邮件发送到哪里，多个邮箱使用逗号隔开
        //to: 'alexchyandroid@gmail.com',
        subject: msg, // 邮件主题
        text: 'Hello world ?', // 存文本类型的邮件正文
        html: '<b>Hello world ?</b>' // html类型的邮件正文
    };
    //4、使用第二步定义的传输对象发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}


function doRequest() {
    request('https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/silver-fern-job-search-work-visa', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.indexOf("This visa is closed and will open on") != -1) {
                console.log('closed');
                count++;
                setTimeout(doRequest, 3000);
            } else {
                console.log('包含 opened');
                doEmail('success');
                count = 0;
            }
        }
    })
}

function doReport() {
    doEmail('已发送信息数：' + count);
    setTimeout(doReport, 60 * 60 * 1000);
}



doRequest();