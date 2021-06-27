import React, {useEffect, useState} from 'react'
import {loadPeakNotes, useNotes} from "../../../client/notes";
import {List, message, Popconfirm} from "antd";
import {ReadFilled} from "@ant-design/icons/lib";
import "./book-list-view.scss"
import {Link} from "react-router-dom";
import { ELEMENT_PEAK_BOOK } from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import { capitalize } from 'lodash';
import {PeakTagDisplay} from "../../../common/peak-tag-display/PeakTagDisplay";
import {PeakKnowledgeKeyOption} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/types";
import {buildNoteUrl} from "../../../utils/notes";
import {useCurrentUser} from "../../../utils/hooks";
import {DeleteNoteConfirm} from "../../../common/delete-note-popconfirm/DeleteNoteConfirm";
import {PeakBook} from "../../../types/notes";
import {NoteItemMetadataContainer} from "../../../common/notes/list/note-item-metadata-container/NoteItemMetadataContainer";

export const PeakBookListView = (props: { page_header: string, note_type: PeakKnowledgeKeyOption }) => {
    const { page_header, note_type } = props
    const currentUser = useCurrentUser()
    const notes: PeakBook[] = useNotes().filter(n => n.note_type === note_type)

    useEffect(() => {
        loadPeakNotes(currentUser.id)
    }, [])

    return (
        <div className={"notes-container"}>
            <h1 className={"peak-page-title"}>{capitalize(page_header)}</h1>
            <List
                className={"peak-notes-list"}
                itemLayout={"vertical"}
                size={"large"}
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 10
                }}
                dataSource={notes}
                renderItem={(item) => <PeakBookListItem item={item}/>}
            />
        </div>
    )
}

const PeakBookListItem = (props: { item: PeakBook }) => {
    const { item } = props
    const [hovered, setHovered] = useState(false)
    return (
        <List.Item key={item.title} onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <List.Item.Meta
                className={"peak-note-book-container"}
                avatar={ (item.note_type === ELEMENT_PEAK_BOOK ) ? <NoteAvatar item={item}/> : null }
                title={
                    <div className={"peak-note-list-item"}>
                        <div className={"title-container"}>
                            <Link to={buildNoteUrl(item.id)}>
                                <div className={"peak-note-list-item-header"}>
                                    <p className={"item-title"}>{capitalize(item.title)}</p>
                                    <div className={"subtitle-container"}>{item.author}</div>
                                </div>
                            </Link>
                            <div className="peak-note-tag-section">
                                {item.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                            </div>
                        </div>
                        <NoteItemMetadataContainer note={item} hovered={hovered}/>
                    </div>
                }
            />
        </List.Item>
    )
}

const NoteAvatar = (props: { item: PeakBook }) => {
    const { item } = props

    if (!item.cover_image_url) {
        return (<ReadFilled className="default-note-icon"/>)
    } else {
        return (
            <ImageLoader
                className="note-icon"
                url={item.cover_image_url}
                fallbackElement={
                    <ReadFilled className="default-note-icon"/>
                }
            />
        )
    }
}

const NoteIconSection = (props: { item: PeakBook }) => {
    const { item } = props
    return (
        <div className={"icon-section"}>
            <DeleteNoteConfirm item={item}/>
        </div>
    )
}