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
                    <Link href={"/"}>
                        <span className={"leading-snug cursor-pointer hover:text-blue-400"}>{subdomain.title}</span>
                    </Link>
                    <button className={"p-2.5 flex justify-center items-center bg-green-500 text-white rounded font-light text-sm"}>Subscribe</button>
                </div>
            </div>
            <div className={styles.postContainer}>
                <BlogPost post={data}/>
            </div>
        </div>
    )
}
export default Post