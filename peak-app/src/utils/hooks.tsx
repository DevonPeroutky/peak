import {useHistory, useLocation} from "react-router-dom";
import {message, notification} from "antd";
import {batch, useDispatch, useSelector} from "react-redux";
import {AppState} from "../redux";
import { setUserHierarchy} from "../redux/slices/user/userSlice";
import {
    updatePageContents,
    updatePageTitle
} from "../redux/slices/wikiPageSlice";
import {Node} from "slate";
import {EXISTING_PEAK_USER_ID} from "../constants/constants";
import peakAxiosClient from "../client/axiosConfig"
import { debounce } from "lodash";
import {useCallback, useEffect, useState} from 'react';
import {
    PeakPage,
    PeakTopic,
    sortTopicsAndTheirPages,
    updatePageTitleInSidebar
} from "../redux/slices/topicSlice";
import {useUpdatePageInHierarchy} from "./hierarchy";
import {updatePage} from "./requests";
import {useQuery} from "./urls";
import {FutureRead} from "../redux/slices/readingListSlice";
import {CHROME_EXTENSION} from "../common/rich-text-editor/editors/chrome-extension/constants";
import {Peaker} from "../types";
import {PeakTopicNode} from "../redux/slices/user/types";
import {endSavingPage, setEditing, useActiveEditorState} from "../redux/slices/activeEditor/activeEditorSlice";
import {useNotes} from "../client/notes";
import {SCRATCHPAD_ID} from "../common/rich-text-editor/editors/scratchpad/constants";
import {PeakExternalNote, PeakWikiPage, ScratchPad} from "../types/notes";
import {PeakWikiState} from "../types/editors";
const R = require('ramda');

// --------------------------------------------------
// Fetching from Redux
// --------------------------------------------------
export function useOnlineStatus() {
    return useSelector<AppState, boolean>(state => state.electron.isOnline);
}

export function useScratchpad() {
    return useSelector<AppState, ScratchPad>(state => state.peakWikiState[SCRATCHPAD_ID] as ScratchPad);
}

export function useChromeExtEditorState() {
    return useSelector<AppState, PeakWikiPage>(state => state.peakWikiState[CHROME_EXTENSION]);
}

export function useCurrentUser() {
    return useSelector<AppState, Peaker>(state => state.currentUser);
}

export function useFutureReads() {
    return useSelector<AppState, FutureRead[]>(state => state.futureReads);
}

export function useIsContextElectron() {
    const query = useQuery();
    const desktopLoginParam: string | null = query.get("desktop-login")
    return desktopLoginParam != null && desktopLoginParam == "true"
}

export function useLinkedUserId() {
    const query = useQuery();
    const linkedUserId: string | null = query.get(EXISTING_PEAK_USER_ID)
    return linkedUserId
}

export function useTopics() {
    return sortTopicsAndTheirPages(useSelector<AppState, PeakTopic[]>(state => state.topics));
}

export function useCurrentTopic(topicId: string) {
    return useSelector<AppState, PeakTopic>(state => state.topics.find(t => t.id === topicId)!);
}

export function useIsFullscreen() {
    return useSelector<AppState, boolean>(state => state.electron.isFullscreen);
}

export function useJournalHotkeyPressed() {
    return useSelector<AppState, boolean>(state => state.electron.journalHotKeyPressed);
}

// export function useJournalEditingState() {
//     const peakWikiState: PeakWikiState = useSelector<AppState, PeakWikiState>(state => state.peakWikiState);
// }

/**
 * Use this for getting the current page location
 */
export function useCurrentPageId() {
    const location = useLocation();
    const url = location.pathname.split("/");
    const currentPageId = url.pop()!;
    return currentPageId
}

/**
 * Use this for getting the current wiki page. Do not use this externally for just getting the page id, as this will come
 * back null for pages that are not wiki Pages.
 */
export function useCurrentPage(): PeakWikiPage | PeakExternalNote {
    const history = useHistory()
    const location = useLocation();
    const notes = useNotes()
    const peakWikiState: PeakWikiState = useSelector<AppState, PeakWikiState>(state => state.peakWikiState);
    const url = location.pathname.split("/");
    const currentPageId = url.pop()!;
    const pageType = url.pop()!;

    if (pageType === "notes") {
        const note: PeakExternalNote = notes.find(n => n.id === currentPageId)

        if (!note) {
            console.log(`That note seems to no longer exist`)
            history.push(`/home/notes`)
            return
        }

        return note
    } else {
        return peakWikiState[currentPageId];
    }
}

