interface Theme {
  colorScheme?: "auto" | "dark" | "light"
  logo?: string
  brandColor?: string
  buttonText?: string
}

export function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  // Updated color scheme to match UC Wealth design system
  const brandColor = theme.brandColor || "#0A1A33" // Dark navy from UI
  const buttonText = theme.buttonText || "#FFFFFF"

  const color = {
    background: "#F8F9FB", // Light gray background
    text: "#0A1A33", // Dark navy for text
    mainBackground: "#FFFFFF",
    buttonBackground: brandColor,
    buttonBorder: "transparent",
    buttonText,
    secondaryText: "#666666",
    accent: "#4CAF50", // Green from the UI charts
    border: "#E5E7EB"
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="background: ${color.background}; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; width: 100%; background-color: ${color.background}; padding: 48px 24px;">
    <tr>
      <td style="font-family: 'Inter', sans-serif; font-size: 16px; vertical-align: top;">&nbsp;</td>
      <td style="font-family: 'Inter', sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0;">
        <div style="box-sizing: border-box; max-width: 600px; margin: 0 auto; padding: 48px; background: ${color.mainBackground}; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
          <!-- Logo -->
          <div style="text-align: left; margin-bottom: 40px;">
            <img src="https://i.ibb.co/VH8nnPj/Marketing-Logo.png" alt="UC Wealth" style="max-width: 120px; height: auto;"/>
          </div>

          <!-- Title -->
          <h1 style="margin: 0 0 24px; font-family: 'Inter', sans-serif; font-size: 30px; font-weight: 700; color: ${color.text}; letter-spacing: -0.5px;">
            Welcome to UC Wealth
          </h1>

          <!-- Subtitle -->
          <p style="margin: 0 0 32px; color: ${color.secondaryText}; font-size: 16px; line-height: 24px;">
            Your AI-powered financial management platform is ready. Click below to access your account.
          </p>

          <!-- Button -->
          <div style="margin: 32px 0;">
            <a href="${url}" style="background: ${color.buttonBackground}; border-radius: 12px; color: ${color.buttonText}; display: inline-block; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; line-height: 1; padding: 20px 32px; text-decoration: none; text-align: center; transition: all 0.2s ease; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Access Your Dashboard
            </a>
          </div>

          <!-- Features Grid -->
          <div style="margin: 40px 0; padding: 32px; background: ${color.background}; border-radius: 12px;">
            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px; color: ${color.text}; font-size: 18px; font-weight: 600;">What's included:</h3>
            </div>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;">
                  <p style="margin: 0; color: ${color.text}; font-size: 15px;">✓ Smart Financial Planning</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <p style="margin: 0; color: ${color.text}; font-size: 15px;">✓ Real-Time Budget Tracking</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <p style="margin: 0; color: ${color.text}; font-size: 15px;">✓ Intelligent Savings Assistant</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <p style="margin: 0; color: ${color.text}; font-size: 15px;">✓ Bank Integration</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- Security Notice -->
          <div style="margin-top: 32px; padding: 24px; background: ${color.background}; border-radius: 12px; border-left: 4px solid ${color.accent};">
            <p style="margin: 0; color: ${color.secondaryText}; font-size: 14px; line-height: 1.5;">
              For your security: If you didn't request this email, please ignore it or contact support@${escapedHost}
            </p>
          </div>

          <!-- Footer -->
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid ${color.border};">
            <p style="margin: 0; color: ${color.secondaryText}; font-size: 13px; line-height: 1.5; text-align: center;">
              © 2024 UC Wealth. All rights reserved.<br/>
              Sent by UC Wealth · AI-Powered Budget Management
            </p>
          </div>
        </div>
      </td>
      <td style="font-family: 'Inter', sans-serif; font-size: 16px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
`
}

export function text({ url, host }: { url: string; host: string }) {
  return `
Welcome to UC Wealth!

Your AI-powered financial management platform is ready. Access your dashboard here:
${url}

What's included:
- Smart Financial Planning
- Real-Time Budget Tracking
- Intelligent Savings Assistant
- Bank Integration

For your security: If you didn't request this email, please ignore it or contact support@${host}

© 2024 UC Wealth. All rights reserved.
`
}