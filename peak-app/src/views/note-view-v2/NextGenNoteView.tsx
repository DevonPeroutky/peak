import React, {useEffect, useState} from 'react'
import {useCurrentNote, useDebouncePeakNoteSaver, useSpecificNote} from "../../client/notes";
import {useCurrentUser} from "../../utils/hooks";
import {STUB_BOOK_ID} from "../../redux/slices/noteSlice";
import {PeakTag} from "../../types";
import {useDispatch} from "react-redux";
import {beginSavingPage, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import {Node} from "slate";
import {EMPTY_BODY_WITH_TITLE} from "../../common/rich-text-editor/editors/constants";
import {equals} from "ramda";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {PeakEditor} from "../../common/rich-text-editor/editorFactory";
import {wikiTitleEnforcer} from "../../common/rich-text-editor/editors/wiki/config";
import {NoteTagSelect} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./next-gen-note-view.scss"
import {ELEMENT_TITLE} from "component-library";
import {PublishModal} from "../../common/modals/publish/PublishModal";
import {PeakLearningNote} from "../../types/notes";

// Used exclusively for Learnings
export const NextGenNoteView = (props: { currentNote: PeakLearningNote, selected_tags: PeakTag[] }) => {
    const { currentNote, selected_tags } = props
    const dispatch = useDispatch()

    const editorState = useActiveEditorState()
    const currentUser = useCurrentUser()
    const noteSaver = useDebouncePeakNoteSaver()
    const noteInRedux = useCurrentNote()
    const bodyContent: Node[] = (currentNote) ? currentNote.body : EMPTY_BODY_WITH_TITLE
    const [noteContent, setNoteContent] = useState<Node[]>(bodyContent)

    const currentPageId = `note-${(currentNote) ? currentNote.id : STUB_BOOK_ID}`

    const updateNoteContent = (newBody: Node[]) => {
        if (!equals(newBody, noteContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            setNoteContent(newBody)

            const currentTitle = Node.string(newBody[0]) || "untitled"
            noteSaver(currentUser, currentNote.id, { body: newBody as Node[], title: currentTitle })
        }
    }

    useEffect(() => {
        const noteBodyInRedux: Node[] = noteInRedux.body

        if (equals(noteBodyInRedux, noteContent)) {
            console.log(`No outside updates were made to Redux`)
        } else {
            setNoteContent(noteBodyInRedux)
        }
    }, [noteInRedux.body])

    const { plugin: nodeSelectPlugin, getNodeContentSelectProps } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });

    return (
        <div className={"peak-note-view-container"}>
            <NoteTagSelect selected_tags={selected_tags} note_id={currentNote.id}/>
            <PeakEditor
                additionalPlugins={[nodeSelectPlugin, wikiTitleEnforcer]}
                onChange={updateNoteContent}
                getNodeContentSelectProps={getNodeContentSelectProps}
                initialValue={noteContent}
                currentPageId={currentPageId}
                placeholderOverrides={[{
                    key: ELEMENT_TITLE,
                    placeholder: 'Give your note a Title',
                    hideOnBlur: false,
                }]}
            />
            <PublishModal artifact={currentNote}/>
        </div>
    )
}
