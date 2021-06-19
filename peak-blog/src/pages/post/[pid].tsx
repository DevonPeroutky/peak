import { NextPage } from "next";
import React from "react";
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse} from "component-library";
import {fetch_post} from "../../data/posts/posts";
import {BlogPost} from "../../components/blog/post/post";
import {POST_KEY_PREFIX, POSTS_KEY} from "../../data/posts/types";
import Error from "next/error";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";
import {useAppContext} from "../../data/context";
import cn from 'classnames';
import {ConditionalImageLoader} from "../../components/primitives/image/ConditionalImageLoader";
import { truncate } from 'lodash';
import {PeakLogo} from "../../components/primitives/logo/peak-logo";
import {notify} from "../../utils/toast";

// TODO: Load the subdomain / author / posts if not done already?
const Post: NextPage<{}> = (props) => {
    const router = useRouter()
    const post_id: string = router.query["pid"] as string
    const queryClient = useQueryClient()
    const { subdomain, author } = useAppContext()

    const { isLoading, isError, status, data, error } = useQuery<PeakPost, Error>(
        [POST_KEY_PREFIX, post_id],
        () => fetch_post(post_id),
        {
            initialData: () => {
                if (!post_id) return undefined

                // @ts-ignore
                const posts: PeakPost[] = queryClient.getQueryData<{pages: PeakPostListResponse}>(POSTS_KEY)?.pages.flatMap(page => page.posts)
                return (posts) ? posts.find(p => p.id === post_id) : undefined
            }
        }
    )

    if (isError) {
        return <Error statusCode={500}/>
    }

    if (isLoading) {
        return <div>Load THIS HO!</div>
    }

    return (
        <div className={"w-screen flex flex-col justify-center items-center"}>
            <div className={"w-full divide-gray-50 border-b py-4 flex justify-center items-center"}>
                <div className={cn(styles.postContainer, "h-12", "flex", "items-center", "justify-between")}>
                    <span className={"flex items-center leading-snug cursor-pointer hover:text-blue-400"}>
                        <Link href={"/"}>
                            <div className={"flex items-center"}>
                                <ConditionalImageLoader
                                    src={subdomain.fav_icon_url}
                                    width={"48px"}
                                    height={"48px"}
                                    layout={"intrinsic"}
                                    fallback={<PeakLogo className={"mr-4"}/>}
                                    className={"mr-4"}/>
                                <span className={""}>{truncate(subdomain.title, { length: 50 })}</span>
                            </div>
                        </Link>
                    </span>
                    <button
                        className={"p-2.5 flex justify-center items-center bg-green-500 text-white rounded font-light text-sm accessible-button"}
                        onClick={() => notify("Ability to subscribe coming soon!", "subscribe")}
                    >
                        Subscribe
                    </button>
                </div>
            </div>
            <div className={styles.postContainer}>
                <BlogPost post={data}/>
            </div>
        </div>
    )
}
export default Post