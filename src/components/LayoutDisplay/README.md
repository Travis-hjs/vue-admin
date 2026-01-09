# 布局展示类相关组件

- 无状态组件，只负责展示布局
- 注意无状态函数组件传参不支持小写+横杆

## 筛选组件（表格页）

```html
<script lang="ts" setup>
import { reactive } from "vue";
import { FilterWrap, FilterItem } from "@/components/LayoutDisplay";

const searchInfo = reactive({
  value: "",
  date: [],
})

const options = [{ label: "xxx", value: 1 }]

</script>
<template>
  <div class="demo">
    <FilterWrap>
      <FilterItem label="筛选一">
        <el-select v-model="searchInfo.value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <FilterItem label="筛选二">
        <el-select v-model="searchInfo.value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <FilterItem label="日期">
        <el-date-picker
          v-model="searchInfo.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </FilterItem>
      <template #right>
        <el-button type="primary"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
      </template>
    </FilterWrap>
  </div>
</template>
```

## 描述展示组件

使用 grid + flex 布局实现

```html
<script lang="ts" setup>
  import { Description, type DescriptionType } from "@/components/LayoutDisplay";

  const list: Array<DescriptionType.Item> = [
    {
      label: "考核周期",
      content: "cycle",
    },
    {
      label: "考核结果",
      content: "result",
      span: 2,
    },
    {
      label: "考核得分",
      content: "score",
    },
    {
      label: "考核等级",
      span: 2,
      slot: "grade",
    },
  ];
</script>
<template>
  <div class="container">
    <Description :items="list">
      <template #grade>
        <span class="the-tag green">grade</span>
      </template>
    </Description>
  </div>
</template>
```

> 布局实现

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>grid + flex 布局</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      body {
        padding: 20px;
      }
      .the-description {
        --columns: 3;
        --label-width: 120px;
        --border-color: rgba(5, 5, 5, 0.06);
        background-color: #fff;

        width: 100%;
        display: grid;
        border: 1px solid var(--border-color);
        border-right: none;
        border-bottom: none;
        grid-template-columns: repeat(var(--columns), 1fr);
        border-radius: 4px;
        overflow: hidden;
        grid-auto-flow: dense;
      }
      .the-description-item {
        --span: 1;
        --height: 46px;

        display: flex;
        grid-column: span var(--span);
        border-bottom: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
      }
      .the-description-item.full-span {
        grid-column: 1 / -1;
      }
      .the-description-label,
      .the-description-content {
        display: flex;
        align-items: center;
        color: #333;
      }
      .the-description-label {
        width: var(--label-width);
        min-width: var(--label-width);
        min-height: var(--height);
        font-size: 14px;
        padding: 4px 16px;
        border-right: 1px solid var(--border-color);
        background-color: rgba(0, 0, 0, 0.02);
      }
      .the-description-content {
        flex: 1;
        padding: 4px 16px;
        min-height: var(--height);
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <section class="the-description">
      <div class="the-description-item">
        <div class="the-description-label">日期</div>
        <div class="the-description-content">2025-12-12 02:10:46</div>
      </div>
      <div class="the-description-item" style="--span: 2">
        <div class="the-description-label">item-2</div>
        <div class="the-description-content">内容内容内容内容内容内容内容内容</div>
      </div>
      <div class="the-description-item full-span">
        <div class="the-description-label">item-3</div>
        <div class="the-description-content">内容内容内容内容内容内容内容内容</div>
      </div>
      <div class="the-description-item full-span">
        <div class="the-description-label">item-4</div>
        <div class="the-description-content">内容内容内容内容内容</div>
      </div>
    </section>
  </body>
</html>
```
