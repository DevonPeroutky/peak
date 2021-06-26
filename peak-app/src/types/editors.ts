import {PeakWikiPage, ScratchPad} from "./notes";

export interface PeakWikiState {
    [key: string]: PeakWikiPage | ScratchPad;
}
