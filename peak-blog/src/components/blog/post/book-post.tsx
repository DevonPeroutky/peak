import React from "react";
import {PeakPost} from "component-library";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import { Node } from "slate";
import moment from "moment";
import {useAppContext} from "../../../data/context";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";
import {ConditionalImageLoader} from "../../primitives/image/ConditionalImageLoader";
import Link from "next/link";
import {deriveTitleFromPost} from "../../../utils/editor";
import PostMetadataSubHeader from "./header/metadata-header";

export const BookPost = (props: { post: PeakPost }) => {
    const { post } = props

    const title = deriveTitleFromPost(post)

    return (
        <div className={""}>
            <div className={"flex mb-4"}>
                <ConditionalImageLoader src={post.cover_image} width={"auto"} height={"150px"} layout={"intrinsic"} className={"mr-8"}/>
                <h1 className={"mb-2 text-4xl"}>{title}</h1>
            </div>
            <PostMetadataSubHeader post={post}/>
            <DisplayEditor value={post.body} postId={post.id}/>
        </div>
    )
}