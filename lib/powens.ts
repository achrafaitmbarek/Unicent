
interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}
export class PowensClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.baseUrl = process.env.POWENS_BASE_URL || 'https://unicenttest-sandbox.biapi.pro';
    this.clientId = process.env.POWENS_CLIENT_ID || '8882462';
    this.clientSecret = process.env.POWENS_CLIENT_SECRET || 't_9m92iPWr2n1qjsa_gngtrrqwvwOFD7';
    this.redirectUri = process.env.POWENS_REDIRECT_URI || 'http://localhost:3000/api/banks/callback';
  }

  getConnectUrl(): string {
    return `https://webview.powens.com/connect?domain=unicenttest-sandbox.biapi.pro&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
  }

  async exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/2.0/auth/token/access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to exchange code: ${errorData.error || response.statusText}`);
    }

    return response.json();
  }

  async fetchAccounts(accessToken: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/2.0/users/me/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch accounts: ${errorData.error || response.statusText}`);
    }

    return response.json();
  }
}

const powensClient = new PowensClient();
export default powensClient;