interface PeakBlogConfig {
    web_protocol: string
    backend_domain: string
    blog_domain: string
    env: string
}

const dev: PeakBlogConfig = {
    web_protocol: "http",
    blog_domain: "localhost:3000",
    backend_domain: "localhost:4000",
    env: "dev",
}

const prod: PeakBlogConfig = {
    web_protocol: "https",
    blog_domain: process.env.REACT_APP_BLOG_ADDRESS || "you-need-to-set-this.com",
    backend_domain: process.env.REACT_APP_BACKEND_SERVER_ADDRESS || "you-need-to-set-this.com",
    env: "prod",
}

console.log(`General: `, process.env)
console.log(`ENV: `, process.env.ENV)
console.log(`NEXT_PUBLIC_ENV:: `, process.env.NEXT_PUBLIC_ENV)
const config = process.env.NEXT_PUBLIC_ENV === 'dev' ? dev : prod

console.log(`THE CONFIG `, config)

export default {
    ...config
};

