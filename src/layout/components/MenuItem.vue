<template>
  <div class="the-layout-menu" ref="menuBox">
    <button :class="titleClass" :style="titleStyle" @click="switchOpen()" v-if="hasChidren(info)">
      <svg-icon v-if="info.icon" :name="info.icon" />
      <span class="f1">{{ info.title }}</span>
      <i class="the-layout-menu-arrow"></i>
    </button>
    <template v-else>
      <!-- 外链 -->
      <a :class="titleClass" :style="titleStyle" :href="info.link" target="_blank" v-if="info.link">
        <svg-icon v-if="info.icon" :name="info.icon" />
        <span class="f1">{{ info.title }}</span>
      </a>
      <!-- 单个菜单 -->
      <router-link :class="titleClass" :style="titleStyle" :to="info.path" v-else>
        <svg-icon v-if="info.icon" :name="info.icon" />
        <span class="f1">{{ info.title }}</span>
      </router-link>
    </template>
    <!-- :class="['the-layout-menu-list', { 'the-layout-menu-list-close': !info.isOpen }]" -->
    <div class="the-layout-menu-list" :style="listStyle" v-if="info.children && info.children.length > 0">
      <div v-for="(item) in info.children" :key="item.key">
        <MenuItem v-if="hasChidren(item)" :info="item" :level="level + 1" />
        <template v-else>
          <!-- 外链 -->
          <a :class="getItemClass(item)" :style="itemStyle" :href="item.link" target="_blank" v-if="item.link">
            <svg-icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.title }}</span>
          </a>
          <!-- 单个菜单 -->
          <router-link :class="getItemClass(item)" :style="itemStyle" :to="item.path" v-else>
            <svg-icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { LayoutMenuItem } from "@/types";
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store";

/** 菜单`item`组件 */
@Component({
  name: "MenuItem"
})
export default class MenuItem extends Vue {
  /** 菜单层级 */
  @Prop({
    type: Number,
    default: 1
  })
  level!: number;

  @Prop({
    type: Object,
    default: () => ({
      title: "-"
    })
  })
  info!: LayoutMenuItem;

  /**
   * 是否有下级菜单
   * @param item
   */
  hasChidren(item: LayoutMenuItem) {
    return item.children && item.children.length > 0 ? true : false;
  }

  sizeInfo = store.layout.menuSizeInfo;

  /**
   * 获取列表高度
   * @param item 列表单个对象
   */
  getListHeight(item: LayoutMenuItem) {
    let result = 0;
    const child = item.children;
    if (item.isOpen && child && child.length > 0) {
      child.forEach(menuItem => {
        const height = this.hasChidren(menuItem) ? this.sizeInfo.titleHeight : this.sizeInfo.itemHeight;
        result += height;
        result += this.getListHeight(menuItem);
      })
    }
    return result;
  }

  get titleClass() {
    const item = this.info;
    return {
      "the-layout-menu-title fvertical": true,
      "the-layout-menu-on": item.isActive,
      "the-layout-menu-hasopen": item.isOpen,
      "the-layout-menu-hasactive": item.hasActive,
      "the-layout-menu-active-title": item.hasActive && this.level === 1
    }
  }

  getItemClass(item: LayoutMenuItem) {
    return {
      "the-layout-menu-item fvertical": true,
      "the-layout-menu-on": item.isActive
    }
  }

  titleStyle = {
    paddingLeft: ""
  }

  itemStyle = {
    paddingLeft: ""
  }

  /** 菜单列表样式 */
  get listStyle() {
    let height = this.getListHeight(this.info);
    // console.log("height >>", height);
    return {
      height: height + "px"
    }
  }

  $refs!: {
    /** 当前整体节点 */
    menuBox: HTMLElement
  }

  switchOpen() {
    this.info.isOpen = !this.info.isOpen;
  }

  mounted() {
    // 设置左边距
    if (this.level >= 1) {
      const style = getComputedStyle(this.$refs.menuBox.children[0] as HTMLElement);
      const value = parseFloat(style.paddingLeft);
      if (isNaN(value)) return;
      this.titleStyle.paddingLeft = value * this.level + "px";
      this.itemStyle.paddingLeft = value * (this.level + 1) + "px";
    }
    // console.log("MenuItem >>", this.sizeInfo);
  }
}
</script>
