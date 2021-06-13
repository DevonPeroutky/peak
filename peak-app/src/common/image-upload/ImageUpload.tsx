import React, { useState } from 'react';
import {notification, Upload} from "antd";
import { LoadingOutlined } from "@ant-design/icons/lib";
import {useCurrentUser} from "../../utils/hooks";
import {useUploadFile} from "../../client/file-upload";
import "./image-upload.scss"

export const ImageUpload = (props: { setImageUrl? }) => {
    const currentUser = useCurrentUser()
    const [loading, setLoading] = useState<boolean>(false)
    const [entropy, setEntropy] = useState<number>(Date.now())
    const uploadRequest = useUploadFile()

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com"

    const uploadProps = {
        action: (file) => {
            setEntropy(Date.now())
            return Promise.resolve(`${baseUrl}/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${currentUser.id}/${entropy}-${file.name}`)
        },
        accept: "image/*",
        customRequest: (fileWrapper) => {
            const file = fileWrapper.file
            setLoading(true)

            uploadRequest(fileWrapper.action, file).then(res => {
                props.setImageUrl && props.setImageUrl(`${baseUrl}/${bucketName}/${currentUser.id}/${entropy}-${file.name}`)
            })
            .catch(_ => {
                notification.error({message: `File upload failed`});
            }).finally(() => setLoading(false))
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(`Uploading `, info)
            }
            if (info.file.status === 'done') {
                notification.success({message: `File uploaded successfully`});
                setLoading(false)
            } else if (info.file.status === 'error') {
                notification.error({message: `File upload failed`});
                setLoading(false)
            }
        },
    };

    return (
        <div className={"upload-container"}>
            <Upload {...uploadProps} fileList={[]}>
                <div style={{display: "flex", cursor: "pointer", marginLeft: "10px"}}>
                    {loading ? <LoadingOutlined style={{marginRight: "10px"}}/> : null}
                    <div className={"upload-button-text"}>{ loading ? "Uploading" : "Upload from my computer..." }</div>
                </div>
            </Upload>
        </div>
    )
}