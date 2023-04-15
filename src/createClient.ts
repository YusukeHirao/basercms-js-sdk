import { AdminClient, CreateAdminClientOptions } from "./AdminClient";
import { Client, CreateClientOptions } from "./Client";

export async function createClient(options: CreateClientOptions) {
  return await Client.create(options);
}

export async function createAdminClient(options: CreateAdminClientOptions) {
  return await AdminClient.create(options);
}