// --------------------------------------------------
// General Purpose
// --------------------------------------------------
export function useKeyPress(targetKey: string) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true

    // @ts-ignore
    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    // @ts-ignore
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

export const useDetermineNextLink = () => {
    const topics = useTopics()

    return (pageId: string) => {
        const allPages: PeakPage[] = topics.flatMap(t => t.pages);
        const pageIndex = allPages.findIndex(p => p.id === pageId);

        if (pageIndex < 1) {
            return `/home`
        } else {
            const newPage: PeakPage = allPages[pageIndex - 1];
            const topic = topics.find(t => t.pages.find(p => p.id === newPage.id) !== undefined)!;
            return `/topic/${topic.id}/wiki/${newPage.id}`;
        }
    }
};


// --------------------------------------------------
// Publish Page Updates
// --------------------------------------------------
export function usePagePublisher() {
    const dispatch = useDispatch();
    const currentWikiPage = useCurrentPage();
    return () => {
        dispatch(setEditing({ isEditing: false }));
        notification.success({ message: "Published", duration: 1});
    }
}

export function useSavePageRequest() {
    const user: Peaker = useSelector<AppState, Peaker>(state => state.currentUser);
    const topics: PeakTopic[] = useTopics()
    const deriveNewHierarchy = useUpdatePageInHierarchy()

    return (newValue: Node[], pageTitle: string, pageId: string) => {
        // TODO: This breaks with CodeEditing in Notes because the pageId is different.
        const currentTopic: PeakTopic | undefined = topics.find(t => t.pages.map(p => p.id).includes(pageId))!
        const newHierarchy = (currentTopic) ? deriveNewHierarchy(newValue, currentTopic.id, pageId) : user.hierarchy
        return updatePage(user.id, pageId, {body: newValue, title: pageTitle}, newHierarchy)
    }
}

function usePageSaver() {
    const dispatch = useDispatch();
    const savePage = useSavePageRequest()
    const editorState = useActiveEditorState()

    return (newValue: Node[], pageTitle: string, pageId: string) => {
        const anyActiveCodeEditors: boolean = R.any(a => a, R.values(editorState.focusMap))
        if (anyActiveCodeEditors) {
            console.log("NOT SUBMITTING")
            // @ts-ignore
            return
        }

        return savePage(newValue, pageTitle, pageId)
            .then((res) => {
                const newHierarchy: PeakTopicNode[] = res.data.hierarchy
                const newPage: PeakWikiPage = res.data.page
                batch(() => {
                    dispatch(endSavingPage())
                    dispatch(setUserHierarchy(newHierarchy))
                    dispatch(updatePageContents({
                        pageId: pageId,
                        body: newPage.body as Node[],
                        title: newPage.title
                    }));
                })
            }).catch((err) => {
                console.log(err)
                notification.error({message: "Failed to save the page. Please try again or let Devon know it failed"})
            })
    }
}

export function useDebounceWikiSaver() {
    const savePage = usePageSaver();

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(savePage, 1500), [])
}

// --------------------------------------------------
// Journal Requests
// --------------------------------------------------
function useSaveJournalEntryRequest() {
    const user: Peaker = useSelector<AppState, Peaker>(state => state.currentUser);

    return (date: string, newValue: Node[]) => {
        return peakAxiosClient.put(`/api/v1/users/${user.id}/journal?date=${date}`, {
            "journal-entry": {
                body: newValue,
            }
        })
    }
}

const useUpdatePageTitleEverywhere = () => {
    const dispatch = useDispatch()
    return (currentWikiPageId: string, newTitle: string) => {
        dispatch(updatePageTitle({ pageId: currentWikiPageId, title: newTitle }));
        dispatch(updatePageTitleInSidebar({ pageId: currentWikiPageId, newTitle: newTitle }));
    }
};

export function useDebouncePageTitleUpdater() {
    const updatePageTitle = useUpdatePageTitleEverywhere();

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(updatePageTitle, 1000), [])
}
