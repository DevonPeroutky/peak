import {PeakPost, PeakPostListResponse} from "component-library";
import blogAxiosClient from "../base_client";

export function fetch_posts_for_subdomain(subdomain: string, cursor?: string): Promise<PeakPostListResponse> {
    const cursorQueryParam = (cursor) ? `&cursor=${cursor}` : ``
    return blogAxiosClient
        .get<PeakPostListResponse>(`/blog/v1/posts?subdomain=${subdomain}${cursorQueryParam}`)
        .then(res => res.data)
}

export function fetch_post(post_id: string): Promise<PeakPost> {
    return blogAxiosClient.get<{post: PeakPost}>(`/blog/v1/posts/${post_id}`).then(res => res.data.post)
}
