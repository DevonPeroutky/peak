import React, {ReactNode, useState} from 'react';
import {Button, Form, Input, notification} from "antd";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakTag} from "../../../../types";
import {PeakPost, POST_VISIBILITY, POST_TYPE} from "component-library";
import {sleep} from "../../../../chrome-extension/utils/generalUtil";
import cn from "classnames"
import {blogUrlFromSubdomain} from "../../../../utils/urls";
import {updateNote} from "../../../../redux/slices/noteSlice";
import {ImageInput} from "../../../image-input/ImageInput";
import {deletePage} from "../../../../redux/slices/wikiPageSlice";
import {removePageFromTopic} from "../../../../redux/slices/topicSlice";
import {useDispatch} from "react-redux";
import {PeakExternalNote, PublishableArtifact} from "../../../../types/notes";
import {WIKI_PAGE} from "../../../../types/editors";
import { startCase } from 'lodash';
import {
    ELEMENT_PEAK_BOOK,
    ELEMENT_WEB_NOTE,
    PEAK_LEARNING
} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/constants";

export const PublishPostForm = (props: { artifact: PublishableArtifact, blogConfiguration: BlogConfiguration, userId: string, setLoading: any, setUrl: any }) => {
    const { artifact, userId, blogConfiguration, setLoading, setUrl } = props

    const dispatch = useDispatch()
    const [selectedTags, setTags] = useState<PeakTag[]>([]) // TODO: MAKE THESE use the artifact TAG_IDS
    const [imageUrl, setImageUrl] = useState<string | undefined>(artifact.cover_image_url)

    const determinePostType = (): POST_TYPE => {
        switch (artifact.artifact_type) {
            case ELEMENT_PEAK_BOOK:
                return POST_TYPE.book_post
            case ELEMENT_WEB_NOTE:
                return POST_TYPE.note_post
            case PEAK_LEARNING:
            case WIKI_PAGE:
            default:
                return POST_TYPE.blog_post

        }
    }
    const createPublishPost = (title: string, subtitle: string, post_type: POST_TYPE): PeakPost => {
        // @ts-ignore
        return {
            id: artifact.id,
            title: title,
            subtitle: subtitle,
            body: artifact.body,
            cover_image: imageUrl,
            tag_ids: selectedTags.map(t => t.id),
            subdomain_id: blogConfiguration.subdomain,
            post_type: post_type.valueOf(),
            privacy_level: POST_VISIBILITY.public.toString(),
            user_id: userId
        } as PeakPost
    }
    const publishPost = (values: { title: string, subtitle: string }) => {
        setLoading("publishing")
        const blog_post_payload: PeakPost = createPublishPost(values.title, values.subtitle, determinePostType())

        createPeakPost(userId, blogConfiguration.subdomain, blog_post_payload, artifact.artifact_type).then(res => {
            console.log(`RES `, res)

            if (artifact.artifact_type === WIKI_PAGE) {
                dispatch(deletePage({ pageId: artifact.id }))
                dispatch(removePageFromTopic({ pageId: artifact.id }))
            } else {
                dispatch(updateNote({...artifact as PeakExternalNote, privacy_level: POST_VISIBILITY.public.toString()}))
            }

            sleep(1000).then(_ => {
                setLoading("published")
                const baseBlogUrl = blogUrlFromSubdomain(blogConfiguration.subdomain)
                setUrl(`${baseBlogUrl}/post/${res.id}`)
            })
        }).catch(res => {
            sleep(1000).then(_ => {
                notification.error({key: "1", message: "Failed to publish your post!"})
                setLoading("publish")
            })
        })
    }
    const initialPostValues = setupInitialFormValues(artifact)
    function fetchFormForPublishingArtifact(): ReactNode {
        const useTitleFromPage: boolean = artifact.artifact_type === WIKI_PAGE
        switch (artifact.artifact_type) {
            case WIKI_PAGE:
            case ELEMENT_PEAK_BOOK:
            case PEAK_LEARNING:
            default:
                return <DefaultPublishForm artifact={artifact} setImageUrl={setImageUrl} lockTitle={useTitleFromPage}/>

        }
    }

    return (
        <div className={cn("publish-post-form-container animate__animated")}>
            <h1 style={{
                wordBreak: "normal",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                fontWeight: 700
            }}>
                Publish this post to <span className={"subdomain-link"}>{blogConfiguration.subdomain}.cur8.dev</span>
            </h1>
            <div style={{marginBottom: "2rem"}}>
                Add some details to help preview this post externally.
            </div>
            <Form
                name="publish_post"
                style={{width:"100%"}}
                className={"publish-form"}
                initialValues={initialPostValues}
                onFinish={publishPost}>
                {fetchFormForPublishingArtifact()}
                <Form.Item hasFeedback className={"form-row"}>
                    <Button
                        shape="round"
                        htmlType={"submit"}
                        size={"large"}
                        style={{marginTop: "25px", maxWidth: "fit-content"}}
                        icon={<ShareAltOutlined/>}
                        type={"primary"}>
                        Publish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

interface InternalFormProps {
    artifact: PublishableArtifact
    setImageUrl: any
    lockTitle: boolean
}

const setupInitialFormValues = (artifact: PublishableArtifact) => {
    if (artifact.artifact_type === ELEMENT_PEAK_BOOK) {
        const authorText = (artifact.author && artifact.author.length > 0) ? ` by ${artifact.author}` : ``
        const title = `My thoughts on '${startCase(artifact.title)}'${authorText}`
        return {
            title: startCase(title),
            subtitle: "",
            tags: []
        }
    } else {
        return {
            title: startCase(artifact.title),
            subtitle: "",
            tags: []
        }
    }
}

export const DefaultPublishForm = (props: InternalFormProps) => {
    const { artifact, setImageUrl, lockTitle } = props
    return (
        <>
            <h3>Story Preview</h3>
            <Form.Item
                name={"title"}
                rules={[
                    {
                        required: true,
                        type: "string",
                        max: 255,
                        message: 'We need a title for your post! Keep it under 255',
                    },
                ]}
                className={"form-row"}>
                <Input
                    className={"minimal-text-input publish-text-input"}
                    placeholder="Write a preview title"
                    bordered={false}
                />
            </Form.Item>
            <Form.Item
                name={"subtitle"}
                rules={[
                    {
                        required: true,
                        type: "string",
                        max: 1000,
                        message: "Required. Give people a quick overview of what you will be covering! ",
                    },
                ]}
                className={"form-row"}>
                <Input
                    className={"minimal-text-input publish-text-input"}
                    placeholder="Write a preview snippet we'll use a subtitle"
                    bordered={false}
                />
            </Form.Item>
            <div className={"form-row"} style={{minHeight: "200px", marginBottom: "25px"}}>
                <h3>Add a cover Image</h3>
                <ImageInput imageUrl={artifact.cover_image_url} setImageUrl={setImageUrl}/>
            </div>
        </>
    )
}

export const TweetPublishForm = () => {

}
