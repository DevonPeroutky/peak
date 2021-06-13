import React from "react";
import {PeakPost} from "component-library";
import {useAppContext} from "../../../data/context";
import {Node} from "slate";
import Link from "next/link";
import moment from "moment";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";
import Image from "next/image";
import {ImageProps} from "next/dist/client/image";

export const BlogPostPreview = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    // const postPreviewBody: Node[] = post.body.slice(1, 6)
    const title = Node.string(titleNode)

    return (
        <div className={"mb-20 flex min-h-150"}>
            <ImagePreview post={post}/>
            <div className="flex flex-col flex-grow">
                <Link href={`post/${post.id}`}>
                    <h2 className={"mb-2 cursor-pointer hover:text-blue-500 font-semibold text-3xl"}>{title}</h2>
                </Link>
                <div className={"mb-2 text-base text-gray-500 font-light flex-grow"}>
                    {post.subtitle}
                </div>
                <div className={"text-gray-400 font-light text-xs mb-4"}>
                    <span className={"mr-1"}>{author.given_name} {author.family_name}</span> • <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span> • <EstimateReadTime className={"mx-1"} body={post.body}/>
                </div>
            </div>
        </div>
    )
}

const ImagePreview = (props: { post: PeakPost }) => {
    const cover_image = props.post.cover_image
    return (!cover_image) ? null : <div className={"mr-5"}>
        <NextImageWrapper src={cover_image} width={"200px"} height={"125px"} layout={"intrinsic"} alt={"Image Preview"}/>
    </div>
}

const NextImageWrapper = (props: ImageProps) => {
    // @ts-ignore
    const { src, className, alt, width, layout, height } = props
    return (src.startsWith("https://storage.googleapis.com")) ?
        <Image
            src={src}
            alt={alt}
            width={width}
            layout={layout}
            height={height}
        /> : <img src={src} className={props.className} alt={alt} style={{width: width, height: height}}/>

}