import {Node} from "slate";
import {PeakPost, POST_TYPE} from "component-library";

export const deriveTitleFromPost = (post: PeakPost): string => {
    if (post.post_type === POST_TYPE.blog_post) {
        const titleNode = post.body[0]
        return Node.string(titleNode)
    } else {
        return post.title
    }
}