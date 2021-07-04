import {SubdomainResponse} from "../subdomain/types";
import blogAxiosClient from "../base_client";
import { AxiosResponse } from "axios";

export function create_subscriber(subdomain_id: string, email: string, peak_user_id?:string): Promise<AxiosResponse<SubdomainResponse>> {
    return blogAxiosClient.post(`/blog/v1/subscribe`, {
        subscriber: {
            email: email,
            subdomain_id: subdomain_id,
            peak_user_id: peak_user_id
        }
    }).then(res => {
        console.log(res)
        return res
    })
}
