import * as React from 'react';
import { useEffect, useRef } from 'react';
import {classNamesFunction, IStyleFunctionOrObject, styled} from '@uifabric/utilities';
import { ReactEditor} from 'slate-react';
import {
    getMentionSelectStyles,
    getPreventDefaultHandler,
    PortalBody,
    useEditorRef,
    MentionElementStyleProps,
    MentionElementProps,
    RootStyleSet,
    getRootClassNames
} from "@udecode/slate-plugins";
import {Range} from "slate";
import {Empty, Tag} from "antd";
import {trim} from "lodash";
import {PeakNodeSelectListItem} from "../types";
import "./node-content-select.scss"
import {capitalize_and_truncate} from "../../../../../utils/strings";
import {OpenLibraryBook} from "../../../../../client/openLibrary";
import {convertOpenLibraryBookToNodeSelectListItem} from "../utils";
import {UghEditorType} from "../../../types";

export interface NodeContentSelectProps {
    /**
     * Additional class name to provide on the root element.
     */
    className?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<MentionElementStyleProps, RootStyleSet>;
    /**
     * Range from the mention trigger to the cursor
     */
    at: Range | null;
    /**
     * List of mentionable items
     */
    options: PeakNodeSelectListItem[];
    /**
     * Index of the selected option
     */
    valueIndex: number;
    /**
     * Callback called when clicking on a mention option
     */
    onAddNodeContent?: (editor: UghEditorType, option: PeakNodeSelectListItem) => void;
    /** True if the menu is currently on the default menu of node types*/
    nodeContentSelectMode: boolean;

    openLibraryBooks: OpenLibraryBook[]
}

// const getClassNames = classNamesFunction();
const getClassNames = getRootClassNames<
    MentionElementStyleProps,
    RootStyleSet
>();

const NodeContentSelectBase = ({
                                      className,
                                      styles,
                                      at,
                                      options,
                                      valueIndex,
                                      onAddNodeContent,
                                      nodeContentSelectMode, openLibraryBooks,
                                      ...props
                                  }: NodeContentSelectProps) => {
    const classNames = getClassNames(styles, {
        className,
    });

    const ref: any = useRef();
    const editor = useEditorRef();

    useEffect(() => {
        if (at) {
            const el = ref.current;
            const domRange = ReactEditor.toDOMRange(editor, at);
            const rect = domRange.getBoundingClientRect();
            if (el) {
                el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                el.style.left = `${rect.left + window.pageXOffset}px`;
            }
        }
    }, [editor, at]);
    if (!at || (nodeContentSelectMode && options.length === 0)) {
        return null;
    }

    return (
        <PortalBody>
            <div ref={ref} className={classNames.root} {...props}>
                <OptionList
                    options={options}
                    valueIndex={valueIndex}
                    classNames={classNames}
                    onAddNodeContent={onAddNodeContent}
                    nodeContentSelectMode={nodeContentSelectMode}
                    editor={editor}
                    openLibraryBooks={openLibraryBooks}/>
            </div>
        </PortalBody>
    );
};

const OptionList = ({options, valueIndex, nodeContentSelectMode, classNames, onAddNodeContent, editor, openLibraryBooks}) => {
    if (options.length === 0) {
        return (
            <Empty description={"No books yet! Start typing..."} className={"empty-books"}/>
        )
    } else {
        const numInternalOptions: number = options.length
        return (
            <>
                <div className="peak-internal-results">
                    {options.map((option, i) =>
                        <NodeContentSelectItem
                            key={`${i}${option.label}`}
                            option={option}
                            i={i}
                            valueIndex={valueIndex}
                            classNames={classNames}
                            onAddNodeContent={onAddNodeContent}
                            editor={editor}/>)}
                </div>
                {
                    ((openLibraryBooks.length > 0) ?
                            <div className="peak-external-results">
                                <div className={"ant-select-item ant-select-item-group"}>Select new book</div>
                                { openLibraryBooks.map(convertOpenLibraryBookToNodeSelectListItem).map((option, i) =>
                                <NodeContentSelectItem
                                    key={`${i}${option.label}`}
                                    option={option}
                                    i={numInternalOptions + i}
                                    valueIndex={valueIndex}
                                    classNames={classNames}
                                    onAddNodeContent={onAddNodeContent}
                                    editor={editor}/>)}
                            </div>: null)
                }
           </>
        )
    }
}

export const NodeContentSelect = styled(NodeContentSelectBase, getMentionSelectStyles, undefined);

const NodeContentSelectItem = ({option, i, valueIndex, classNames, onAddNodeContent, editor }) => {
    return (
       <div
           key={`${i}${option.label}`}
           className={
               i === valueIndex
                   ? `${classNames.mentionItemSelected} peak-node-content-item-selected`
                   : classNames.mentionItem
           }
           onMouseDown={getPreventDefaultHandler(
               onAddNodeContent,
               editor,
               option
           )}
       >
           <div className={"node-content-select-item-container"}>
               <div className={"icon-container"}>
                   {option.icon}
               </div>
               <div className={"node-content-item"}>
                   <div className={"node-content-item-body"}>
                       <div className={"node-title"}>{capitalize_and_truncate(option.label, 40)}</div>
                       <div className={"node-description"}>{option.description}</div>
                   </div>
                   {(option.hotkeyInstructionArray) ? <Tag className={"node-hotkey"}>{trim(option.hotkeyInstructionArray.join(""), '()')}</Tag> : null}
               </div>
           </div>
       </div>
    )
}