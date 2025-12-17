# 描述容器组件

使用 grid + flex 布局实现

## 使用示例

```html
<script lang="ts" setup>
  import { Description, type DescriptionType } from "@/components/Description";

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

## 布局实现

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

上面代码中，如何让最后一个`the-description-item`默认填满剩余空间？
