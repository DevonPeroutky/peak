import axios from 'axios';
import React, {useCallback} from "react";
import {debounce} from "lodash";

interface OpenLibraryResponse {
    numFound: number
    start: number
    num_found: number
    docs: OpenLibraryBook[]
}

export interface OpenLibraryBook {
    cover_i: number
    title: string
    title_suggest: string
    author_name: string[]
    author_key: string
    first_publish_year: string
}

// EXAMPLE: http://openlibrary.org/search.json?title=the+lord+of+the+rings
const searchForBookByTitle = (title: string, callBackFunc: (books: OpenLibraryBook[]) => void) => {
    const url = `https://openlibrary.org/search.json?title=${title}`
    console.log(`SEARCHING FOR ${title}`)
    axios.get<OpenLibraryResponse>(url).then(res => {
        console.log(`SETTING OL books`, res.data.docs.slice(0, 5))
        callBackFunc(res.data.docs.slice(0, 5))
    })
}

export function useDebounceOpenLibrarySearcher() {

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(searchForBookByTitle, 500, {
        'trailing': true
    }), [])
}

// EXAMPLE: http://covers.openlibrary.org/b/id/8814444-L.jpg
export function getCoverImageUrl(openLibraryBookId: number, size: "S" | "M" | "L"): string {
    return `https://covers.openlibrary.org/b/id/${openLibraryBookId}-${size}.jpg`
}
