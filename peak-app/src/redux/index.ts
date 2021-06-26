import {PeakTopic} from "./slices/topicSlice";
import {FutureRead} from "./slices/readingListSlice";
import {QuickSwitcherState} from "./slices/quickSwitcherSlice";
import {ElectronState} from "./slices/electronSlice";
import {DisplayPeaker} from "./slices/userAccountsSlice";
import {Peaker, PeakTag} from "../types";
import {HelpModalState} from "./slices/helpModal/helpModalSlice";
import {BlogConfiguration} from "./slices/blog/types";
import {PeakAccessToken} from "../client/tokens";
import {PeakWikiState} from "../types/editors";
import {PeakEditorState} from "../types/editor-state";
import {PeakExternalNote} from "../types/notes";

export const GLOBAL_APP_KEYS = ["electron", "quickSwitcher", "userAccounts", "activeEditorState", "helpModal"]

export interface AppState {
    topics: PeakTopic[],
    currentUser: Peaker,
    userAccounts: DisplayPeaker[],
    futureReads: FutureRead[],
    peakWikiState: PeakWikiState,
    quickSwitcher: QuickSwitcherState,
    activeEditorState: PeakEditorState,
    electron: ElectronState,
    tags: PeakTag[],
    notes: PeakExternalNote[],
    helpModal: HelpModalState,
    blogConfiguration: BlogConfiguration,
    tokens: PeakAccessToken[]
}