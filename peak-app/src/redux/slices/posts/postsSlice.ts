import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {store} from "../../store";
import {createPeakPostRequest} from "../../../client/posts";
import {PeakPost} from "component-library";
import {OG_ARTIFACT_TYPE} from "../../../types/notes";

export const postSlice = createSlice({
    name: 'posts',
    initialState: [] as PeakPost[],
    reducers: {
        addPeakPost(state, action: PayloadAction<PeakPost>) {
            return [...state, action.payload]
        },
        loadBlogPosts(state, action: PayloadAction<PeakPost[]>) {
            return action.payload
        },
    }
});

export const createPeakPost = (userId: string, subdomain: string, post_payload: PeakPost, og_artifact_type: OG_ARTIFACT_TYPE): Promise<PeakPost> => {
    return createPeakPostRequest(userId, subdomain, post_payload, og_artifact_type).then(res => {
        store.dispatch(addPeakPost(res))
        return res
    })
}

const { addPeakPost } = postSlice.actions;
export default postSlice.reducer;
