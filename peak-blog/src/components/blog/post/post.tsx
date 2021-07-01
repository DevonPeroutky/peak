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

export const BlogPost = (props: { post: PeakPost }) => {
    const { post } = props
    const { subdomain, author } = useAppContext()

    const title = deriveTitleFromPost(post)
    const bodySanTitle: Node[] = (post.body) ? post.body.slice(1) : []

    return (
        <div className={"py-12"}>
            <h1 className={"mb-2 text-4xl"}>{title}</h1>
            {/*<h2 className={"text-gray-500 text-xl font-light leading-normal mb-4"}>{post.subtitle}</h2>*/}
            <div className={"text-gray-500 text-sm mb-10"}>
                <Link href={"/about"}>
                    <span className={"mr-1 cursor-pointer hover:text-blue-400"}>{author.given_name} {author.family_name}</span>
                </Link>
                •
                <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span>
                •
                <EstimateReadTime className={"mx-1"} body={post.body}/>
            </div>
            <ConditionalImageLoader src={post.cover_image} width={"100%"} height={"auto"} layout={"responsive"}/>
            <DisplayEditor value={bodySanTitle} postId={post.id}/>
        </div>
    )
}