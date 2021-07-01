import {EstimateReadTime} from "../read-time/EstimatedReadTime";
import {useAppContext} from "../../../../data/context";
import {PeakPost} from "component-library";
import Link from "next/link";
import moment from "moment";

export default function PostMetadataSubHeader(props: {post: PeakPost}) {
    const { post } = props
    const { subdomain, author } = useAppContext()

    {/*<h2 className={"text-gray-500 text-xl font-light leading-normal mb-4"}>{post.subtitle}</h2>*/}
    return (
        <div className={"text-gray-500 text-sm my-4"}>
            <Link href={"/about"}>
                <span className={"mr-1 cursor-pointer hover:text-blue-400"}>{author.given_name} {author.family_name}</span>
            </Link>
            •
            <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span>
            •
            <EstimateReadTime className={"mx-1"} body={post.body}/>
        </div>
    )
}