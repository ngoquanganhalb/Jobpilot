class TokenManager {
  private _accessToken: string | null = null;

  getAccessToken() {
    return this._accessToken;
  }

  setAccessToken(token: string | null) {
    this._accessToken = token;
  }

  clear() {
    this._accessToken = null;
  }
}

export const tokenManager = new TokenManager();
