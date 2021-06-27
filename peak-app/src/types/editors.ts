import {PeakWikiPage, ScratchPad} from "./notes";

export interface PeakWikiState {
    [key: string]: PeakWikiPage | ScratchPad;
}

export const WIKI_PAGE = "page"
export type WIKI_PAGE = "page"
