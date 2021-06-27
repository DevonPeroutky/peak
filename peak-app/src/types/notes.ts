import {Node} from "slate";
import {PeakKnowledgeKeyOption} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/types";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {WIKI_PAGE} from "../redux/slices/posts/types";

interface EditableNote {
    id: string,
    title: string,
    inserted_at?: Date,
    body: Node[], // Should probably be Node[] or better yet --> SlateDocument
    privacy_level?: string,
}

interface Publishable {
    user_id: string
    artifact_type: PeakKnowledgeKeyOption | WIKI_PAGE

    // The metadata subtitle to be displayed on the blog
    description?: string
    cover_image_url?: string
    tag_ids: string[]
}

interface Note extends EditableNote {
    note_type: PeakKnowledgeKeyOption,
    cover_image_url?: string

    // Is this necessary?
    updated_at?: string
    tag_ids: string[]
}

export interface ScratchPad extends EditableNote {}

export interface PeakWikiPage extends EditableNote {}

export interface PeakBook extends Note, Publishable {
    author?: string
}

export interface PeakLearningNote extends Note, Publishable {}

export interface PeakExternalNote extends Note, Publishable {

    // fav_icon of the website
    icon_url: string

    // url of the og_page
    url: string
}

export type PeakNote = PeakBook | PeakLearningNote | PeakExternalNote


export interface PublishableArtifact extends EditableNote, Publishable {

}
