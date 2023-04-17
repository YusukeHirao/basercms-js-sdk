export type Content = {
  id: number;
  name: string;
  plugin: "BaserCore";
  type: ContentType;
  entity_id: number;
  url: string;
  site_id: number;
  alias_id: number | null;
  main_site_content_id: number | null;
  parent_id: number | null;
  lft: number;
  rght: number;
  level: number | null;
  title: string;
  description: string;
  eyecatch: string;
  author_id: number;
  layout_template: string;
  status: boolean;
  publish_begin: null; //?
  publish_end: null; //?
  self_status: boolean;
  self_publish_begin: null; //?
  self_publish_end: null; //?
  exclude_search: boolean;
  created_date: string; //Date
  modified_date: string | null; //Date
  site_root: boolean;
  deleted_date: string | null; //Date
  exclude_menu: boolean;
  blank_link: boolean;
  created: string; //Date
  modified: string; //Date
};

export type ContentType =
  | "ContentFolder"
  | "Page"
  | "BlogContent"
  | "MailContent";

export type Site = {
  id: number;
  main_site_id: number | null;
  name: string;
  display_name: string;
  title: string;
  alias: string;
  theme: string;
  status: boolean;
  keyword: string;
  description: string;
  use_subdomain: boolean;
  relate_main_site: boolean;
  device: string;
  lang: string;
  same_main_url: boolean;
  auto_redirect: boolean;
  auto_link: boolean;
  domain_type: null; // ?
  created: string; // Date
  modified: string; // Date
};

export type ContentFolder = {
  id: number;
  folder_template: string;
  page_template: string;
  created: string; // Date
  modified: string | null; // Date
  content: Content;
};

export type ContentFolderDetail = ContentFolder & {
  content: Content & {
    site: Site;
  };
};

export type Page = {
  id: number;
  contents: string;
  draft: string; // ?
  page_template: string;
  modified: string; // Date
  created: string; // Date
};

export type PageDetail = Page & {
  content: Content & {
    site: Site;
  };
};

export type SearchIndex = {
  id: number;
  type: string;
  model: string;
  model_id: number;
  site_id: number;
  content_id: number;
  content_filter_id: null; // ?
  lft: number;
  rght: number;
  title: string | null;
  detail: string;
  url: string;
  status: null; // ?
  priority: string;
  publish_begin: null; // ?
  publish_end: null; // ?
  created: string; // Date
  modified: string; // Date
};

export type BlogContent = {
  id: number;
  description: string;
  template: string;
  list_count: number;
  list_direction: "DESC" | "ASC";
  feed_count: number;
  tag_use: boolean;
  comment_use: boolean;
  comment_approve: boolean;
  auth_captcha: boolean;
  widget_area: number;
  eye_catch_size: string;
  use_content: boolean;
  created: string; // Date
  modified: string | null; // Date
};

export type BlogPost = {
  id: number;
  blog_content_id: number;
  no: number;
  name: string | null; // ?
  title: string;
  content: string; // HTML
  blog_category_id: number;
  user_id: number;
  status: boolean;
  posted: string; // Date
  content_draft: string;
  detail_draft: string;
  publish_begin: string | null;
  publish_end: string | null;
  exclude_search: boolean;
  eye_catch: string; // Path
  created: string; // Date
  modified: string; // Date
};
