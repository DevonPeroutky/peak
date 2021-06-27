import peakAxiosClient from "./axiosConfig";
import {PeakPost} from "component-library";
import {OG_ARTIFACT_TYPE} from "../types/notes";

export const createPeakPostRequest = (userId: string, subdomain: string, post_payload: PeakPost, artifact_type: OG_ARTIFACT_TYPE): Promise<PeakPost> => {
    return peakAxiosClient
        .post<{post: PeakPost}>(`/api/v1/users/${userId}/blog/${subdomain}/post?origin_artifact_type=${artifact_type}`, { post: post_payload })
        .then(res => res.data.post)
}
