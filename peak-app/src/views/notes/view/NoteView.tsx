import React, {useState} from 'react'
import {useCurrentNote, useDebouncePeakNoteSaver} from "../../../client/notes";
import {useHistory} from "react-router-dom";
import "./note-view.scss"
import {
    ELEMENT_PEAK_BOOK,
    ELEMENT_WEB_NOTE,
    PEAK_LEARNING
} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {PeakNoteEditor} from "./note-editor/PeakNoteEditor";
import {Divider} from "antd";
import {useCurrentUser} from "../../../utils/hooks";
import {useLoadTags} from "../../../utils/tags";
import {PeakTag} from "../../../types";
import {WebNoteHeaderSection} from "./note-header/web-note-header/WebNoteHeader";
import {BookHeaderSection} from "./note-header/book-header/BookHeader";
import {NextGenNoteView} from "../../note-view-v2/NextGenNoteView";
import {PublishModal} from "../../../common/modals/publish/PublishModal";
import {PeakBook, PeakExternalNote, PeakLearningNote, PeakNote} from "../../../types/notes";

export const PeakNoteView = (props) => {
    const history = useHistory()
    const currentNote: PeakNote | undefined = useCurrentNote()
    const noteSaver = useDebouncePeakNoteSaver()
    const currentUser = useCurrentUser()
    const selected_tags: PeakTag[] = useLoadTags((currentNote && currentNote.tag_ids) ? currentNote.tag_ids : [])
    const [title, setTitle] = useState((currentNote) ? currentNote.title : "")
    const [author, setAuthor] = useState((currentNote && currentNote.note_type === ELEMENT_PEAK_BOOK) ? (currentNote as PeakBook).author : "")

    if (!currentNote) {
        history.push(`/home/notes`)
        return null
    }

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        noteSaver(currentUser, currentNote.id, { title: e.target.value })
    }

    const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value)
        noteSaver(currentUser, currentNote.id, { author: e.target.value })
    }

    if (currentNote.note_type === PEAK_LEARNING) {
        return <NextGenNoteView currentNote={currentNote as PeakLearningNote} selected_tags={selected_tags}/>
    }

    return (
        <div className={"peak-note-view-container"}>
            {renderHeader({ currentNote, selected_tags, title, author, onAuthorChange, onTitleChange})}
            <Divider className={"note-divider"}/>
            <PeakNoteEditor note_id={currentNote.id}/>
            <PublishModal artifact={{...currentNote, user_id: currentUser.id, artifact_type: currentNote.note_type}}/>
        </div>
    )
}


interface NoteHeaderProps {
    currentNote: PeakNote,
    selected_tags: PeakTag[],
    title: string,
    author: string,
    onAuthorChange: (author: React.ChangeEvent<HTMLInputElement>) => void,
    onTitleChange: (title: React.ChangeEvent<HTMLInputElement>) => void
}
const renderHeader = (props: NoteHeaderProps) => {
    const { currentNote, author, onAuthorChange, selected_tags, title, onTitleChange } = props

    return (currentNote.note_type === ELEMENT_WEB_NOTE) ?
        <WebNoteHeaderSection
            note={currentNote as PeakExternalNote}
            title={title}
            onTitleChange={onTitleChange}
            selected_tags={selected_tags}/>
        : <BookHeaderSection
            title={title}
            onTitleChange={onTitleChange}
            author={author}
            onAuthorChange={onAuthorChange}
            note_id={currentNote.id}
            cover_image_url={currentNote.cover_image_url}
            selected_tags={selected_tags}/>
}