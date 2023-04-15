import axios from "axios";
import https from "https";
import { Content, Page, Site } from "./types";

export type CreateClientOptions = {
  domain: string;
  rejectUnauthorized?: false;
};

export class Client {
  #domain: string;
  #rejectUnauthorized: boolean;

  static async create(options: CreateClientOptions) {
    const client = new Client(options.domain, !!options.rejectUnauthorized);
    return client;
  }

  protected constructor(domain: string, rejectUnauthorized?: boolean) {
    this.#domain = domain;
    this.#rejectUnauthorized = rejectUnauthorized ?? true;
  }

  async request<T>(
    api: `/${string}`,
    params?: Record<string, unknown>,
    method = "GET",
    token?: string
  ): Promise<T> {
    const res = await axios<T>({
      url: `${this.#domain}${api}`,
      headers: token
        ? {
            Authorization: token,
          }
        : undefined,
      method,
      httpsAgent: new https.Agent({
        rejectUnauthorized: this.#rejectUnauthorized,
      }),
      data: params,
    });

    return res.data;
  }

  /**
   * コンテンツ一覧の取得
   *
   * コンテンツ情報の一覧を取得します。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/index
   *
   * @todo 未解決 https://github.com/baserproject/baserproject.github.io/issues/31
   */
  async getContents(params?: {
    /**
     * 通常一覧、もしくはツリー構造
     *
     * @default "index"
     */
    list_type?: "index" | "tree";

    /**
     * 取得件数
     */
    limit?: number;

    /**
     * ページ数
     */
    page?: number;

    /**
     * コンテンツID
     */
    id?: number;

    /**
     * コンテンツタイプ
     */
    type?: string;

    /**
     * 親のコンテンツID
     */
    parent_id?: number;

    /**
     * 作成者のユーザーID
     */
    author_id?: number;

    /**
     * サイトID
     */
    site_id?: number;

    /**
     * コンテンツのタイトル（ワイルドカード）
     */
    title?: string;

    /**
     * URL上のファイル名、もしくは、タイトル（ワイルドカード）
     */
    name?: string;

    /**
     * 有効なコンテンツのみ、もしくは全て
     */
    status?: "publish" | "all";

    /**
     * 指定したコンテンツID配下のコンテンツを全て取得
     */
    folder_id?: boolean;
  }) {
    const api = "/baser/api/baser-core/contents.json" as const;
    const res = await this.request<{
      contents: Content[];
    }>(api, params);
    return res.contents;
  }

  /**
   * コンテンツ情報の取得
   *
   * コンテンツ情報を取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/view
   */
  async getContent(contentId: number) {
    const api = `/baser/api/baser-core/contents/${contentId}.json` as const;
    const res = await this.request<{
      content: Content & {
        site: Site;
        message: string | null; // Error?
      };
    }>(api, {
      contentId,
    });
    return res.content;
  }

  /**
   * 固定ページ一覧の取得
   *
   * 固定ページ情報の一覧を取得します。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/pages/index
   */
  async getPages(params?: {
    /**
     * 有効なコンテンツのみ、もしくは全て
     */
    status?: "publish" | "all";

    /**
     * 取得件数
     */
    limit?: number;

    /**
     * ページ数
     */
    page?: number;

    /**
     * 本文（あいまい検索）
     */
    contents?: string;

    /**
     * 草稿（あいまい検索）
     */
    draft?: string;
  }) {
    const api = "/baser/api/baser-core/pages.json" as const;
    const res = await this.request<{
      pages: Page[];
    }>(api, params);
    return res.pages;
  }
}
