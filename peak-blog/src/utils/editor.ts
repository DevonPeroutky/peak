import {Node} from "slate";
import {PeakPost} from "component-library";

export const deriveTitleFromPost = (post: PeakPost): string => {
    if (post.post_type === "page") {
        const titleNode = post.body[0]
        return Node.string(titleNode)
    } else {
        return post.title
    }
}