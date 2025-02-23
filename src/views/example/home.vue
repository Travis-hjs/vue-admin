<template>
  <div class="page-home">
    <h2 class="the-title is-line mgb-30">Vue3 + Vite + TypeScript 后台管理模板</h2>
    <div class="mgb-40">
      <span class="the-tag blue">无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</span>
      <a class="the-tag green" :href="project" target="_blank">项目地址</a>
    </div>
    <el-form class="the-form mgb-30" label-width="160px" size="small">
      <h2 class="the-title is-line mgb-30">布局操作开关</h2>
      <el-form-item label="显示侧边栏logo">
        <el-switch v-model="layoutInfo.showSidebarLogo" active-text="显示" inactive-text="隐藏" />
      </el-form-item>
      <el-form-item label="显示历史记录标签">
        <el-switch v-model="layoutInfo.showTagList" active-text="显示" inactive-text="隐藏" />
      </el-form-item>
      <el-form-item label="侧边栏展开">
        <el-switch v-model="layoutInfo.showSidebar" active-text="展开" inactive-text="收起" />
      </el-form-item>
      <el-form-item label="布局模式">
        <el-radio-group v-model="layoutInfo.layoutMode">
          <el-radio-button value="">默认布局</el-radio-button>
          <el-radio-button value="full-header">顶部撑满</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <h2 class="the-title is-line mgb-30">主题&样式</h2>
      <el-form-item label="整体背景颜色">
        <el-input v-model="styleVariable.wholeBgColor"></el-input>
        <el-color-picker v-model="styleVariable.wholeBgColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="侧边菜单栏宽度">
        <el-input v-model="styleVariable.sidebarWidth" @input="(e: string) => onInput(e, 'sidebarWidth')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="侧边菜单栏背景色">
        <el-input v-model="styleVariable.menuBgColor"></el-input>
        <el-color-picker v-model="styleVariable.menuBgColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="菜单hover动画背景色">
        <el-input v-model="styleVariable.menuHoverBgColor"></el-input>
        <el-color-picker v-model="styleVariable.menuHoverBgColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="菜单选项背景色">
        <el-input v-model="styleVariable.menuItemBgColor"></el-input>
        <el-color-picker v-model="styleVariable.menuItemBgColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="菜单选项激活状态背景色">
        <el-input v-model="styleVariable.menuItemBgActivedColor"></el-input>
        <el-color-picker v-model="styleVariable.menuItemBgActivedColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="菜单选项激活伪类颜色">
        <el-input v-model="styleVariable.menuItemTagColor"></el-input>
        <el-color-picker v-model="styleVariable.menuItemTagColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      
      <el-form-item label="菜单左右间距">
        <el-input v-model="styleVariable.menuPadding" @input="(e: string) => onInput(e, 'menuPadding')">
          <template #suffix>px</template>
        </el-input>
        <span class="the-tag blue"><i class="el-icon-question el-icon--left"></i>修改此值需要手动刷新页面</span>
      </el-form-item>
      <el-form-item label="菜单字体大小">
        <el-input v-model="styleVariable.menuFontSize" @input="(e: string) => onInput(e, 'menuFontSize')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="菜单标题高度">
        <el-input v-model="styleVariable.menuTitleHeight" @input="(e: string) => onInput(e, 'menuTitleHeight')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="菜单栏目高度">
        <el-input v-model="styleVariable.menuItemHeight" @input="(e: string) => onInput(e, 'menuItemHeight')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="侧边菜单栏文字默认颜色">
        <el-input v-model="styleVariable.menuTextColor"></el-input>
        <el-color-picker v-model="styleVariable.menuTextColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="侧边菜单栏文字激活颜色">
        <el-input v-model="styleVariable.menuTextActivedColor"></el-input>
        <el-color-picker v-model="styleVariable.menuTextActivedColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="顶部导航栏高度">
        <el-input v-model="styleVariable.navbarHeight" @input="(e: string) => onInput(e, 'navbarHeight')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="主容器内边距">
        <el-input v-model="styleVariable.contentPadding" @input="(e: string) => onInput(e, 'contentPadding')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="主容器背景色">
        <el-input v-model="styleVariable.contentBgColor"></el-input>
        <el-color-picker v-model="styleVariable.contentBgColor" show-alpha :predefine="predefineColors" @change="onColor()" />
      </el-form-item>
      <el-form-item label="页面内边距">
        <el-input v-model="styleVariable.pagePadding" @input="(e: string) => onInput(e, 'pagePadding')">
          <template #suffix>px</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setStyle()">应用当前配置</el-button>
        <el-button type="success" @click="copyStyle()">复制当前配置</el-button>
        <el-button type="info" plain @click="resetStyle()">重置默认样式</el-button>
        <el-button type="primary" @click="onPreset()">应用预设配置</el-button>
      </el-form-item>
    </el-form>
    <h2 class="the-title is-line mgb-30">打赏一下</h2>
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

const layoutInfo = store.layout.info;

const project = store.projectInfo.link;

const predefineColors = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
];

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
    /** 菜单选项激活伪类颜色，靠左边的蓝色小矩形 */
    menuItemTagColor: "#1890FF",
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
  --menu-item-tag-color: ${styleVariable.menuItemTagColor};
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
  const defaultStyle = useDefaultStyle();
  modifyData(defaultStyle, {
    menuBgColor: "#ffffff",
    menuHoverBgColor: "rgba(214, 231, 255, 0.2)",
    menuItemBgColor: "#ffffff",
    menuItemBgActivedColor: "#ecf5ff",
    menuTextColor: "#545454",
    menuTextActivedColor: "#1388f6"
  });
  modifyData(styleVariable, defaultStyle);
  setStyle();
}

type Colors = "wholeBgColor"|"menuBgColor"|"menuHoverBgColor"|"menuItemBgColor"|"menuItemBgActivedColor"|"menuItemTagColor"|"menuTextColor"|"menuTextActivedColor"|"contentBgColor";

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

let timer: number;

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
  .the-form {
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>