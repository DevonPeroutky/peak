import {PeakNote} from "../../../../types/notes";
import {DeleteNoteConfirm} from "../../../delete-note-popconfirm/DeleteNoteConfirm";
import {POST_VISIBILITY} from "component-library";
import React from "react";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import Button from "antd/lib/button/button";
import "./metadata-container.scss"

export const NoteItemMetadataContainer = (props: { note: PeakNote, hovered }) => {
    const { note, hovered } = props
    const deleteIcon = (hovered) ? <DeleteNoteConfirm item={note} className={"space-holder"}/> : <div className={"space-holder"}/>
    const published = (note.privacy_level && note.privacy_level === POST_VISIBILITY.public.toString()) ?
        <Button
            className={"publish-tag"}
            type="primary"
            shape="round"
            icon={<CheckOutlined />}
            ghost={true}>Published</Button>
        : null
    return (
        <div className={"metadata-container"}>
            {published}
            {deleteIcon}
        </div>
    )
}
