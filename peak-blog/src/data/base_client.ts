/**
 * TODO: Configure node-fetch with the default config that axios is using.
 */
import axios from 'axios';
import config from "../utils/env-vars"

const defaultConfig = {
    baseURL: `${config.web_protocol}://${config.backend_domain}`
}

export const blogAxiosClient = axios.create(defaultConfig);
export default blogAxiosClient;