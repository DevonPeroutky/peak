import {Button, Input} from "antd";
import {ImageUpload} from "../image-upload/ImageUpload";
import React, {useState} from "react";
import {isValidHttpUrl} from "../../utils/urls";
import "./image-input.scss"
import {UploadOutlined} from "@ant-design/icons/lib";
import {ImageLoader} from "component-library";

export const ImageInput = (props: { imageUrl?, setImageUrl? }) => {
    const [internalUrl, setInternalUrl] = useState("")
    const [embedUrl, setUrl] = useState(props.imageUrl)

    const setTheUrl = (url: string) => {
        setUrl(url)
        props.setImageUrl && props.setImageUrl(url)
    }

    const imagePreview = (
        <div className={"preview-container"}>
            <Button className={"preview-overlay-button"} shape={"round"} onClick={() => setTheUrl("")}>Change Cover Image</Button>
            <ImageLoader url={embedUrl} fallbackElement={null} className={"preview-image"}/>
        </div>
    )

    const imageInput = (
        <>
            <Input
                value={internalUrl}
                onChange={e => setInternalUrl(e.target.value)}
                className={"minimal-text-input publish-text-input"}
                placeholder="Paste the url of the image"
                bordered={false}
            />
            <div className={"form-button-row"}>
                <Button
                    shape={"round"}
                    icon={<UploadOutlined />}
                    style={{marginRight: "10px"}}
                    onClick={e => {
                        setTheUrl(internalUrl)
                    }}
                    disabled={(internalUrl && internalUrl.length > 5) ? !isValidHttpUrl(internalUrl) : true }>Embed Image</Button>
                Or
                <ImageUpload setImageUrl={setTheUrl}/>
            </div>
        </>
    )

    return (
        <div>
            { (embedUrl) ? imagePreview : imageInput }
        </div>
   )
}
