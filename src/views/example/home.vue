<template>
  <div class="page-home">
    <h2 class="the-title is-line mb-[30px]">Vue3 + Vite + TypeScript 后台管理模板</h2>
    <div class="mb-[40px]">
      <span class="the-tag blue">无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</span>
      <a class="the-tag green" :href="project" target="_blank">项目地址</a>
    </div>
    <h2 class="the-title is-line mb-[30px]">布局操作开关</h2>
    <div class="options-box mb-[40px]">
      <CheckBox class="mb-[20px]" label="显示侧边栏logo" v-model="layoutInfo.showSidebarLogo" />
      <CheckBox class="mb-[20px]" label="显示历史记录标签" v-model="layoutInfo.showTagList" />
      <CheckBox class="mb-[20px]" label="侧边栏展开" v-model="layoutInfo.showSidebar" />
      <CheckBox label="顶部填满" :model-value="layoutInfo.layoutMode === 'full-header'" @change="onMode()" />
    </div>
    <div v-for="item in settingList" :key="item.label + item.key" class="form-item f-vertical">
      <h2 v-if="item.type === 'title'" class="the-title is-line">{{ item.label }}</h2>
      <template v-else>
        <span class="form-label">{{ item.label }}</span>
        <template v-if="item.type === 'color'">
          <input class="the-input" type="text" v-model="styleVariable[item.key]">
          <div class="color-box">
            <input class="color-input" type="color" @change="onColor()" v-model="styleVariable[item.key]">
          </div>
        </template>
        <template v-else>
          <input class="the-input" type="text" v-model="styleVariable[item.key]" @input="e => onInput(e, item.key as Numbers)">
          <span class="form-unit">px</span>
        </template>
      </template>
    </div>
    <div class="pt-[20px] mb-[30px]">
      <button class="the-btn green mini" v-ripple @click="copyStyle()">复制当前配置</button>
      <button class="the-btn yellow mini" v-ripple @click="resetStyle()">重置默认样式</button>
      <button class="the-btn blue mini" v-ripple @click="onPreset('green')">应用预设配置-绿色</button>
      <button class="the-btn blue mini" v-ripple @click="onPreset('black')">应用预设配置-黑色</button>
      <button class="the-btn blue mini" v-ripple @click="onPreset('red')">应用预设配置-红色</button>
      <button class="the-btn blue mini" v-ripple @click="onPreset('purple')">应用预设配置-紫色</button>
    </div>
    <h2 class="the-title is-line mb-[30px]">打赏一下</h2>
    <div class="code-box">
      <img class="hovercode" src="https://travis-hjs.github.io/images/wxcode1.jpg">
      <img class="qrcode" src="https://travis-hjs.github.io/images/reward-code.jpg">
    </div>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import { copyText, inputOnlyNumber, jsonParse, modifyData } from "@/utils";
import { message, messageBox } from "@/utils/message";
import { reactive, onMounted, onUnmounted } from "vue";
import { CheckBox } from "@/components/CheckBox";

const layoutInfo = store.layout.info;

const project = store.projectInfo.link;

function onMode() {
  layoutInfo.layoutMode = layoutInfo.layoutMode === "full-header" ? "" : "full-header";
}

function useDefaultStyle() {
  return {
    /** layout 主题色 */
    themeColor: "#1890FF",
    /** 边框颜色 */
    borderColor: "#d8dce5",
    /** 整体背景颜色 */
    wholeBgColor: "#fff",
    /** 侧边菜单栏宽度 */
    sidebarWidth: 260,
    /** 顶部导航栏高度 */
    navbarHeight: 50,
    /** 页面标签栏高度 */
    tagsHeight: 34,
    /** 主容器内边距 */
    contentPadding: 12,
    /** 主容器背景色 */
    contentBgColor: "#eee",
    /** 页面内边距 */
    pagePadding: 14,
    /** 菜单之间的间隔，上下 */
    menuGap: 4,
    /** 菜单缩进，递增 */
    menuIndent: 22,
    /** 菜单标题字体大小 */
    menuTitleSize: 15,
    /** 菜单标题高度 */
    menuTitleHeight: 44,
    /** 菜单 item 字体大小 */
    menuItemSize: 14,
    /** 菜单 item 高度 */
    menuItemHeight: 38,
    /** 菜单 hover 背景颜色 */
    menuItemHoverBg: "#ecf5ff",
    /** 菜单标题颜色 */
    menuTitleColor: "#555",
    /** 菜单文字颜色 */
    menuTextColor: "#606266",
    /** 菜单左右边距 */
    menuPadding: 16,
  }
}

