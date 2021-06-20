import React, {useEffect, useState} from 'react';
import {Button, Modal, Spin} from "antd";
import {CloseOutlined, ShareAltOutlined} from "@ant-design/icons/lib";
import cn from 'classnames';
import {PublishPostForm} from "./publish-post-form/PublishPostForm";
import "./publish-modal.scss"
import {useCurrentPage, useCurrentUser} from "../../../utils/hooks";
import {PeakWikiPage} from "../../../constants/wiki-types";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useBlog} from "../../../redux/slices/blog/hooks";
import {useActiveEditorState} from "../../../redux/slices/activeEditor/activeEditorSlice";
import {PublishSuccess} from "./publish-result/PublishSuccess";
import { useHistory } from 'react-router-dom';
import {PeakNote} from "../../../redux/slices/noteSlice";
import {POST_VISIBILITY} from "component-library";
import {blogUrlFromSubdomain} from "../../../utils/urls";

type PUBLISHING_STATE = "publishing" | "publish" | "published"
export const PublishModal = (props: { }) => {
    const history = useHistory()
    const currentPage = useCurrentPage()
    const [visible, setVisible] = useState(false);
    const [loadingState, setLoading] = useState<PUBLISHING_STATE>("publish")

    const alreadyPublished: boolean = (currentPage.privacy_level) ? currentPage.privacy_level === POST_VISIBILITY.public.toString() : false

    return (
        <>
            <PublishModalContainer setVisible={setVisible} publishStatus={alreadyPublished}/>
            <Modal
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => {
                    history.push("/home/scratchpad")
                    setVisible(false)
                    setLoading("publish")
                }}
                maskClosable={false}
                destroyOnClose={true}
                closable={loadingState !== "publishing"}
                keyboard={true}
                className="peak-publish-modal"
                maskStyle={{
                    backgroundColor: '#FFF'
                }}
                footer={null}
            >
                <div className="publish-post-container">
                    <Spin spinning={loadingState === "publishing"}>
                        <PublishFormBody loadingState={loadingState} setLoading={setLoading}/>
                    </Spin>
                </div>
            </Modal>
        </>
    )
}

const PublishFormBody = (props: { loadingState: PUBLISHING_STATE, setLoading: any }) => {
    const { loadingState, setLoading } = props
    const original_artifact: PeakWikiPage | PeakNote = useCurrentPage()
    const user = useCurrentUser()
    const blog: BlogConfiguration = useBlog()
    const [postUrl, setPostUrl] = useState<string>(null)

    switch (loadingState) {
        case "publish":
        case "publishing":
            return <PublishPostForm page={original_artifact} userId={user.id} blogConfiguration={blog} setLoading={setLoading} setUrl={setPostUrl}/>
        case "published":
            return <PublishSuccess postUrl={postUrl}/>
    }
}

const PublishModalContainer = (props: { setVisible, publishStatus: boolean }) => {
    const editorState = useActiveEditorState()
    const blog = useBlog()
    const { setVisible, publishStatus } = props

    if (publishStatus) {
        return (
            <div className={"publish-modal-container"}>
                <span>You have published this note! View it live on <a href={blogUrlFromSubdomain(blog.subdomain)} target="_blank">{blog.subdomain}</a></span>
            </div>
        )
    }

    return (
        <div className={"publish-modal-container"}>
            <span>Ready to share this with the world?</span>
            <Button
                className={cn("publish-button")}
                type="primary"
                shape="round"
                ghost={true}
                disabled={editorState.isSaving}
                icon={<ShareAltOutlined />}
                onClick={() => setVisible(true)}
                size={"large"}>
                Publish to Blog
            </Button>
        </div>
    )

}
