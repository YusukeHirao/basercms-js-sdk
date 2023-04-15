const { createClient } = require("../lib/createClient");

describe("コンテンツ取得", () => {
  test("getContents", async () => {
    const client = await createClient({
      domain: "https://localhost",
    });

    const contents = await client.getContents();

    expect(contents.length).toBe(9);
  });

  test("getContent", async () => {
    const client = await createClient({
      domain: "https://localhost",
    });

    const content = await client.getContent(5);

    expect(content).toStrictEqual({
      alias_id: null,
      author_id: 1,
      blank_link: false,
      created: "2023-04-15T14:24:49+09:00",
      created_date: "2023-04-15T14:27:31+09:00",
      deleted_date: null,
      description: "",
      entity_id: 2,
      exclude_menu: false,
      exclude_search: false,
      eyecatch: "",
      id: 5,
      layout_template: "",
      level: 1,
      lft: 6,
      main_site_content_id: null,
      modified: "2023-04-15T14:27:31+09:00",
      modified_date: null,
      name: "about",
      parent_id: 1,
      plugin: "BaserCore",
      publish_begin: null,
      publish_end: null,
      rght: 7,
      self_publish_begin: null,
      self_publish_end: null,
      self_status: true,
      site: {
        alias: "",
        auto_link: false,
        auto_redirect: false,
        created: "2023-04-15T14:24:49+09:00",
        description: "",
        device: "",
        display_name: "js-sdk",
        domain_type: null,
        id: 1,
        keyword: "",
        lang: "",
        main_site_id: null,
        modified: "2023-04-15T14:27:30+09:00",
        name: "",
        relate_main_site: false,
        same_main_url: false,
        status: true,
        theme: "BcThemeSample",
        title: "js-sdk",
        use_subdomain: false,
      },
      site_id: 1,
      site_root: false,
      status: true,
      title: "会社案内",
      type: "Page",
      url: "/about",
    });
  });
});
