const config = {
    /** 开发环境信息 */
    dev: {
        /** `api`请求域名 */
        domain: ""
    },
    /** 生产环境信息 */
    produce: {
        /** `api`请求域名 */
        domain: ""
    },
    /** 获取当前环境下的`api`请求域名 */
    getDomain() {
        const key = process.env.NODE_ENV == "development" ? "dev" : "produce";
        return this[key].domain;
    }
}

export default config;