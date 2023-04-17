import axios from "axios";
import https from "https";
import {
  BlogContent,
  BlogPost,
  Content,
  ContentFolder,
  Page,
  PageDetail,
  SearchIndex,
  Site,
} from "./types";

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
   * 次のコンテンツの取得
   *
   * 次のコンテンツを取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/get_next
   */
  async getNextContent(contentId: number) {
    const api =
      `/baser/api/baser-core/contents/get_next/${contentId}.json` as const;
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
   * 前のコンテンツの取得
   *
   * 前のコンテンツを取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/get_prev
   */
  async getPrevContent(contentId: number) {
    const api =
      `/baser/api/baser-core/contents/get_prev/${contentId}.json` as const;
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
   * グローバルナビ用のコンテンツ一覧の取得
   *
   * グローバルナビ用のコンテンツ一覧を取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/get_global_navi
   */
  async getGlobalNavi(contentId: number) {
    const api =
      `/baser/api/baser-core/contents/get_global_navi/${contentId}.json` as const;
    const res = await this.request<{
      contents: Content[];
    }>(api, {
      contentId,
    });
    return res.contents;
  }

  /**
   * パンくず用のコンテンツ一覧の取得
   *
   * パンくず用のコンテンツ一覧を取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/get_crumbs
   */
  async getCrumbs(contentId: number) {
    const api =
      `/baser/api/baser-core/contents/get_crumbs/${contentId}.json` as const;
    const res = await this.request<{
      contents: Content[];
    }>(api, {
      contentId,
    });
    return res.contents;
  }

  /**
   * ローカルナビ用のコンテンツ一覧の取得
   *
   * ローカルナビ用のコンテンツ一覧を取得します。
   *
   * @param contentId コンテンツのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/contents/get_local_navi
   */
  async getLocalNavi(contentId: number) {
    const api =
      `/baser/api/baser-core/contents/get_local_navi/${contentId}.json` as const;
    const res = await this.request<{
      contents: Content[];
    }>(api, {
      contentId,
    });
    return res.contents;
  }

  /**
   * コンテンツフォルダー情報の取得
   *
   * コンテンツフォルダー情報を取得します。
   *
   * @param contentFolderId コンテンツフォルダーのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/content_folders/view
   */
  async getContentFolder(contentFolderId: number) {
    const api =
      `/baser/api/baser-core/content_folders/${contentFolderId}.json` as const;
    const res = await this.request<{
      contentFolder: ContentFolder;
      message: string | null; // Error?
    }>(api, {
      contentFolderId,
    });
    return res.contentFolder;
  }

  /**
   * コンテンツフォルダー一覧の取得
   *
   * コンテンツフォルダー情報の一覧を取得します。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/content_folders/index
   */
  async getContentFolders(params?: {
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
     * フォルダーテンプレート（あいまい検索）
     */
    folder_template?: string;

    /**
     * ページテンプレート（あいまい検索）
     */
    page_template?: string;
  }) {
    const api = `/baser/api/baser-core/content_folders.json` as const;
    const res = await this.request<{
      contentFolders: ContentFolder[];
    }>(api, params);
    return res.contentFolders;
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

  /**
   * 固定ページ情報の取得
   *
   * 固定ページ情報を取得します。
   *
   * @param pageId 固定ページのID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/baser-core/pages/view
   */
  async getPage(pageId: number) {
    const api = `/baser/api/baser-core/pages/${pageId}.json` as const;
    const res = await this.request<{
      page: PageDetail;
      content: Content & {
        site: Site;
      };
    }>(api, {
      pageId,
    });
    return res.page;
  }

  /**
   * 検索インデックスの一覧取得
   *
   * 検索インデックス一覧を表示します。
   * タイプ、サイト、フォルダ、キーワード、公開状態、優先度で検索ができます。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/bc-search-index/search_indexes/index
   */
  async getSearchIndexes(params?: {
    /**
     * 検索キーワード
     */
    q: string;

    /**
     * サイトID
     */
    s: number;

    /**
     * コンテンツID
     */
    c: number;

    /**
     * フォルダID
     */
    f: number;

    /**
     * コンテンツフィルダーID
     */
    cf: number;

    /**
     * コンテンツタイプ
     */
    type: string;

    /**
     * モデル名（エンティティ名）
     */
    m: string;

    /**
     * 優先度
     */
    priority: string;
  }) {
    const api = "/baser/api/bc-search-index/search_indexes.json" as const;
    const res = await this.request<{
      searchIndexes: SearchIndex[];
    }>(api, params);
    return res.searchIndexes;
  }

  /**
   * ブログ記事の一覧取得
   *
   * ブログ記事の一覧を表示します。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/bc-blog/blog_contents/index
   */
  async getBlogContents(params?: {
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
     * ブログ説明文（あいまい検索）
     */
    description?: string;
  }) {
    const api = "/baser/api/bc-blog/blog_contents.json" as const;
    const res = await this.request<{
      blogContents: BlogContent[];
    }>(api, params);
    return res.blogContents;
  }

  /**
   * ブログコンテンツの単一取得
   *
   * 指定したブログコンテンツを取得します。
   *
   * @param blogContentId ブログコンテンツID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/bc-blog/blog_contents/view
   */
  async getBlogContent(blogContentId: number) {
    const api =
      `/baser/api/bc-blog/blog_contents/${blogContentId}.json` as const;
    const res = await this.request<{
      blogContent: BlogContent;
    }>(api, {
      blogContentId,
    });
    return res.blogContent;
  }

  /**
   * ブログ記事一覧の取得
   *
   * ブログ記事の一覧を取得します。
   *
   * @param params パラメータ
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/bc-blog/blog_posts/index
   */
  async getBlogPosts(params?: {
    /**
     * 有効な記事のみ、もしくは全て
     */
    status?: "publish" | "all";

    /**
     * 取得件数
     */
    limit?: number;

    /**
     * ソートに使用する属性名
     *
     * @default "posted"
     */
    order?: string;

    /**
     * ソートの方向 asc or desc
     *
     * @default "desc"
     */
    direction?: "asc" | "desc";

    /**
     * ブログ記事ID
     */
    id?: number;

    /**
     * ブログ記事NO
     */
    no?: number;

    /**
     * タイトル（あいまい検索）
     */
    title?: string;

    /**
     * 作成者のユーザーID
     */
    user_id?: number;

    /**
     * ブログコンテンツID
     */
    blog_content_id?: number;

    /**
     * サイトID
     */
    site_id?: number;

    /**
     * URL
     */
    contentUrl?: string;

    /**
     * ブログタグID
     */
    blog_tag_id?: number;

    /**
     * ブログカテゴリID
     */
    blog_category_id?: number;

    /**
     * ブログカテゴリ名
     */
    category?: string;

    /**
     * ブログタグ名
     */
    tag?: string;

    /**
     * 作成年
     */
    year?: string;

    /**
     * 作成月
     */
    month?: string;

    /**
     * 作成日にち
     */
    day?: string;

    /**
     * タイトル、概要、詳細より検索をするための文字列を指定（あいまい検索）
     */
    keyword?: string;

    /**
     * 作成者のログインアカウント名
     */
    author?: string;
  }) {
    const api = `/baser/api/bc-blog/blog_posts.json` as const;
    const res = await this.request<{
      blogPosts: BlogPost[];
    }>(api, params);
    return res.blogPosts;
  }

  /**
   * ブログ記事の単一取得
   *
   * 指定したブログ記事を取得します。
   *
   * @param blogPostId ブログ記事ID
   *
   * @see https://baserproject.github.io/5/web_api/baser_api/bc-blog/blog_posts/view
   */
  async getBlogPost(blogPostId: number) {
    const api = `/baser/api/bc-blog/blog_posts/${blogPostId}.json` as const;
    const res = await this.request<{
      blogPost: BlogPost;
    }>(api, {
      blogPostId,
    });
    return res.blogPost;
  }
}
