interface EmailTemplateProps {
    url: string;
    host: string;
}

export default function emailTemplate({ url, host }: EmailTemplateProps) {
    return `
        <body>
            <h1>Welcome to ${host}</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${url}">Verify Email Address</a>
            <p>If you didn't request this email, you can safely ignore it.</p>
        </body>
    `;
}