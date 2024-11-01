import logo from "@/assets/Algarve.png"
export async function sendVerificationRequest(params) {
  const { identifier: to, provider, url, theme } = params
  const { host } = new URL(url)
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      html: html({ url, host, theme }),
      text: text({ url, host }),
    }),
  })
 
  if (!res.ok)
    throw new Error("Resend error: " + JSON.stringify(await res.json()))
}
 
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params
 
  const escapedHost = host.replace(/\./g, "&#8203;.")
 
  const brandColor = theme.brandColor || "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }
 
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LuxeHomeGarve - Administrative Access Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #F5F5F5;
      margin: 0;
      padding: 60px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%), url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise" x="0" y="0"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3CfeBlend mode="overlay"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)"/%3E%3C/svg%3E');
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      padding: 40px 20px;
    }
    .logo {
      text-align: center;
      padding-bottom: 30px;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: #FFFFFF;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-align: center;
      padding-bottom: 30px;
    }
    .description {
      font-size: 16px;
      line-height: 24px;
      color: #E0E0E0;
      text-align: center;
      padding: 0 40px 30px;
    }
    .button {
      text-align: center;
      padding: 10px 0 40px;
    }
    .button a {
      background-color: #FFFFFF;
      color: #000000;
      font-size: 16px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 8px;
      padding: 16px 40px;
      display: inline-block;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: background-color 0.2s;
    }
    .button a:hover {
      background-color: #F0F0F0;
    }
    .footer {
      font-size: 14px;
      line-height: 24px;
      color: #A0A0A0;
      text-align: center;
      padding: 30px 40px 0;
      border-top: 1px solid #333333;
    }
    .copyright {
      font-size: 12px;
      color: #808080;
      padding: 20px 40px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://i.ibb.co/fksMnpz/Frame-14.png" alt="LuxeHomeGarve"
    </div>
    <h1 class="title">Administrative Access Verification</h1>
    <p class="description">
      Please verify your identity to access the administrative portal of LuxeHomeGarve. This link will expire in 24 hours.
    </p>
    <div class="button">
      <a href="${url}" target="_blank">Verify Access</a>
    </div>
    <div class="footer">
      For security purposes, if you did not request this verification, please contact the IT department immediately.
    </div>
    <div class="copyright">
      © 2024 LuxeHomeGarve. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}
 

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}