export enum Visibility {
    private,
    protected,
    public
}

export enum ReactionType {
    upvote
}

export enum Published {
    draft,
    published
}

export interface Reaction {
    user_id: string
    post_id: string
    reaction_type: ReactionType
    inserted_at: Date
}

interface SubDomain {
    user_id: string[]
    peak_user_id: string
    subdomain: string
}

interface SubDomainConfiguration {
    subdomain: string
    name: string
    cover_photo_url: string
    about: string
    icon_url: string
}

export interface HydratedSubdomain extends SubDomain, SubDomainConfiguration {}

