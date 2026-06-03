<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h2 {
            color: #007bff;
            font-size: 20px;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666666;
            background-color: #f1f1f1;
        }
        .highlight {
            color: #007bff;
            font-weight: bold;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
    <title></title>
</head>
<body>
<div class="email-container">
    <!-- Header Section -->
    <div class="email-header">
        <h1>🎁 Gift Notification</h1>
    </div>

    <!-- Body Section -->
    <div class="email-body">
        <p>Hello,</p>

        <p>You have received a <span class="highlight">{{ $data["gift_name"] }}</span> from <span class="highlight">{{ $data['sender_username'] }}</span>.</p>

        <h2>Sender Details:</h2>
        <ul>
            <li><strong>Username:</strong> {{ $data["sender_username"] }}</li>
            <li><strong>Chat with {{ $data["sender_username"] }}:</strong> <a href="{{ $data["sender_chatify_link"] }}">link</a></li>
        </ul>

        <p>We hope you enjoy your gifts! If you have any questions, feel free to <a href="{{ route('connect-with-us.index') }}">contact support</a>.</p>

        <p>Thank you for being part of our community!</p>
    </div>

    <!-- Footer Section -->
    <div class="email-footer">
        <p>© {{date("Y")}} OneStoryPlanet. All rights reserved.</p>
    </div>
</div>
</body>
</html>
