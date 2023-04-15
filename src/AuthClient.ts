import { AuthenticationError } from "./AuthenticationError";
import axios from "axios";
import https from "https";

const WEB_API_PATH_LOGIN = "/baser/api/admin/baser-core/users/login.json";

export type AuthClientOptions = {
  email: string;
  password: string;
  rejectUnauthorized?: boolean;
};

export class AuthClient {
  readonly #email: string;
  readonly #password: string;
  #rejectUnauthorized: boolean;
  #accessToken: string | null = null;
  //   #refreshToken: string;

  constructor(options: AuthClientOptions) {
    this.#email = options.email.trim();
    this.#password = options.password.trim();
    this.#rejectUnauthorized = options.rejectUnauthorized ?? true;
  }

  async login(domain: string) {
    const res = await axios<{
      access_token: string;
      refresh_token: string;
    }>({
      url: `${domain}${WEB_API_PATH_LOGIN}`,
      method: "POST",
      httpsAgent: new https.Agent({
        rejectUnauthorized: this.#rejectUnauthorized,
      }),
      data: {
        email: this.#email,
        password: this.#password,
      },
    }).catch((error) => {
      if (error?.response?.status === 401) {
        throw new AuthenticationError(
          "アカウント名、パスワードが間違っています。"
        );
      }
      throw error;
    });

    this.#accessToken = res.data.access_token;
    // this.#refreshToken = res.data.refresh_token;
  }

  get token() {
    if (this.#accessToken == null) {
      throw new AuthenticationError(
        "認証が済んでいません。ログインしてください。"
      );
    }
    return this.#accessToken;
  }
}
