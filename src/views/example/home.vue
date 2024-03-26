<template>
  <div class="page-home">
    <h2 class="the-title mgb_30">Vue3 + Vite + TypeScript 后台管理模板</h2>
    <div class="mgb_40">
      <span class="the-tag blue">无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</span>
      <a class="the-tag green" :href="project" target="_blank">项目地址</a>
      <a class="the-tag green" :href="juejin" target="_blank">掘金描述说明</a>
    </div>
    <h2 class="the-title mgb_30">布局操作开关</h2>
    <div class="options-box mgb_40">
      <label class="check-box fvertical mgb_20" for="layout-logo" @change="layoutInfo.showSidebarLogo =! layoutInfo.showSidebarLogo">
        <input type="checkbox" id="layout-logo" :checked="layoutInfo.showSidebarLogo" />
        显示侧边栏logo
      </label>
      <label class="check-box fvertical mgb_20" for="layout-tags" @change="layoutInfo.showTagsView =! layoutInfo.showTagsView">
        <input type="checkbox" id="layout-tags" :checked="layoutInfo.showTagsView" />
        显示历史记录标签
      </label>
      <label class="check-box fvertical mgb_20" for="layout-open" @change="layoutInfo.sidebarOpen =! layoutInfo.sidebarOpen">
        <input type="checkbox" id="layout-open" :checked="layoutInfo.sidebarOpen" />
        侧边栏展开
      </label>
      <label class="check-box fvertical" for="layout-mode" @change="onMode">
        <input type="checkbox" id="layout-mode" :checked="layoutInfo.layoutMode === 'full-header'" />
        顶部填满
      </label>
    </div>
    <h2 class="the-title mgb_30">主题&样式</h2>
    <div class="form-item fvertical">
      <span class="form-label">整体背景颜色</span>
      <el-input v-model="styleVariable.wholeBgColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.wholeBgColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">侧边菜单栏宽度（px）</span>
      <el-input v-model="styleVariable.sidebarWidth" @input="(e: string) => onInput(e, 'sidebarWidth')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">侧边菜单栏背景色</span>
      <el-input v-model="styleVariable.menuBgColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.menuBgColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单hover状态的动画背景</span>
      <el-input v-model="styleVariable.menuHoverBgColor"></el-input>
      <span class="the-tag blue">只支持rgba</span>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单选项背景色</span>
      <el-input v-model="styleVariable.menuItemBgColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.menuItemBgColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单选项激活状态背景色</span>
      <el-input v-model="styleVariable.menuItemBgActivedColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.menuItemBgActivedColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单左右间距（px）</span>
      <el-input v-model="styleVariable.menuPadding" @input="(e: string) => onInput(e, 'menuPadding')"></el-input>
      <span class="the-tag blue">修改此值需要手动刷新页面</span>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单字体大小（px）</span>
      <el-input v-model="styleVariable.menuFontSize" @input="(e: string) => onInput(e, 'menuFontSize')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单标题高度（px）</span>
      <el-input v-model="styleVariable.menuTitleHeight" @input="(e: string) => onInput(e, 'menuTitleHeight')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">菜单栏目高度（px）</span>
      <el-input v-model="styleVariable.menuItemHeight" @input="(e: string) => onInput(e, 'menuItemHeight')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">侧边菜单栏文字默认颜色</span>
      <el-input v-model="styleVariable.menuTextColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.menuTextColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">侧边菜单栏文字激活颜色</span>
      <el-input v-model="styleVariable.menuTextActivedColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.menuTextActivedColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">顶部导航栏高度（px）</span>
      <el-input v-model="styleVariable.navbarHeight" @input="(e: string) => onInput(e, 'navbarHeight')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">主容器内边距（px）</span>
      <el-input v-model="styleVariable.contentPadding" @input="(e: string) => onInput(e, 'contentPadding')"></el-input>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">主容器背景色</span>
      <el-input v-model="styleVariable.contentBgColor"></el-input>
      <div class="color-box">
        <input class="color-input" type="color" @change="onColor()" v-model="styleVariable.contentBgColor">
      </div>
    </div>
    <div class="form-item fvertical">
      <span class="form-label">页面内边距（px）</span>
      <el-input v-model="styleVariable.pagePadding" @input="(e: string) => onInput(e, 'pagePadding')"></el-input>
    </div>
    <div class="pdt_20 mgb_30">
      <el-button type="primary" @click="setStyle()">应用当前配置</el-button>
      <el-button type="success" @click="copyStyle()">复制当前配置</el-button>
      <el-button @click="resetStyle()">重置默认样式</el-button>
      <el-button type="primary" @click="onPreset()">应用预设配置</el-button>
    </div>

    <h2 class="the-title mgb_30">打赏一下</h2>
    <div class="code-box">
      <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
      <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from "@/store";
import { copyText, inputOnlyNumber, jsonParse, modifyData } from "@/utils";
import { message, messageBox } from "@/utils/message";
import { ref, reactive, onMounted, onUnmounted } from "vue";

const layoutInfo = store.layout.info;
const project = store.projectInfo.link;
const juejin = "https://juejin.cn/post/7017278822068273166";

