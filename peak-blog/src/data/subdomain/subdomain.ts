import { SubdomainResponse } from "./types";
import {AxiosResponse} from "axios";
import blogAxiosClient from "../base_client";

export function fetch_subdomain(subdomain: string): Promise<AxiosResponse<SubdomainResponse>> {
    return blogAxiosClient.get<SubdomainResponse>(`/blog/v1?subdomain=${subdomain}`)
}
