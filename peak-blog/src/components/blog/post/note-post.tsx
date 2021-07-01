import React from "react";
import {PeakPost} from "component-library";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import {useAppContext} from "../../../data/context";
import {ConditionalImageLoader} from "../../primitives/image/ConditionalImageLoader";
import {deriveTitleFromPost} from "../../../utils/editor";
import PostMetadataSubHeader from "./header/metadata-header";

export const NotePost = (props: { post: PeakPost }) => {
    const { post } = props

    const title = deriveTitleFromPost(post)

    return (
        <div className={"py-12"}>
            <h1 className={"text-4xl"}>{title}</h1>
            <PostMetadataSubHeader post={post}/>
            <ConditionalImageLoader src={post.cover_image} width={"100%"} height={"auto"} layout={"responsive"}/>
            <DisplayEditor value={post.body} postId={post.id}/>
        </div>
    )
}