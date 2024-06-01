import zh from "./zh";

/** 语言配置信息 */
export type LanguageInfo = typeof zh;

/** 语言种类 */
export type LanguageType = "zh" | "en" | "ja";

/** 语言状态 */
export interface LanguageState {
  /** 当前应用的语言类型 */
  type: LanguageType
  /** 是否需要缓存操作 */
  cache: boolean
}
