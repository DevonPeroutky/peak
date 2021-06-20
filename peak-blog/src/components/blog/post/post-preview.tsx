import React from "react";
import {PeakPost} from "component-library";
import {useAppContext} from "../../../data/context";
import Link from "next/link";
import moment from "moment";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";
import {ConditionalImageLoader} from "../../primitives/image/ConditionalImageLoader";
import { truncate } from "lodash";
import {deriveTitleFromPost} from "../../../utils/editor";

export const BlogPostPreview = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()
    const title = deriveTitleFromPost(post)

    return (
        <div className={"mb-20 flex min-h-150"}>
            <ConditionalImageLoader src={post.cover_image} width={"200px"} height={"150px"} layout={"intrinsic"} className={"mr-5 flex-shrink-0"}/>
            <div className="flex flex-col flex-grow justify-center">
                <Link href={`post/${post.id}`}>
                    <h2 className={"mb-2 cursor-pointer hover:text-blue-500 font-semibold text-3xl"}>{title}</h2>
                </Link>
                <div className={"mb-2 text-base text-gray-500 font-light"}>{truncate(post.subtitle, {
                    'length': 140,
                    'omission': "..."
                })}</div>
                <div className={"text-gray-400 font-light text-xs mb-4"}>
                    <span className={"mr-1"}>{author.given_name} {author.family_name}</span> • <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span> • <EstimateReadTime className={"mx-1"} body={post.body}/>
                </div>
            </div>
        </div>
    )
}
