import Vue, { VueConstructor } from "vue";
import { LanguageInfo, LanguageState, LanguageType } from "./types";
import en from "./en";
import ja from "./ja";
import zh from "./zh";

// 自定义的全局类型声明貌似只能写在`main.ts`或者`当前文件`才生效
declare module "vue/types/vue" {
  interface Vue {
    /** 语言类型 */
    $languageType: LanguageType
    /** 当前应用的语言信息 */
    $language: LanguageInfo
    /**
     * 设置语言类型
     * @param val 语言类型
     */
    $setLanguage(val: LanguageType): void;
  }
}

const languageMap = {
  en,
  zh,
  ja
}

const state: LanguageState = {
  type: "zh",
  cache: false
}

const cacheName = "language-current-type";

/** 语言切换全局配置 */
const Language = {
  install(ctx: VueConstructor<Vue>, options: Partial<LanguageState> = {}) {
    // console.log("options >>", options);
    if (options.type) {
      state.type = options.type;
    }
    if (options.cache) {
      state.cache = options.cache;
      const val = sessionStorage.getItem(cacheName) as LanguageType;
      if (val) {
        state.type = val;
      }
    }
    ctx.mixin({
      data() {
        return {
          languageState: state
        }
      },
      computed: {
        $language() {
          const key = this.$languageType as LanguageType;
          return languageMap[key];
        },
        "$languageType": {
          get() {
            return (this as any).languageState.type;
          },
          set(val: LanguageType) {
            (this as any).languageState.type = val;
            if (state.cache) {
              sessionStorage.setItem(cacheName, val);
            }
          }
        }
      },
      methods: {
        $setLanguage(type: LanguageType) {
          this.$languageType = type;
        }
      }
    })
  }
}

export default Language;
