# 命令式弹框表单

使用示例

```html
<script lang="ts" setup>
import { openPopupForm } from "@/components/PopupForm";
import { getInputRule, getSelectRule } from "@/hooks/common";

interface UserForm {
  userId: string;
  name: string;
  type: string;
}

function onForm() {
  openPopupForm<UserForm>({
    title: "测试表单",
    rules: {
      userId: getInputRule("请输入ID"),
      name: getInputRule("请输入姓名"),
      type: getSelectRule("请选择类型", false),
    },
    fields: [
      {
        label: "ID",
        prop: "userId",
        type: "input",
        placeholder: "请输入ID",
      },
      {
        label: "姓名",
        prop: "name",
        type: "input",
        placeholder: "请输入姓名",
      },
      {
        label: "类型",
        prop: "type",
        type: "select",
        options: [
          { label: "游戏", value: "1" },
          { label: "电影", value: "2" },
        ],
        placeholder: "请选择类型",
      },
    ],
    cancelText: "取消",
    onConfirm(form, cb) {
      console.log("onConfirm >>", form);
      cb(true);
    },
  });
}
</script>

<template>
  <el-button type="primary" @click="onForm"> 测试表单 </el-button>
</template>
```
