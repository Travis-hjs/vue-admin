/**
 * 项目配置模块
 */
const config = (function () {
  /** 当前项目运行地址 */
  let url = location.origin;
  /** 当前环境 */
  let env: "dev" | "test" | "prod" = "dev";
  /** 请求域名 */
  let requestUrl = "";

  // 测试环境
  if (location.hostname === "test.com") {
    env = "test";
    requestUrl = `https://api.test.com`;
    url = "https://test.com";
  }

  // 正式环境
  if (location.hostname === "travis-hjs.github.io") {
    env = "prod";
    requestUrl = "https://api.prod.com";
    url = "https://prod.com";
  }

  return {
    /** 请求超时毫秒 */
    get requestTimeout() {
      return 8000;
    },
    /** `api`请求域名 */
    get apiUrl() {
      return requestUrl;
    },
    /** 是否开发环境 */
    get isDev() {
      return env === "dev";
    },
    /** 当前项目运行地址 */
    get webUrl() {
      return url;
    },
  }
})();

export default config;