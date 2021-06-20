import React, {useState} from 'react';
import {Button, Form, Input, notification} from "antd";
import {NoteTagSelect} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakTag} from "../../../../types";
import {PeakPost, POST_TYPE, POST_VISIBILITY} from "component-library";
import {sleep} from "../../../../chrome-extension/utils/generalUtil";
import cn from "classnames"
import {blogUrlFromSubdomain} from "../../../../utils/urls";
import {OG_ARTIFACT_TYPE, WIKI_PAGE} from "../../../../redux/slices/posts/types";
import {PeakNote} from "../../../../redux/slices/noteSlice";
import {ImageInput} from "../../../image-input/ImageInput";
import {deletePage} from "../../../../redux/slices/wikiPageSlice";
import {removePageFromTopic} from "../../../../redux/slices/topicSlice";
import {useDispatch} from "react-redux";

export const PublishPostForm = (props: { page: PeakWikiPage | PeakNote, blogConfiguration: BlogConfiguration, userId: string, setLoading: any, setUrl: any }) => {
    const { page, userId, blogConfiguration, setLoading, setUrl } = props

    const [selectedTags, setTags] = useState<PeakTag[]>([])
    const [imageUrl, setImageUrl] = useState<string | undefined>()
    const dispatch = useDispatch()

    const createPublishPost = (title: string, subtitle: string, post_type: POST_TYPE): PeakPost => {
        return {
            id: page.id,
            title: title,
            subtitle: subtitle,
            body: page.body,
            cover_image: imageUrl,
            tag_ids: selectedTags.map(t => t.id),
            subdomain_id: blogConfiguration.subdomain,
            post_type: post_type.toString(),
            visibility: POST_VISIBILITY.public.toString(),
            user_id: userId
        } as PeakPost
    }

    const initialPostValues = {
        title: page.title,
        subtitle: "",
        tags: []
    }

    const publishPost = (values: { title: string, subtitle: string }) => {
        setLoading("publishing")
        const og_artifact_type: OG_ARTIFACT_TYPE = ("note_type" in page) ? page.note_type : WIKI_PAGE
        const post_type: POST_TYPE = ("note_type" in page) ? POST_TYPE.note_post : POST_TYPE.blog_post
        const blog_post_payload: PeakPost = createPublishPost(values.title, values.subtitle, post_type)

        createPeakPost(userId, blogConfiguration.subdomain, blog_post_payload, og_artifact_type).then(res => {

            if (og_artifact_type === WIKI_PAGE) {
                dispatch(deletePage({ pageId: page.id }))
                dispatch(removePageFromTopic({ pageId: page.id }))
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
                        <ImageInput setImageUrl={setImageUrl}/>
                    </div>
                    <div className={"form-row"}>
                        <h3>Post Organization</h3>
                        <NoteTagSelect selected_tags={[]} note_id={"TBD"} input_className={"minimal-text-input"}/>
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