const styleVariable = reactive(useDefaultStyle());

const getStyleText = () => `
.the-layout {
  --theme-color: ${styleVariable.themeColor};
  --border-color: ${styleVariable.borderColor};
  --whole-bg-color: ${styleVariable.wholeBgColor};
  --sidebar-width: ${styleVariable.sidebarWidth}px;
  --navbar-height: ${styleVariable.navbarHeight}px;
  --tags-height: ${styleVariable.tagsHeight}px;
  --content-padding: ${styleVariable.contentPadding}px;
  --content-bg-color: ${styleVariable.contentBgColor};
  --page-padding: ${styleVariable.pagePadding}px;
  --menu-gap: ${styleVariable.menuGap}px;
  --menu-indent: ${styleVariable.menuIndent}px;
  --menu-title-size: ${styleVariable.menuTitleSize}px;
  --menu-title-height: ${styleVariable.menuTitleHeight}px;
  --menu-item-size: ${styleVariable.menuItemSize}px;
  --menu-item-height: ${styleVariable.menuItemHeight}px;
  --menu-item-hover-bg: ${styleVariable.menuItemHoverBg};
  --menu-title-color: ${styleVariable.menuTitleColor};
  --menu-text-color: ${styleVariable.menuTextColor};
  --menu-padding: ${styleVariable.menuPadding}px;
}
`;

const id = "theme-diy-style";

interface Setting {
  label: string;
  type: "title" | "color" | "number";
  key: keyof typeof styleVariable;
}

const settingList: Array<Setting> = [
  {
    label: "布局颜色配置",
    type: "title",
    key: "themeColor",
  },
  {
    label: "主题色",
    type: "color",
    key: "themeColor",
  },
  {
    label: "边框颜色",
    type: "color",
    key: "borderColor",
  },
  {
    label: "整体背景颜色",
    type: "color",
    key: "wholeBgColor",
  },
  {
    label: "主容器背景色",
    type: "color",
    key: "contentBgColor",
  },
  {
    label: "布局尺寸配置",
    type: "title",
    key: "contentPadding",
  },
  {
    label: "主容器内边距",
    type: "number",
    key: "contentPadding",
  },
  {
    label: "侧边菜单栏宽度",
    type: "number",
    key: "sidebarWidth",
  },
  {
    label: "顶部导航栏高度",
    type: "number",
    key: "navbarHeight",
  },
  {
    label: "页面标签栏高度",
    type: "number",
    key: "tagsHeight",
  },
  {
    label: "页面内边距",
    type: "number",
    key: "pagePadding",
  },
  {
    label: "菜单配置",
    type: "title",
    key: "menuGap",
  },
  {
    label: "菜单上下之间的间隔",
    type: "number",
    key: "menuGap",
  },
  {
    label: "菜单缩进",
    type: "number",
    key: "menuIndent",
  },
  {
    label: "菜单标题字体大小",
    type: "number",
    key: "menuTitleSize",
  },
  {
    label: "菜单标题高度",
    type: "number",
    key: "menuTitleHeight",
  },
  {
    label: "菜单 item 字体大小",
    type: "number",
    key: "menuItemSize",
  },
  {
    label: "菜单 item 高度",
    type: "number",
    key: "menuItemHeight",
  },
  {
    label: "菜单左右边距",
    type: "number",
    key: "menuPadding",
  },
  {
    label: "菜单 hover 背景颜色",
    type: "color",
    key: "menuItemHoverBg",
  },
  {
    label: "菜单标题颜色",
    type: "color",
    key: "menuTitleColor",
  },
  {
    label: "菜单文字颜色",
    type: "color",
    key: "menuTextColor",
  },
];

