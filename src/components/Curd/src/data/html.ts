import { getBoldLabel } from "./index";

/**
 * 通用函数参数提示
 * @param value 
 */
function commonTips(value: string) {
  if (value) {
    value = `${value}, pageId`;
  } else {
    value = "pageId";
  }
  const bold = getBoldLabel(`const { ${value} } = sandbox;`);
  return `<p>获取函数参数：${bold}</p>`;
}

export const editor = {
  formatTips: `<p>参考 src/utils/index.ts 中的${getBoldLabel("formatDate")}函数。</p>`,
  showTips: `
<p>动态表单项的条件显示逻辑函数；</p>
${commonTips("formData")}
<p>参数：${getBoldLabel("formData")}为当前表单的数据值；</p>
<p>返回${getBoldLabel("false")}则不展示对应项；</p>
<p>以${getBoldLabel("return")}为函数代码片段标记；</p>
<p>例如：${getBoldLabel("return formData.type !== 2;")}</p>
`
}

export const searchSubmitTips = `<p>查询数据函数代码片段：</p>
${commonTips("params")}
<p>参数：${getBoldLabel("params")}为当前查询参数对象；</p>
<p>返回${getBoldLabel("true")}则可以查询，返回${getBoldLabel("false")}则终止查询。</p>`;

export const tableAction = {
  textTips: `
<p>可以输入代码片段；</p>
${commonTips("row")}
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>例如：${getBoldLabel('return row.status === 1 ? "下架" : "上架";')}</p>
`,
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("row, index")}
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>参数：${getBoldLabel("index")}是当前索引；</p>
<p>例如：${getBoldLabel("console.log(row, index);")}</p>
`,
  booleanTips: `
<p>可以输入代码片段；</p>
${commonTips("row")}
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>例：${getBoldLabel("return row.status === 1;")}返回布尔值进行判断。</p>
`
};

export const tableBatch = {
  tips: `[{ id: 1, name: "名称", status: 2 }]`,
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("list, selectList")}
<p>参数：${getBoldLabel("list")}是当前选中键值列表；</p>
<p>参数：${getBoldLabel("selectList")}是当前选中的完整列表；</p>
<p>例如：${getBoldLabel("console.log(list, selectList);")}</p>
<p>
  <a class="el-link el-link--primary" target="_blank" href="https://github.com/Travis-hjs/vue-admin/blob/el-plus/src/components/Curd/src/index.vue">查看已暴露的函数</a>
</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`
};

export const tableColumn = {
  codeTips: `
<p>函数代码片段：</p>
${commonTips("cellValue, row")}
<p>参数：${getBoldLabel("cellValue")}是表格值；</p>
<p>参数：${getBoldLabel("row")}是完整对象；</p>
<p>例如：${getBoldLabel("return cellValue + row.id;")}</p>
<p>也可以是HTML：${getBoldLabel("return `<span>内容</span>`;")}</p>
`
};

export const tableForm = {
  showCodeTips: `
<p>按钮显示逻辑代码片段：</p>
${commonTips("formData")}
<p>参数：${getBoldLabel("formData")}是表单对象；</p>
<p>例如：${getBoldLabel("return false;")}为隐藏；</p>
<p>不填则默认显示；</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  openCodeTips: `
<p>表单提交函数代码片段：</p>
${commonTips("row")}
<p>参数：${getBoldLabel("row")}，当编辑时存在；</p>
<p>可以对${getBoldLabel("row")}进行数据处理操作;</p>
<p>示例：${getBoldLabel('console.log("表单打开 >>", row);')}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  submitCodeTips: `
<p>表单提交函数代码片段：</p>
${commonTips("formData, current, batch")}
<p>参数：${getBoldLabel("formData")}表单完整对象；</p>
<p>参数：${getBoldLabel("current")}界面展示中的字段对象；</p>
<p>参数：${getBoldLabel("batch")}批量操作（如批量操作中为选中的列表参数对象）；</p>
<p>可以点击${getBoldLabel("使用示例代码")}进行快速编辑；</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`
};

export const tableOperation = {
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("")}
<p>例如：${getBoldLabel('console.log("测试");')}</p>
`,
  showTips: `
<p>可以输入代码片段；</p>
${commonTips("")}
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>例如：${getBoldLabel('return _hasAuth("权限标识");')}返回布尔值进行判断显示或者隐藏。</p>
`
};
