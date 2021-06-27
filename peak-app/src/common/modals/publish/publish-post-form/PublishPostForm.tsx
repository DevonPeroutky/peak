import React, {useState} from 'react';
import {Button, Form, Input, notification} from "antd";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakTag} from "../../../../types";
import {PeakPost, POST_TYPE, POST_VISIBILITY} from "component-library";
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
import {ELEMENT_PEAK_BOOK} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/constants";

export const PublishPostForm = (props: { artifact: PublishableArtifact, blogConfiguration: BlogConfiguration, userId: string, setLoading: any, setUrl: any }) => {
    const { artifact, userId, blogConfiguration, setLoading, setUrl } = props

    const dispatch = useDispatch()
    const [selectedTags, setTags] = useState<PeakTag[]>() // TODO: MAKE THESE use the artifact TAG_IDS
    const [imageUrl, setImageUrl] = useState<string | undefined>(artifact.cover_image_url)

    const createPublishPost = (title: string, subtitle: string, post_type: POST_TYPE): PeakPost => {
        return {
            id: artifact.id,
            title: title,
            subtitle: subtitle,
            body: artifact.body,
            cover_image: imageUrl,
            tag_ids: selectedTags.map(t => t.id),
            subdomain_id: blogConfiguration.subdomain,
            post_type: post_type.toString(),
            privacy_level: POST_VISIBILITY.public.toString(),
            user_id: userId
        } as PeakPost
    }

    const title = (artifact.artifact_type === ELEMENT_PEAK_BOOK) ? `My thoughts on '${startCase(artifact.title)}' by ${startCase(artifact.author)}` : startCase(artifact.title)

    const initialPostValues = {
        title: startCase(title),
        subtitle: "",
        tags: []
    }

    const publishPost = (values: { title: string, subtitle: string }) => {
        setLoading("publishing")
        const post_type: POST_TYPE = ("note_type" in artifact) ? POST_TYPE.note_post : POST_TYPE.blog_post
        const blog_post_payload: PeakPost = createPublishPost(values.title, values.subtitle, post_type)

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
}

/**
 * Don't show Title? Or Subtitle?
 * @constructor
 */
export const PagePublishForm = (props: InternalFormProps) => {
    const { artifact, setImageUrl } = props
    return (
        <>
            <h3>Story Preview</h3>
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

export const DefaultPublishForm = (props: InternalFormProps) => {
    const { artifact, setImageUrl } = props
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


/**
 * Publish Tweet-style or blog-style?
 * @constructor
 */
export const TweetPublishForm = () => {

}
