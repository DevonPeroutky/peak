import React, {useState} from 'react';
import {Button, Divider, Form, Input, notification, Spin} from "antd";
import {NoteTagSelect} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakTag} from "../../../../types";
import {PeakPost, POST_TYPE, POST_VISIBILITY} from "component-library";
import { capitalize } from "lodash";
import {sleep} from "../../../../chrome-extension/utils/generalUtil";

export const PublishPostForm = (props: { page: PeakWikiPage, blogConfiguration: BlogConfiguration, userId: string }) => {
    const { page, userId, blogConfiguration } = props

    type PUBLISHING_STATE = "publishing" | "publish" | "published"

    const [loadingState, setLoading] = useState<PUBLISHING_STATE>("publish")
    const [selectedTags, setTags] = useState<PeakTag[]>([])

    const createPublishPost = (title: string, subtitle: string): PeakPost => {
        return {
            id: page.id,
            title: title,
            snippet: subtitle,
            body: page.body,
            tag_ids: selectedTags.map(t => t.id),
            subdomain_id: blogConfiguration.subdomain,
            post_type: POST_TYPE.blog_post.toString(),
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
        console.log(`values!, `, values)
        setLoading("publishing")
        const blog_post_payload: PeakPost = createPublishPost(values.title, values.subtitle)
        createPeakPost(userId, blogConfiguration.subdomain, blog_post_payload).then(res => {
            sleep(1000).then(_ => {
                setLoading("published")
            })
        }).catch(res => {
            sleep(1000).then(_ => {
                notification.error({message: "Failed to publish your post!"})
                setLoading("publish")
            })
        })
    }

    return (
        <div className={"publish-post-container"}>
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
                {(loadingState === "publishing") ? <Spin style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}/> :
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
                        <div className={"form-row"}>
                            <h3>Post Organization</h3>
                            <NoteTagSelect selected_tags={[]} note_id={"TBD"} input_className={"minimal-text-input"}/>
                        </div>
                    </>
                }
                <Form.Item hasFeedback className={"form-row"}>
                    <Button
                        shape="round"
                        htmlType={"submit"}
                        size={"large"}
                        style={{marginTop: "25px", maxWidth: "fit-content"}}
                        icon={<ShareAltOutlined/>}
                        type={"primary"}
                        loading={loadingState === "publishing"}>
                        {capitalize(loadingState)}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}