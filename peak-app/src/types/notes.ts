import {Node} from "slate";
import {PeakKnowledgeKeyOption} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/types";

export interface EditableNote {
    id: string,
    title: string,
    inserted_at?: Date,
    body: Node[], // Should probably be Node[] or better yet --> SlateDocument
    privacy_level?: string,
}

export interface Publishable {
    user_id: string

    // The metadata subtitle to be displayed on the blog
    description?: string
}

export interface PeakNote extends EditableNote {
    note_type: PeakKnowledgeKeyOption,
    cover_image_url?: string
    tag_ids: string[]

    // Is this necessary?
    updated_at?: string
}

export interface ScratchPad extends EditableNote {}

export interface PeakWikiPage extends EditableNote {}

export interface PeakBook extends PeakNote, Publishable {
    author?: string
}

export interface PeakLearningNote extends PeakNote, Publishable {}

export interface PeakExternalNote extends PeakNote, Publishable {
    // fav_icon of the website
    icon_url: string

    // url of the og_page
    url: string
}

export interface PublishableArtifact extends EditableNote, PeakNote, Publishable {
}
