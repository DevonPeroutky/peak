import {
    ELEMENT_LINK,
    getLinkDeserialize,
    getRenderElement,
    getSlatePluginTypes, KeyboardHandler,
    SlatePlugin,
    withLink,
    WithLinkOptions
} from "@udecode/slate-plugins";
import {Editor, Node, Range} from "slate";
import {closeLinkMenu, openEditLinkMenu, openEmptyLinkMenu} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {store} from "../../../../redux/store";
import {UghEditorType} from "../../types";
import {PeakHyperlinkState} from "../../../../types/editor-state";

const peakLinkOnKeyDownHandler: KeyboardHandler = (editor: UghEditorType) => (event) => {
    if (event.metaKey && event.key == 'l') {
        event.preventDefault();
        // @ts-ignore
        const [...match] = Editor.nodes(editor, { match: n => n.type === "a" });

        /**
         * - This is an existing Link
         * - Need to get current node --> if link --> populate
         */
        if (match.length > 0) {
            const theNode = match[0]
            const linkNode: Node = theNode[0]
            const text: string = Node.string(linkNode)
            // @ts-ignore
            const url: string = linkNode.url as string
            // @ts-ignore
            const linkId: string = linkNode.id as string
            // @ts-ignore
            const linkSelection: Range = linkNode.selection_range as Range
            const currentHyperlink: PeakHyperlinkState = {
                currentHyperLinkId: linkId,
                currentLinkUrl: url,
                currentText: text,
                currentSelection: linkSelection
            };
            store.dispatch(openEditLinkMenu({ hyperlinkState: currentHyperlink} ));
        } else {
            store.dispatch(openEmptyLinkMenu());
        }
    }

    if (event.key === 'Escape') {
        store.dispatch(closeLinkMenu());
    }
}
export const createPeakLinkPlugin = (options?: WithLinkOptions): SlatePlugin => ({
    pluginKeys: ELEMENT_LINK,
    renderElement: getRenderElement(ELEMENT_LINK),
    deserialize: getLinkDeserialize(),
    inlineTypes: getSlatePluginTypes(ELEMENT_LINK),
    withOverrides: withLink(options),
    onKeyDown: peakLinkOnKeyDownHandler,
});