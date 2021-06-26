import {message, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons/lib";
import React, { useState } from "react";
import "./delete-note-confirm.scss"
import { deletePeakNote } from "src/client/notes";
import cn from 'classnames';
import {PeakNote} from "../../types/notes";
import {Peaker} from "../../types";
import {useCurrentUser} from "../../utils/hooks";

export const DeleteNoteConfirm = (props: { item: PeakNote, className?: string }) => {
    const { item, className } = props

    const user: Peaker = useCurrentUser()
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const close = () => {
        setVisible(false);
    };

    const open = () => {
        setVisible(true);
    }

    const deleteNote = (e) => {
        setLoading(true)
        setTimeout(() => {
            deletePeakNote(user.id, item.id).catch(err => {
                setLoading(false)
                message.error("Failed to delete your note due to a server error.")
            }).finally(close)
        }, 500);
    }
    return (
        <Popconfirm
            title="Are you sure"
            visible={visible}
            onConfirm={deleteNote}
            onCancel={close}
            okButtonProps={{ loading: loading }}
            okText={"Delete"}>
            <DeleteOutlined className={cn("confirm-delete-icon", className)} onClick={open}/>
        </Popconfirm>
    )
}
