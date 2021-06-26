import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {sort, uniqBy} from "ramda";
import {PeakNote} from "../../types/notes";

export const STUB_BOOK_ID = "new-book"

const emptyBookList: PeakNote[] = []

const noteOrderingByDate = (a: PeakNote, b: PeakNote) => {
    return (a.inserted_at <= b.inserted_at) ? 1 : -1
};

export const noteSlice = createSlice({
    name: 'notes',
    initialState: emptyBookList,
    reducers: {
        setNotes(state, action: PayloadAction<PeakNote[]>) {
            return sort(noteOrderingByDate, action.payload);
        },
        appendNotes(state, action: PayloadAction<PeakNote[]>) {
            const notesToAppend: PeakNote[] = action.payload
            const newNotes: PeakNote[] = sort(noteOrderingByDate, uniqBy(n => n.id, [...state, ...notesToAppend]))
            return newNotes
        },
        upsertNote(state, action: PayloadAction<PeakNote>) {
            const noteToUpsert: PeakNote = action.payload
            const newNotes: PeakNote[] = sort(noteOrderingByDate, [action.payload, ...state.filter(n => n.id !== noteToUpsert.id)])
            return newNotes
        },
        updateNote(state, action: PayloadAction<PeakNote>) {
            const updatedNote: PeakNote = action.payload
            return state.map(n => n.id === updatedNote.id ? updatedNote : n);
        },
        deleteNote(state, action: PayloadAction<string>) {
            return state.filter(t => t.id !== action.payload)
        }
    }
});

export const { setNotes, upsertNote, deleteNote, updateNote, appendNotes } = noteSlice.actions;
export default noteSlice.reducer;
