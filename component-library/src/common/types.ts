import {Node} from "slate";

export enum POST_TYPE {
  blog_post,
  note_post,
  book_post
}

export enum POST_VISIBILITY {
  draft,
  public,
  private
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
  post_type: POST_TYPE

  // TODO: Enum
  privacy_level?: string
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
