import { NextPage } from "next";
import React from "react";
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse, POST_TYPE} from "component-library";
import {fetch_post} from "../../data/posts/posts";
import {BlogPost} from "../../components/blog/post/post";
import {POST_KEY_PREFIX, POSTS_KEY} from "../../data/posts/types";
import Error from "next/error";
import styles from "../../../styles/Home.module.css";
import {useAppContext} from "../../data/context";
import PostHeaderBar from "../../components/blog/post/header/post-header";
import {InitialLoader} from "../../components/loaders/InitialLoader";
import {BookPost} from "../../components/blog/post/book-post";

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
            enabled: !!post_id,
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

    if (isLoading || !subdomain || !post_id) {
        return <InitialLoader/>
    }

    return (
        <div className={"w-screen flex flex-col justify-center items-center"}>
            <PostHeaderBar/>
            <div className={styles.postContainer}>
                {(data.post_type === POST_TYPE.book_post) ? <BookPost post={data}/> : <BlogPost post={data}/> }
            </div>
        </div>
    )
}
export default Post