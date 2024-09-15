
# Vue3 后台管理模板

> 描述：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

- 当前项目要求已安装`18.0`或更高版本的`Node.js`
- 每个文件夹目录的`README.md`都带有具体的说明，*注意查看！* *注意查看！* *注意查看！*
- `vue2.x`之后`v2`分支停止维护，当前项目不再做对应的调整，分支版本依然保留使用

[其他详细介绍](https://juejin.cn/post/7350874162011750400)

## 版本分支说明

| 分支名 | 演示 | 脚手架 | 技术依赖 | 补充/说明 |
| --- | --- | --- | --- | --- |
| [master](https://github.com/Travis-hjs/vue-admin) | [预览](https://travis-hjs.github.io/vue-admin) | vite 5.x | typescript、vue 3.x、vue-router 4.x | vue3 版本，无引用任何 UI 框架 |
| [el-plus](https://github.com/Travis-hjs/vue-admin/tree/el-plus) | [预览](https://travis-hjs.github.io/vue-admin-el) | vite 5.x | typescript、vue 3.x、vue-router 4.x、element-plus | 基于`master`加入了 UI 框架的配置使用 |
| [v2](https://github.com/Travis-hjs/vue-admin/tree/v2) | [预览](https://travis-hjs.github.io/vue2-admin) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui | vue2 版本，`element-ui`在这里默认作为常规功能展示引用，模板核心功能依然是无 UI 框架依赖 |

## 功能清单

当前模板只提供必需的功能，功能模块之间尽可能保证低耦合性，这对所有开发者都是一件非常有利的事情，例如你无需担心替换、修改某一功能时影响到其他。另外更为重要的是：当前所有已实现功能都不依赖任何第三方库（`vue-router`除外），这意味着你可以无需关心`package.json`的依赖版本，因为根本就没有其他依赖，所以根据自己的喜好去引入第三方库的时候会非常舒服。

像前端工程化配置`ESLint`、`StyleLint`、`git-husky`等这类开发约束工具这里一律不使用，理由有以下几点：

- 规则的东西不适用作为通用型项目，因为有很多自由开发者、初学者、后端开发者等，他们在使用时并不需要，这些工具只会使其在初次接触中变得束手无策，所以这违背了我写这个项目的初衷。

- 其次就是这些约束工具对开发效率的提升通常为 **0**，因为在提交代码的时候需要进行全局检查或者对部分文件检查，所以要花费大量的时间去干等；另外`ESlint`这个东西在实际的开发场景中，并不能有效地提高代码质量，因为爱写垃圾的人不管用什么工具都始终会写垃圾代码，有了这些工具只不过是让写出来的垃圾代码变得好看而已，而且在`ts`中，只要不是写的过多`any`，基本都有语法和写法的报错检查，所以`ESlint`的作用就显得很鸡肋，在过去`js`项目中或许有用，但在`ts`中真的可有可无，不如来一个`Prettier`代码格式化工具来得实际。

- 代码约束的工具运行时会消耗过大的内存，在一些电脑性能不那么高的设备上会非常卡顿，这使得开发过程十分笨重。更重要的是，有时候过多的工具检测报错会导致进程崩溃，尽管你的代码可以正常运行。

### layout 核心布局整体

可动态修改样式配置，样式文件全部集中写在 [layout.scss](./src/styles/layout.scss) 通过`css`变量，可以非常方便地自定义样式。

### 路由的配置和权限的使用

当前有：静态和动态路由两种配置，具体看 [router 使用说明](./src/router/REAMDE.md)

### http 网络请求

这里我使用的是原生`XMLHttpRequest`封装的请求方法 [ajax](https://github.com/Travis-hjs/my-note/blob/master/example/pages/request/js/index.js)，理由是：

- 代码少，功能足以覆盖常用的大部分场景。
- 在`ts`中可以更友好的声明接口返回类型。

在适配后端接口返回数据时，需要在 [getResultInfo 方法](src/utils/request.ts) 中设置好要使用的字段，在使用时，`request`函数始终返回`Promise.resolve`，所以在调用时只需要判断`res.code`即可，不需要在外部再包多一层`try catch`，这样的好处在`Promise.all([ ... ])`的使用场景时非常明显。

更多具体使用看 [接口调用及类型定义使用](./src/api/README.md)，当然，你可以使用任何的第三方请求库~

### 状态管理

当前没有使用`Vuex`或者`Pinia`，因为这些库始终会随着版本更新而不断调整或被抛弃，`Vuex`就是后者，而且每出一个库，开发者都要去翻对应的文档学一遍。所以在`vue 2.x`的时候我就抛弃了这种繁琐而不适用未来的状态库，而是采用程序设计模式去代替库的方案：参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)。

在`ts`的项目中，因为可以用`Readonly`去声明状态对象，所以这套程序设计会发挥得最好，具体示例可以在 [状态使用示例](https://github.com/Travis-hjs/vue-admin/tree/master/src/store) 中查看。

### svg 图标

图标的使用和修改非常简单，添加时只需要往`src/icons/svg/`目录下放入你想要的`svg`图标即可。使用时只需要在标签上设置`name`即可，其中`name`就是目录下的`.svg`文件名

像这样：

```html
<template>
  <!-- exit 则是 src/icons/svg/exit.svg -->
  <svg-icon name="exit" />
</template>
```

### 常用工具函数

在 [src/utils/index.ts](src/utils/index.ts) 中内置了一些使用频率极高的工具函数：类型判断、日期格式化、文本复制、深拷贝等。

## 项目运行

**Tips：** 在`package.json`中，`vue-tsc`不是必需的，需要提高构建速度可以自行卸载该依赖，并在构建命令中删除对应`vue-tsc --noEmit &&`代码。但不建议这样做，因为在开发时会失去`ts`的全局代码检查

```bash
#安装依赖
npm install

# 运行项目
npm run dev

# 构建项目
npm run build
```

## vscode 用户代码片段

针对当前模板封装的已有组件，快速生成部分常用功能代码片段

### 表格列表页

```json
{
  "vue-model": {
    "scope": "javascript, typescript, html, vue",
    "prefix": "vue3-table-list",
    "body": [
      "<template>",
      "  <div class=\"$name\">",
      "    <FilterWrap>",
      "      <!-- <FilterItem label=\"选项一\">",
      "        <el-select v-model=\"value\" placeholder=\"请选择\">",
      "          <el-option v-for=\"item in options\" :key=\"item.value\" :label=\"item.label\" :value=\"item.value\" />",
      "        </el-select>",
      "      </FilterItem> -->",
      "      <template #right>",
      "        <el-button type=\"primary\"><i class=\"el-icon-plus el-icon--left\"></i>新增</el-button>",
      "      </template>",
      "    </FilterWrap>",
      "",
      "    <base-table",
      "      :columns=\"tableColumns\"",
      "      :data=\"tableData\"",
      "      :actions=\"btnList\"",
      "      :loading=\"loading\"",
      "    ></base-table>",
      "",
      "    <base-pagination :disabled=\"loading\" :page-info=\"pageInfo\" @change=\"getTableData\" />",
      "",
      "  </div>",
      "</template>",
      "<script lang=\"ts\" setup>",
      "import { ref, reactive } from \"vue\";",
      "import { usePageInfo } from \"@/hooks\";",
      "import { FilterWrap, FilterItem  } from \"@/components/FilterBox/index\";",
      "",
      "const loading = ref(false);",
      "",
      "const pageInfo = reactive(usePageInfo());",
      "",
      "const tableData = ref<Array<BaseObj>>([]);",
      "",
      "const tableColumns: Array<BaseTableColumn> = [",
      "  { label: \"名称\", prop: \"name\", minWidth: 180 },",
      "  { label: \"操作\", prop: \"action-right\", width: 140 },",
      "];",
      "",
      "const btnList: Array<BaseTableOptionItem> = [",
      "  { text: \"编辑\", icon: \"el-icon-edit\" },",
      "  { text: \"删除\", icon: \"el-icon-delete\", type: \"danger\", },",
      "];",
      "",
      "async function getTableData() {",
      "  // loading.value = true;",
      "  // const res = await getData(pageInfo)",
      "  // loading.value = false;",
      "  // if (res.code === 1) {",
      "  //   tableData.value = res.data.list || [];",
      "  //   pageInfo.total = res.data.totalCount;",
      "  // }",
      "}",
      "",
      "// getTableData();",
      "",
      "</script>",
      "<style lang=\"scss\">",
      ".$name {",
      "  width: 100%;",
      "}",
      "</style>",
    ],
    "description": "vue-3 页面表格模板"
  },
}

```

### 弹出层组件

```json
{
  "vue-model": {
    "scope": "javascript, typescript, html, vue",
    "prefix": "vue3-popup-component",
    "body": [
      "<template>",
      "  <base-dialog",
      "    class=\"$componentName\"",
      "    v-model=\"showDialog\"",
      "    title=\"xxx\"",
      "    width=\"400px\"",
      "    @close=\"onClose()\"",
      "  >",
      "    ",
      "    <template #footer>",
      "      <el-button @click=\"onClose()\">取 消</el-button>",
      "      <el-button type=\"primary\" @click=\"onSubmit()\">确 认</el-button>",
      "    </template>",
      "  </base-dialog>",
      "</template>",
      "<script lang=\"ts\">",
      "",
      "/** 组件名称 */",
      "export default {",
      "  name: '$componentName'",
      "};",
      "</script>",
      "<script lang=\"ts\" setup>",
      "import { ref, reactive, watch } from 'vue';",
      "",
      "const props = defineProps({",
      "  show: {",
      "    type: Boolean,",
      "    default: false",
      "  }",
      "});",
      "",
      "const emit = defineEmits<{",
      "  (event: 'update:show', val: boolean): void",
      "}>();",
      "",
      "const showDialog = ref(false);",
      "",
      "watch(() => props.show, function(val) {",
      "  showDialog.value = val;",
      "  if (val) {",
      "    // 可以做一些重置操作",
      "  }",
      "});",
      "",
      "function onClose(val = false) {",
      "  emit('update:show', val);",
      "}",
      "",
      "function onSubmit() {",
      "  onClose();",
      "}",
      "",
      "</script>",
      "<style lang=\"scss\">",
      ".$componentName {",
      "  width: 100%;",
      "}",
      "</style>",
    ],
    "description": "vue-3 弹框组件模板"
  },
}
```
