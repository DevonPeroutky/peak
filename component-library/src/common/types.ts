import {Node} from "slate";

export enum POST_TYPE {
  blog_post
}

export enum POST_VISIBILITY {
  public
}

export interface PeakPost {
  id: string
  title: string
  subtitle?: string
  cover_image?: string
  body: Node[]
  tag_ids: string[]
  subdomain_id: string
  user_id: string

  // TODO: Enum
  post_type: string

  // TODO: Enum
  visibility?: string
  created_at?: string
  updated_at?: string
}

interface PaginationMetadata {
  cursor: string | null
  cursorBefore: string | null
  limit: number
}

export interface PeakPostListResponse {
  posts: PeakPost[],
  pagination_metadata: PaginationMetadata
}
