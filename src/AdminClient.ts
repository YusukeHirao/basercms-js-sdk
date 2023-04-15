import { Client, CreateClientOptions } from "./Client";
import { AuthClient, AuthClientOptions } from "./AuthClient";

export type CreateAdminClientOptions = CreateClientOptions & AuthClientOptions;

export class AdminClient extends Client {
  #auth: AuthClient;

  static async create(options: CreateAdminClientOptions) {
    const auth = new AuthClient(options);
    await auth.login(options.domain);

    const client = new AdminClient(
      options.domain,
      options.rejectUnauthorized,
      auth
    );

    return client;
  }

  protected constructor(
    domain: string,
    rejectUnauthorized: boolean | undefined,
    auth: AuthClient
  ) {
    super(domain, rejectUnauthorized);
    this.#auth = auth;
  }

  get token() {
    return this.#auth.token;
  }
}
