import {upsertNote} from "../redux/slices/noteSlice";
import {fetchNewestNote} from "../client/notes";
import {Peaker} from "../types";
import {currentUserInRedux} from "../redux/utils";
import {store} from "../redux/store";
import {PeakExternalNote} from "../types/notes";

export function newestNodeAcrossAllAcounts(): Promise<PeakExternalNote | null> {
    const currentUser: Peaker = currentUserInRedux()
    return fetchNewestNote(currentUser)
}

export function buildNoteUrl(noteId: string) {
    return `/home/notes/${noteId}`
}

export const waitForNoteToBeAdded = (note: PeakExternalNote) => new Promise<void>((resolve, reject) => {
    // do anything here
    store.dispatch(upsertNote(note))
    resolve()
})