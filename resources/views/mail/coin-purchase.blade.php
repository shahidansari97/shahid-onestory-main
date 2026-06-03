<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coin Purchase Confirmation</title>
</head>
<body>
    <h2>Hello {{ $userName }},</h2>

    <p>Thank you for purchasing coins!</p>

    <p>Here are your purchase details:</p>
    <ul>
        <li><strong>Purchased Coins:</strong> {{ $coins }}</li>
        <li><strong>Amount Spent:</strong> ${{ number_format($amount, 2) }}</li>
        <li><strong>Purchase Date:</strong> {{ $date }}</li>
    </ul>

    <p>Enjoy your new coins! 🎉</p>

    <p>OneStory Planet Team</p>
</body>
</html>
