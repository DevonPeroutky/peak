import 'tippy.js/dist/tippy.css'
import React, { useMemo } from 'react'
import {
    ELEMENT_H1,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    SlatePlugins,
    ToolbarSearchHighlight,
    createAlignPlugin,
    createAutoformatPlugin,
    createBlockquotePlugin,
    createBoldPlugin,
    createCodeBlockPlugin,
    createCodePlugin,
    createExitBreakPlugin,
    createHeadingPlugin,
    createHighlightPlugin,
    createHistoryPlugin,
    createKbdPlugin,
    createImagePlugin,
    createItalicPlugin,
    createLinkPlugin,
    createListPlugin,
    createMediaEmbedPlugin,
    createNodeIdPlugin,
    createNormalizeTypesPlugin,
    createParagraphPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSelectOnBackspacePlugin,
    createSoftBreakPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createTablePlugin,
    createTodoListPlugin,
    createTrailingBlockPlugin,
    createUnderlinePlugin,
    createDeserializeHTMLPlugin,
    useFindReplacePlugin,
    useMentionPlugin,
    createSlatePluginsComponents,
    ELEMENT_MENTION,
    withProps,
    ELEMENT_CODE_BLOCK,
    CodeBlockElement,
    MentionElement,
    MentionNodeData,
    createSlatePluginsOptions,
    MentionSelect,
} from '@udecode/slate-plugins'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Search } from '@styled-icons/material/Search'
import {
    optionsExitBreakPlugin,
    optionsMentionPlugin,
    optionsResetBlockTypePlugin,
    optionsSoftBreakPlugin,
} from "./playground-utils";
import {withStyledDraggables} from "./config/withStyledDraggables";
import {optionsAutoformat} from "./config/autoformatRules";
import {editableProps, options} from "./defaultOptions";
import { withStyledPlaceHolders } from './config/withStyledPlaceholders'
import {initialValuePlayground} from "./config/initialValues";

const id = 'Examples/Playground'


export const MENTIONABLES: MentionNodeData[] = [{ value: '0', name: 'Aayla Secura', email: 'aayla_secura@force.com' }]
export const renderMentionLabel = (mentionable: MentionNodeData) => {
    const entry = MENTIONABLES.find((m) => m.value === mentionable.value);
    if (!entry) return 'unknown option';
    return `${entry.name} - ${entry.email}`;
};

export const Plugins = () =>  {
    let styledComponents = createSlatePluginsComponents({
        [ELEMENT_MENTION]: withProps(MentionElement, {
            renderLabel: renderMentionLabel,
        }),
        [ELEMENT_CODE_BLOCK]: withProps(CodeBlockElement, {
            styles: {
                root: {
                    backgroundColor: '#111827',
                    selectors: {
                        code: {
                            color: 'white',
                        },
                    },
                },
            },
        }),
    });
    styledComponents = withStyledPlaceHolders(styledComponents);
    styledComponents = withStyledDraggables(styledComponents);

    const defaultOptions = createSlatePluginsOptions();

    const Editor = () => {
        // const { setSearch, plugin: searchHighlightPlugin } = useFindReplacePlugin();
        // const { getMentionSelectProps, plugin: mentionPlugin } = useMentionPlugin(
        //     optionsMentionPlugin
        // );

        const pluginsMemo = useMemo(() => {
            const plugins = [
                createReactPlugin(),
                createHistoryPlugin(),
                createParagraphPlugin(),
                createBlockquotePlugin(),
                // createTodoListPlugin(),
                // createHeadingPlugin(),
                // createImagePlugin(),
                // createLinkPlugin(),
                // createListPlugin(),
                // createTablePlugin(),
                // createMediaEmbedPlugin(),
                // createCodeBlockPlugin(),
                // createAlignPlugin(),
                // createBoldPlugin(),
                // createCodePlugin(),
                // createItalicPlugin(),
                // createHighlightPlugin(),
                // createUnderlinePlugin(),
                // createStrikethroughPlugin(),
                // createSubscriptPlugin(),
                // createSuperscriptPlugin(),
                // createKbdPlugin(),
                // createNodeIdPlugin(),
                // createAutoformatPlugin(optionsAutoformat),
                // createResetNodePlugin(optionsResetBlockTypePlugin),
                // createSoftBreakPlugin(optionsSoftBreakPlugin),
                // createExitBreakPlugin(optionsExitBreakPlugin),
                // createNormalizeTypesPlugin({
                //     rules: [{ path: [0], strictType: ELEMENT_H1 }],
                // }),
                // createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
                // createSelectOnBackspacePlugin({ allow: ELEMENT_IMAGE }),
                // mentionPlugin,
                // searchHighlightPlugin,
            ];

            // plugins.push(createDeserializeHTMLPlugin({ plugins }));

            return plugins;
        }, [options]);
        // }, [mentionPlugin, options, searchHighlightPlugin]);

        console.log(`COMPONENTS `, styledComponents)
        console.log(`Plugins `, pluginsMemo)
        console.log(`Options `, defaultOptions)
        return (
            <SlatePlugins
                id="playground"
                plugins={pluginsMemo}
                components={styledComponents}
                options={defaultOptions}
                editableProps={editableProps}
                initialValue={initialValuePlayground}
            >
                {/*<ToolbarSearchHighlight icon={Search} setSearch={setSearch} />*/}
                {/*<MentionSelect*/}
                {/*    {...getMentionSelectProps()}*/}
                {/*    renderLabel={renderMentionLabel}*/}
                {/*/>*/}
            </SlatePlugins>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Editor />
        </DndProvider>
    );
}