export default async function sendVerificationRequest(params) {
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
    
    // Unicent color scheme based on the image
    const color = {
      background: "#f8f9fc",
      text: "#0a1f44",
      mainBackground: "#ffffff",
      buttonBackground: "#0a1f44",
      buttonBorder: "#0a1f44",
      buttonText: "#ffffff",
      secondaryText: "#64748b"
    }

    return `
    <body style="background: ${color.background}; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table style="background: ${color.mainBackground}; max-width: 600px; width: 100%; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Logo Section -->
              <tr>
                <td align="center" style="padding: 40px 0 20px;">
                  <table>
                    <tr>
                      <td>
                        <span style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 36px; font-weight: 700; color: ${color.text};">
                          UC
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <span style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 14px; color: ${color.secondaryText};">
                          Elevate Your Future
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content Section -->
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <h1 style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 24px; font-weight: 600; color: ${color.text}; margin: 0 0 20px;">
                    Sign in to continue
                  </h1>
                  <p style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 16px; line-height: 24px; color: ${color.secondaryText}; margin: 0 0 30px;">
                    Click the button below to sign in to your account at ${escapedHost}
                  </p>
                </td>
              </tr>

              <!-- Button Section -->
              <tr>
                <td align="center" style="padding: 0 40px 40px;">
                  <a href="${url}" target="_blank" style="background: ${color.buttonBackground}; border-radius: 8px; color: ${color.buttonText}; display: inline-block; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 16px; font-weight: 500; line-height: 24px; padding: 12px 24px; text-decoration: none;">
                    Sign in to Unicent
                  </a>
                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                  <p style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 14px; line-height: 24px; color: ${color.secondaryText}; margin: 0;">
                    If you did not request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    `
}
   
  // Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
  function text({ url, host }: { url: string; host: string }) {
    return `Sign in to ${host}\n${url}\n\n`
  }