function setStyle(isInit = false) {
  let label = document.getElementById(id) as HTMLStyleElement;
  if (!label) {
    label = document.createElement("style");
    label.id = id;
    document.head.appendChild(label);
  }
  label.textContent = getStyleText();
  if (!isInit) {
    message.success("应用成功！");
    sessionStorage.setItem(id, JSON.stringify(styleVariable));
  }
}

function copyStyle() {
  copyText(getStyleText(), function() {
    messageBox({
      title: "复制成功！",
      content: `<div>请将代码复制在<span class="the-tag blue" style="padding: 6px 8px;">src/styles/layout.scss</span>中即可</div>`
    })
  })
}

function resetStyle() {  
  modifyData(styleVariable, useDefaultStyle());
  sessionStorage.removeItem(id);
  const label = document.getElementById(id);
  if (label) {
    label.remove();
  }
}

function onPreset(theme: "green" | "black" | "red" | "purple") {
  switch (theme) {
    case "green":
      modifyData(styleVariable, {
        themeColor: "#42b983",
        menuItemHoverBg: "#e9f7f2"
      });
      break;
    
    case "black":
      modifyData(styleVariable, {
        themeColor: "#1a1a1a",
        menuItemHoverBg: "#f5f5f5"
      });
      break;

    case "red":
      modifyData(styleVariable, {
        themeColor: "#fc3d4c",
        menuItemHoverBg: "#fff0f2"
      });
      break;
    
    case "purple":
      modifyData(styleVariable, {
        themeColor: "#6122c7",
        menuItemHoverBg: "#f4ecff"
      });
      break;

    default:
      break;
  }
  setStyle();
}

type Colors = "themeColor" | "borderColor" | "wholeBgColor" | "contentBgColor" | "menuItemHoverBg" | "menuTitleColor" | "menuTextColor";

type Numbers = keyof Omit<typeof styleVariable, Colors>

/** 最小值限制 */
const minValue: Record<Numbers, number> = {
  sidebarWidth: 160,
  navbarHeight: 28,
  tagsHeight: 28,
  contentPadding: 0,
  pagePadding: 0,
  menuGap: 0,
  menuIndent: 10,
  menuTitleSize: 12,
  menuTitleHeight: 24,
  menuItemSize: 12,
  menuItemHeight: 24,
  menuPadding: 6,
}

let timer: number;

function onInput(e: Event, key: Numbers) {
  const inputEl = e.target as HTMLInputElement;
  const result = inputOnlyNumber(inputEl.value);
  const value = Number(result);
  styleVariable[key] = value;
  clearTimeout(timer);
  timer = setTimeout(function() {
    if (value < minValue[key]) {
      styleVariable[key] = minValue[key];
    }
    setStyle();
  }, 500);
}

function onColor() {
  // console.log("修改颜色");
  setStyle();
}

onMounted(function() {
  const cacheValue = jsonParse(sessionStorage.getItem(id), undefined);

  if (cacheValue) {
    modifyData(styleVariable, cacheValue);
    setStyle(true);
  }
});

onUnmounted(function() {
  clearTimeout(timer);
});
</script>
<style lang="scss">
.page-home {
  width: 100%;
  .code-box {
    width: 100%;
    img {
      display: inline-block;
      vertical-align: top;
      width: 280px;
      margin-right: 16px;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
      transition: 0.3s all;
    }
    .hovercode {
      cursor: pointer;
      &:hover + .qrcode {
        opacity: 1;
        transform: translateX(0px);
      }
    }
    .qrcode {
      opacity: 0;
      transform: translateX(100px);
    }
  }
  .options-box {
    width: 220px;
  }
  .form-item {
    height: 44px;
    width: fit-content;
    position: relative;

    .form-label {
      min-width: 180px;
      font-size: 14px;
      color: #555;
      font-weight: bold;
    }

    .form-unit {
      font-size: 14px;
      color: #999;
      position: absolute;
      right: 22px;
      top: 10px;
    }

    .the-input {
      width: 200px;
      margin: 0 12px;
    }

    .color-box {
      border: solid 1px #dcdfe6;
      width: 100px;
      height: 38px;
      cursor: pointer;
      padding: 1px 2px;
      transition: var(--transition);
      &:hover {
        border-color: var(--blue);
      }
      input {
        width: 100%;
        height: 100%;
        display: block;
        cursor: pointer;
      }
    }
  }
}
</style>