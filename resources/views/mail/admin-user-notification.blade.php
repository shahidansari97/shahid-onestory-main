<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>OneStoryPlanet Email</title>
</head>

<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:Arial, Helvetica, sans-serif;">
    <!-- @if ($action === 'creator_upgraded')
        <h2>User Upgraded to Creator</h2>
    @elseif ($action === 'creator_registered')
        <h2>New Creator Registration</h2>
    @else
        <h2>New User Registration</h2>
    @endif -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f2f2;padding:20px 0;">
        <tr>
            <td align="center">

                <!-- MAIN CONTAINER -->
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background:#ffffff;border-radius:6px;overflow:hidden;">

                    <!-- HEADER -->
                    <tr>
                        <td align="center" style="background: linear-gradient(90deg, #8B7AB8 0%, #A599C8 100%);padding:40px 20px;">
                            <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:bold;">
                                Welcome to OneStoryPlanet
                            </h1>

                            <p style="color:#eae6f5;margin-top:10px;font-size:16px;">
                                Where Real Stories Connect Real People
                            </p>
                        </td>
                    </tr>

                    <!-- BODY CONTENT -->
                    <tr>
                        <td style="padding:35px 40px;color:#333333;font-size:15px;line-height:1.6;">

                            <p style="margin-top:0; font-size:15px; line-height:22px;">
                                Hi there!
                            </p>

                            <p>
                                Thank you for joining OneStoryPlanet! We're excited to have you as 
								part of our community that values authentic, meaningful storytelling
								over clickbait and viral content.
                            </p>

                            <p style="margin-bottom: 0px;">
                               Here, you'll discover real stories from real people moments of
							   vulnerability, personal experiences, and genuine human connections
							   that matter. Every story you engage with helps support creators
							   who are sharing their authentic voices with the world.
                            </p>

                            <!-- <p style="margin-top: 0px;">
                                Remember, we pay
                                <strong style="color:#8b7bb8;">$7,000 per million paid views</strong>
                                the highest rate in the world for quality storytelling.
                            </p> -->

                            <!-- BUTTON -->
                            <table cellpadding="0" cellspacing="0" border="0" align="center"
                                style="margin-top:25px;margin-bottom:20px;">
                                <tr>
                                    <td align="center" style="background:#ffda75;border-radius:10px;">
                                        <a href="{{ $url  }}"
                                            style="display:inline-block;padding:14px 30px;font-size:16px;color:#000000;text-decoration:none;font-weight:bold;">
                                            Start Exploring Stories →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border:none;border-top:1px solid #e5e5e5;margin:30px 0;">

                        </td>
                    </tr>

                    <!-- SECOND SECTION -->
                                        <tr>
    <td style="background:#f1eef8;padding:35px 40px;font-family:Arial, Helvetica, sans-serif;">

        <h2 style="margin:0 0 25px 0;color:#6f62a6;font-size:22px;font-weight:600;">
            What You Can Do on OneStoryPlanet
        </h2>

        <p style="margin:0 0 6px 0;font-size:18px;color:#000000;font-weight:bold;">
            Discover Authentic Stories
        </p>

        <p style="margin:0 0 20px 0;color:#444444;font-size:15px;line-height:1.6;">
            Explore meaningful narratives from creators around the world who share real experiences and emotions.
        </p>

        <p style="margin:0 0 6px 0;font-size:18px;color:#000000;font-weight:bold;">
            Connect &amp; Engage
        </p>

        <p style="margin:0 0 20px 0;color:#444444;font-size:15px;line-height:1.6;">
            Share your thoughts, feelings, and reactions. Your engagement helps creators thrive.
        </p>

        <p style="margin:0 0 6px 0;font-size:18px;color:#000000;font-weight:bold;">
            Be Part of the Conversation
        </p>

        <p style="margin:0 0 30px 0;color:#444444;font-size:15px;line-height:1.6;">
            React to trending topics and share what's on your mind with our global community.
        </p>

        <!-- BUTTON -->
        <table cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
                <td align="center" style="background:#7a6bb3;border-radius:10px;">
                    <!-- <a href="{{ $url . '/trigger-video-editor' }}" -->
                    <a href="{{ $url . '/trigger-video-editor' }}" 
                        style="display:inline-block;padding:14px 32px;font-size:16px;color:#ffffff;text-decoration:none;font-weight:bold;">
                        Share Your First Story
                    </a>
                </td>
            </tr>
        </table>

    </td>
</tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="padding:25px 30px;color:#777777;font-size:13px;line-height:1.6;">

                            <p style="margin:5px 0;">
                                Need help or have questions? We're here for you.
                            </p>

                            <p style="margin:5px 0;color:#6f62a6;">

                                {{ $your_email }}
                            </p>

                            <p style="margin:10px 0;">
                                © 2026 OneStoryPlanet.
                            </p>

                            <p style="font-size:12px;color:#999999;">
                                Empowering authentic storytelling, one story at a time.
                            </p>

                        

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
