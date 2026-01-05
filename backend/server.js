const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// 请求体解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 10, // 每个IP最多10个请求
    message: {
        error: '请求过于频繁，请稍后再试'
    }
});

// 邮件配置
const transporter = nodemailer.createTransporter({
    service: 'gmail', // 或其他邮件服务
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 验证规则
const contactValidation = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('姓名长度应在2-50字符之间'),
    body('email').isEmail().normalizeEmail().withMessage('请输入有效的邮箱地址'),
    body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('消息长度应在10-1000字符之间')
];

// 联系表单提交API
app.post('/api/contact', limiter, contactValidation, async (req, res) => {
    try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '输入验证失败',
                errors: errors.array()
            });
        }

        const { name, email, phone, message } = req.body;

        // 邮件内容
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'a374340761@gmail.com', // 公司邮箱
            subject: `网站联系表单 - 来自 ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e3c72;">新的联系表单提交</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>姓名:</strong> ${name}</p>
                        <p><strong>邮箱:</strong> ${email}</p>
                        <p><strong>电话:</strong> ${phone || '未提供'}</p>
                        <p><strong>消息:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        此邮件来自广西伟群帐篷制造有限公司网站联系表单
                    </p>
                </div>
            `,
            replyTo: email
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);

        // 发送确认邮件给客户
        const confirmationMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '感谢您的咨询 - 广西伟群帐篷制造有限公司',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; font-size: 24px;">广西伟群帐篷制造有限公司</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">专业户外家具制造商</p>
                    </div>
                    <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #1e3c72;">感谢您的咨询！</h2>
                        <p>亲爱的 ${name}，</p>
                        <p>我们已收到您的咨询信息，我们的专业团队将在24小时内与您联系。</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #1e3c72; margin-top: 0;">您的咨询内容：</h3>
                            <p style="white-space: pre-line;">${message}</p>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #1e3c72; margin-top: 0;">联系方式：</h4>
                            <p><strong>电话:</strong> +86 183 7878 1011</p>
                            <p><strong>邮箱:</strong> a374340761@gmail.com</p>
                            <p><strong>地址:</strong> 2nd Xuweiqian Building, Bridge South xilian Dong Cun Gaosha Development District, Nanhai Danzao, Foshan, China</p>
                        </div>
                        
                        <p>如有紧急需求，请直接致电我们。</p>
                        <p>再次感谢您选择广西伟群帐篷制造有限公司！</p>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                此邮件由系统自动发送，请勿直接回复
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(confirmationMail);

        res.json({
            success: true,
            message: '消息发送成功！我们将在24小时内与您联系。'
        });

    } catch (error) {
        console.error('邮件发送失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，请稍后重试'
        });
    }
});

// 健康检查API
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '服务器运行正常',
        timestamp: new Date().toISOString()
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