function onMode() {
  layoutInfo.layoutMode = layoutInfo.layoutMode === "full-header" ? "" : "full-header";
}

function useDefaultStyle() {
  return {
    /** 整体背景颜色 */
    wholeBgColor: "#ffffff",
    /** 侧边菜单栏宽度 */
    sidebarWidth: 210,
    /** 侧边菜单栏背景色 */
    menuBgColor: "#001529",
    /** 菜单`hover`状态的动画背景 */
    menuHoverBgColor: "rgba(255, 255, 255, 0.1)",
    /** 菜单选项背景色 */
    menuItemBgColor: "#000c17",
    /** 菜单选项激活状态背景色 */
    menuItemBgActivedColor: "#1890FF",
    /** 菜单左右间距 */
    menuPadding: 20,
    /** 菜单字体大小 */
    menuFontSize: 14,
    /** 菜单标题高度 */
    menuTitleHeight: 50,
    /** 菜单栏目高度 */
    menuItemHeight: 44,
    /** 侧边菜单栏文字默认颜色 */
    menuTextColor: "#ffffffa6",
    /** 侧边菜单栏文字激活颜色 */
    menuTextActivedColor: "#ffffff",
    /** 顶部导航栏高度 */
    navbarHeight: 50,
    /** 主容器内边距 */
    contentPadding: 12,
    /** 主容器背景色 */
    contentBgColor: "#eeeeee",
    /** 页面内边距 */
    pagePadding: 14,
  }
}

const styleVariable = reactive(useDefaultStyle());

const getStyleText = () => `
.the-layout {
  --whole-bg-color: ${styleVariable.wholeBgColor};
  --sidebar-width: ${styleVariable.sidebarWidth}px;
  --menu-bg-color: ${styleVariable.menuBgColor};
  --menu-hover-bg-color: ${styleVariable.menuHoverBgColor};
  --menu-item-bg-color: ${styleVariable.menuItemBgColor};
  --menu-item-bg-actived-color: ${styleVariable.menuItemBgActivedColor};
  --menu-padding: ${styleVariable.menuPadding}px;
  --menu-font-size: ${styleVariable.menuFontSize}px;
  --menu-title-height: ${styleVariable.menuTitleHeight}px;
  --menu-item-height: ${styleVariable.menuItemHeight}px;
  --menu-text-color: ${styleVariable.menuTextColor};
  --menu-text-actived-color: ${styleVariable.menuTextActivedColor};
  --navbar-height: ${styleVariable.navbarHeight}px;
  --content-padding: ${styleVariable.contentPadding}px;
  --content-bg-color: ${styleVariable.contentBgColor};
  --page-padding: ${styleVariable.pagePadding}px;
}
`;

const id = "theme-diy-style";

function setStyle(isInit = false) {
  let label = document.getElementById(id) as HTMLStyleElement;
  if (!label) {
    label = document.createElement("style");
    label.id = id;
    document.head.appendChild(label);
  }
  label.textContent = getStyleText();
  store.layout.menuSizeInfo.titleHeight = styleVariable.menuTitleHeight;
  store.layout.menuSizeInfo.itemHeight = styleVariable.menuItemHeight;
  if (!isInit) {
    message.success("应用成功！");
    sessionStorage.setItem(id, JSON.stringify(styleVariable));
  }
}

function copyStyle() {
  copyText(getStyleText(), function() {
    messageBox({
      title: "复制成功！",
      content: "请将代码复制在`src/styles/layout.scss`中即可"
    })
  })
}

function resetStyle() {  
  modifyData(styleVariable, useDefaultStyle());
  sessionStorage.removeItem(id);
  store.layout.menuSizeInfo.titleHeight = styleVariable.menuTitleHeight;
  store.layout.menuSizeInfo.itemHeight = styleVariable.menuItemHeight;
  const label = document.getElementById(id);
  if (label) {
    label.remove();
  }
}

function onPreset() {
  modifyData(styleVariable, {
    menuBgColor: "#ffffff",
    menuHoverBgColor: "rgba(121, 188, 255, 0.1)",
    menuItemBgColor: "#ffffff",
    menuItemBgActivedColor: "#ecf5ff",
    menuTextColor: "#545454",
    menuTextActivedColor: "#1388f6"
  });
  setStyle();
}

type Colors = "wholeBgColor"|"menuBgColor"|"menuHoverBgColor"|"menuItemBgColor"|"menuItemBgActivedColor"|"menuTextColor"|"menuTextActivedColor"|"contentBgColor";

type Numbers = keyof Omit<typeof styleVariable, Colors>

/** 最小值限制 */
const minValue: Record<Numbers, number> = {
  sidebarWidth: 100,
  menuPadding: 0,
  menuFontSize: 10,
  menuTitleHeight: 20,
  menuItemHeight: 20,
  navbarHeight: 38,
  contentPadding: 0,
  pagePadding: 0
}

let timer: NodeJS.Timeout;

function onInput(val: string, key: Numbers) {
  const result = inputOnlyNumber(val);
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
})

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
    .form-label {
      min-width: 180px;
      font-size: 14px;
      color: #555;
      font-weight: bold;
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
    .color-box {
      border: solid 1px #dcdfe6;
      width: 100px;
      height: 30px;
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