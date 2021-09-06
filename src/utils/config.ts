/**
 * 项目配置模块
 */
const config = (function() {
    const _env = process.env.NODE_ENV === "development" ? "dev" : "prod";

    const url = {
        dev: `http://${location.host}`,
        prod: "https://abc.com"
    }

    return {
        /** 请求超时毫秒 */
        get requestOvertime() {
            return 8000;
        },
        /** `api`请求域名 */
        get apiUrl() {
            return url[_env];
        },
        /** 当前环境模式 */
        get env() {
            return _env;
        }
    }
})();

export default config;