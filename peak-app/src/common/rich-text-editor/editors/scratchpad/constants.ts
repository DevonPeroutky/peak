import {INITIAL_PAGE_STATE} from "../../../../constants/editor";
import { Node } from "slate";
import {ScratchPad} from "../../../../types/notes";

export const SCRATCHPAD_ID = "scratchpad"
export const SCRATCHPAD_TITLE = "scratchpad"

export const INITIAL_SCRATCHPAD_STATE: ScratchPad = {
    ...INITIAL_PAGE_STATE,
    body: INITIAL_PAGE_STATE.body as Node[],
    id: SCRATCHPAD_ID,
    title: SCRATCHPAD_TITLE
}