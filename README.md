
# Vue3 后台管理模板

> 描述：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

- 当前项目要求已安装`18.0`或更高版本的`Node.js`
- 每个文件夹目录的`README.md`都带有具体的说明，注意查看
- `vue2.x`之后`v2`分支停止维护，当前项目不再做对应的调整，分支版本依然保留使用

[详细介绍](https://juejin.cn/post/7350874162011750400)

## 版本分支说明

| 分支名 | 演示 | 脚手架 | 技术依赖 | 补充/说明 |
| --- | --- | --- | --- | --- |
| [master](https://github.com/Travis-hjs/vue-admin) | [预览](https://huangjingsheng.gitee.io/hjs/vue-admin) | vite 5.x | typescript、vue 3.x、vue-router 4.x | vue3 版本，无引用任何 UI 框架 |
| [el-plus](https://github.com/Travis-hjs/vue-admin/tree/el-plus) | [预览](https://huangjingsheng.gitee.io/hjs/vue-admin-el) | vite 5.x | typescript、vue 3.x、vue-router 4.x、element-plus | 基于`master`加入了 UI 框架的配置使用 |
| [v2](https://github.com/Travis-hjs/vue-admin/tree/v2) | [预览](https://huangjingsheng.gitee.io/hjs/vue2-admin) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui | vue2 版本，`element-ui`在这里默认作为常规功能展示引用，模板核心功能依然是无 UI 框架依赖 |
| [hjs](https://github.com/Travis-hjs/vue-admin/tree/hjs) | [预览](https://huangjingsheng.gitee.io/hjs/vue-admin-hjs) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui、echarts、xlsx、wangeditor | 自用分支，基于`v2`增加了一些：图表、Excel、富文本插件、手写签名等功能 |

## 项目初始化

**Tips：** 在`package.json`中，`vue-tsc`不是必需的，需要提高构建速度可以自行卸载该依赖，并在构建命令中删除对应`vue-tsc --noEmit && `代码。但不建议这样做，因为在开发时会失去`ts`的全局代码检查

```
npm install
```
### 开发运行

```
npm run dev
```

### 打包构建

```
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