export const verifyWithOtp = (title, otp)=>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #341539;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border: 1px solid #d4d9e1;
        }
        .email-header {
            background-color: #341539;
            color: #ffffff;
            text-align: center;
            padding: 40px 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .email-body {
            padding: 30px 20px;
            line-height: 1.7;
            font-size: 16px;
        }
        .email-body h2 {
            color: #341539;
            margin-bottom: 15px;
            font-size: 22px;
        }
        .verify-button {
            display: block;
            width: 240px;
            background-color: #5a3e63;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 0;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            margin: 25px auto;
            text-align: center;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 8px rgba(90, 62, 99, 0.3);
        }
        .verify-button:hover {
            background-color: #50204a;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            background: #f5eefb;
            color: #5a3e63;
        }
        .email-footer p {
            margin: 8px 0;
        }
        .email-footer a {
            color: #3a5391;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
    <title>${title}</title>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${title}</h1>
        </div>
        <div class="email-body">
            <h2>Welcome</h2>
            <p>We are thrilled to have you on board. To get started, please confirm your email address by clicking the button below:</p>
            <a class="verify-button">${otp}</a>
            <p>If you didn’t create an account with us, please disregard this email.</p>
            <p>Best Regards,<br>Social-Media Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 Social-Media. All rights reserved.</p>
            <p>Need help? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
` 


export const verifyNewMail = (verificationLink,title)=>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #341539;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border: 1px solid #d4d9e1;
        }
        .email-header {
            background-color: #341539;
            color: #ffffff;
            text-align: center;
            padding: 40px 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .email-body {
            padding: 30px 20px;
            line-height: 1.7;
            font-size: 16px;
        }
        .email-body h2 {
            color: #341539;
            margin-bottom: 15px;
            font-size: 22px;
        }
        .verify-button {
            display: block;
            width: 240px;
            background-color: #5a3e63;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 0;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            margin: 25px auto;
            text-align: center;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 8px rgba(90, 62, 99, 0.3);
        }
        .verify-button:hover {
            background-color: #50204a;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            background: #f5eefb;
            color: #5a3e63;
        }
        .email-footer p {
            margin: 8px 0;
        }
        .email-footer a {
            color: #3a5391;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
    <title>${title}</title>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${title}</h1>
        </div>
        <div class="email-body">
            <h2>Welcome</h2>
            <p>We are thrilled to have you on board. To get started, please confirm your email address by clicking the button below:</p>
            <a href=${verificationLink} class="verify-button">Verify New Email</a>
            <p>If you didn’t create an account with us, please disregard this email.</p>
            <p>Best Regards,<br>Social-Media Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 Social-Media. All rights reserved.</p>
            <p>Need help? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
` 


export const acceptRejectApp = (title,status)=>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #341539;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border: 1px solid #d4d9e1;
        }
        .email-header {
            background-color: #341539;
            color: #ffffff;
            text-align: center;
            padding: 40px 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .email-body {
            padding: 30px 20px;
            line-height: 1.7;
            font-size: 16px;
        }
        .email-body h2 {
            color: #341539;
            margin-bottom: 15px;
            font-size: 22px;
        }
        .verify-button {
            display: block;
            width: 240px;
            background-color: #5a3e63;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 0;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            margin: 25px auto;
            text-align: center;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 8px rgba(90, 62, 99, 0.3);
        }
        .verify-button:hover {
            background-color: #50204a;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            background: #f5eefb;
            color: #5a3e63;
        }
        .email-footer p {
            margin: 8px 0;
        }
        .email-footer a {
            color: #3a5391;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
    <title>${title}</title>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${title}</h1>
        </div>
        <div class="email-body">
            <h2>Welcome</h2>
            <p>We are thrilled to inform you that you are ${status} at our company</p>

        </div>
        <div class="email-footer">
            <p>&copy; 2025 Social-Media. All rights reserved.</p>
            <p>Need help? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
` 