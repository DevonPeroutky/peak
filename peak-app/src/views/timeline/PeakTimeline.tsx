import React, {useCallback, useEffect, useState} from "react";
import {useCurrentUser} from "../../utils/hooks";
import {loadPeakNotes, useNotes} from "../../client/notes";
import {Button, Empty, message, Popconfirm, Timeline} from "antd";
import {ELEMENT_WEB_NOTE, PEAK_LEARNING} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {Link} from "react-router-dom";
import {buildNoteUrl} from "../../utils/notes";
import {PeakTagDisplay} from "../../common/peak-tag-display/PeakTagDisplay";
import {
    CalendarOutlined, CheckOutlined,
    DeleteOutlined,
    EditFilled,
    EditOutlined,
    ReadFilled,
    ReadOutlined,
    UpCircleOutlined
} from "@ant-design/icons/lib";
import {ImageLoader} from "../../common/image-loader/ImageLoader";
import {deriveHostname} from "../../utils/urls";
import "./peak-timeline.scss"
import {formatStringAsDate} from "../../utils/time";
import {groupBy, head} from "ramda";
import cn from "classnames";
import {useBottomScrollListener} from "react-bottom-scroll-listener/dist";
import {DeleteNoteConfirm} from "../../common/delete-note-popconfirm/DeleteNoteConfirm";
import {POST_VISIBILITY} from "component-library";
import {PeakExternalNote, PeakNote} from "../../types/notes";
import {NoteItemMetadataContainer} from "../../common/notes/list/note-item-metadata-container/NoteItemMetadataContainer";

const groupByDate = groupBy(function (note: PeakExternalNote) {
    return formatStringAsDate(note.inserted_at.toString())
})

export const PeakTimeline = (props: { }) => {
    const currentUser = useCurrentUser()
    const notesFromRedux: PeakExternalNote[] = useNotes().filter(n => n.note_type === ELEMENT_WEB_NOTE || n.note_type === PEAK_LEARNING)
    const [notes, setNotes] = useState<PeakExternalNote[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [atBeginning, setAtBeginning] = useState<boolean>(false)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)

    const loadPageOfPeakNotes = useCallback(() => {
        return loadPeakNotes(currentUser.id, cursor).then(res => {
            const pagination_metadata = res.data.pagination_metadata
            if (pagination_metadata.cursor) {
                setCursor(pagination_metadata.cursor)
            } else {
                setAtBeginning(true)
            }
            return res
        })
    }, [cursor, currentUser.id])

    // Initial Load of Notes
    useEffect(() => {
        loadPageOfPeakNotes()
    }, [])

    // // If we have a note pushed to redux via socket
    useEffect(() => {
        setNotes(notesFromRedux)
    }, [JSON.stringify(notesFromRedux)])

    useBottomScrollListener(async () => {
        console.log(`Hit the bottom!!!! ${atBeginning}`)
        if (atBeginning) {
            return
        }
        // await new Promise(r => setTimeout(r, 2000));
        setLoadingMore(true)
        loadPageOfPeakNotes().then(res => setLoadingMore(false))
    });

    const groupedByDates = groupByDate(notes)
    const first_date = head(Object.keys(groupedByDates))
    const FINAL = "final"

    if (notes.length == 0) {
        return (
            <div className={"peak-timeline-container empty"}>
                <h1 className={"peak-page-title"}>No Bookmarks Yet</h1>
                <Empty description={"Download the chrome extension to get started!"}/>
            </div>
        )
    }
    return (
        <div className={"peak-timeline-container"}>
            <h1 className={"peak-page-title"}>Bookmarks</h1>
            <div className="timeline-container">
                <div className="vertical-bar"/>
                <Timeline className={"peak-note-timeline"}>
                    {
                        Object.entries({...groupedByDates, [FINAL]: []}).map(([date, notes]) => {
                            const isFirst = first_date === date

                            if ( date === FINAL ) {
                                return (
                                    <Timeline.Item key={"first-item"} className={"final-timeline-item"} dot={<UpCircleOutlined className={"timeline-icon"}/>}>
                                    </Timeline.Item>
                                )
                            }
                            return (
                                <div key={date}>
                                    <Timeline.Item key={date} dot={dateTimelineIcon(isFirst)} className={cn("peak-timeline-date-item", (isFirst) ? "first" : "normal")}>
                                        {<h1 className={"date-header"}>{date}</h1>}
                                    </Timeline.Item>
                                    {
                                        notes.map(n =>
                                            <NoteTimelineItem key={n.id} n={n}/>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </Timeline>
            </div>
        </div>
    )
}

const NoteAvatar = (props: { item: PeakExternalNote }) => {
    const { item } = props

    if (item.note_type == PEAK_LEARNING) {
        return (<EditOutlined className="default-note-icon"/>)
    }

    if (!item.icon_url) {
        return (<ReadOutlined className="default-note-icon"/>)
    } else {
        return (
            <ImageLoader
                className="timeline-icon"
                url={item.icon_url}
                fallbackElement={
                    <ReadFilled className="default-note-icon"/>
                }
            />
        )
    }
}

const dateTimelineIcon = (isFirst: boolean) => {
    return (isFirst) ? <CalendarOutlined className={"timeline-icon"} color={"#f0f0f0"}/> : <div className={"v-bar-icon"}/>
}

const NoteTimelineItem = (props: { n: PeakExternalNote} ) => {
    const { n } = props

    const [hovered, setHovered] = useState(false)

    return (
        <Timeline.Item key={n.id} dot={<NoteAvatar item={n} />} className={"peak-timeline-item"}>
            <div className={"peak-timeline-item-container"} onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div className={"peak-timeline-item-body"}>
                    {(n.note_type === ELEMENT_WEB_NOTE) ? <a target="_blank" href={n.url} className={"subtitle"}>{deriveHostname(n.url)}</a> : <span className={"subtitle"}>Note</span>}
                    <Link to={buildNoteUrl(n.id)}>
                        <span className={"title"}>{ n.title }</span>
                    </Link>
                    <div className="peak-note-tag-section">
                        {n.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                    </div>
                </div>
                <NoteItemMetadataContainer note={n} hovered={hovered}/>
            </div>
        </Timeline.Item>
    )
}

