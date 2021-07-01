import React from "react";
import {PeakPost} from "component-library";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import { Node } from "slate";
import {ConditionalImageLoader} from "../../primitives/image/ConditionalImageLoader";
import {deriveTitleFromPost} from "../../../utils/editor";
import PostMetadataSubHeader from "./header/metadata-header";

export const BlogPost = (props: { post: PeakPost }) => {
    const { post } = props

    const title = deriveTitleFromPost(post)
    const bodySanTitle: Node[] = (post.body) ? post.body.slice(1) : []

    return (
        <div className={""}>
            <h1 className={"mb-2 text-4xl"}>{title}</h1>
            <PostMetadataSubHeader post={post}/>
            <ConditionalImageLoader src={post.cover_image} width={"100%"} height={"auto"} layout={"responsive"}/>
            <DisplayEditor value={bodySanTitle} postId={post.id}/>
        </div>
    )
}