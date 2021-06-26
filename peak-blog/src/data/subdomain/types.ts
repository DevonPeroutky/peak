export interface SubdomainAuthor {
    email: string
    given_name: string
    family_name: string
    last_name: string
    id: string
    image_url: string
    peak_user_id: string
}

export interface Subdomain {
    id: string
    description: string
    subdomain: string
    title: string
    cover_image_url: string | null
    fav_icon_url: string | null
}

export interface SubdomainResponse {
    author: SubdomainAuthor
    subdomain: Subdomain
}

export const INITIAL_SUBDOMAIN_PAYLOAD = {
    author: null,
    subdomain: null
}

export enum SUBDOMAIN_LOADING_STATE {
    TBD,
    LOADING,
    FAILED_TO_DERIVE,
    FAILED_TO_LOAD,
    LOADED
}