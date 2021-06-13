import React from "react";
import {PeakPost} from "component-library";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import { Node } from "slate";
import moment from "moment";
import {useAppContext} from "../../../data/context";
import styles from "../../../../styles/Home.module.css";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";
import {ConditionalImageLoader} from "../../primitives/image/ConditionalImageLoader";

export const BlogPost = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    const bodySanTitle: Node[] = post.body.slice(1)
    const title = Node.string(titleNode)

    return (
        <div className={styles.postContainer}>
            <h1 className={"mb-2 text-4xl"}>{title}</h1>
            <h2 className={"text-gray-500 text-xl font-light leading-normal mb-4"}>{post.subtitle}</h2>
            <div className={"text-gray-500 text-sm mb-10"}>
                <span className={"mr-1"}>{author.given_name} {author.family_name}</span> • <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span> • <EstimateReadTime className={"mx-1"} body={post.body}/>
            </div>
            <ConditionalImageLoader src={post.cover_image} width={"100%"} height={"auto"} layout={"responsive"}/>
            <DisplayEditor value={bodySanTitle} postId={post.id}/>
        </div>
    )
}