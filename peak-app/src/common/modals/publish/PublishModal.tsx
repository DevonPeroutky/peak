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
import {useDispatch} from "react-redux";
import { useHistory } from 'react-router-dom';
import {PeakNote} from "../../../redux/slices/noteSlice";

type PUBLISHING_STATE = "publishing" | "publish" | "published"
export const PublishModal = (props: { }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const currentPage = useCurrentPage()
    const [visible, setVisible] = useState(false);
    const [loadingState, setLoading] = useState<PUBLISHING_STATE>("publish")

    return (
        <>
            <PublishModalContainer setVisible={setVisible}/>
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

const PublishModalContainer = (props: { setVisible }) => {
    const editorState = useActiveEditorState()

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
                onClick={() => props.setVisible(true)}
                size={"large"}>
                Publish to Blog
            </Button>
        </div>
    )

}
