# 一些静态数据相关

```ts
import { getBoldLabel } from "./index";

const fnLinkLabel = `<a class="el-link el-link--primary" target="_blank" href="https://alidocs.dingtalk.com/i/nodes/qnYMoO1rWxNLwa46tMrjQ6AmJ47Z3je9">查看已封装的函数</a>`;

/**
 * 通用函数参数提示
 * @param value
 */
function commonTips(value: string) {
  if (value) {
    value = `${value}, menuTag`;
  } else {
    value = "menuTag";
  }
  const bold = getBoldLabel(`const { ${value} } = sandbox;`);
  return `<p>获取函数参数：${bold}</p>`;
}

export const tableAction = {
  textTips: `
<p>可以输入代码片段；</p>
${commonTips("row")}
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>例如：${getBoldLabel('return row.status === 1 ? "下架" : "上架"')}</p>
`,
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("row, index")}
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>参数：${getBoldLabel("index")}是当前索引；</p>
<p>例如：${getBoldLabel("console.log(row, index);")}</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  booleanTips: `
<p>可以输入代码片段；</p>
${commonTips("row")}
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>参数：${getBoldLabel("row")}是表格对象值；</p>
<p>例如：${getBoldLabel("return row.status === 1;")}返回布尔值进行判断。</p>
`
};

export const editor = {
  formatTips: `<p>参考 src/utils/index.ts 中的${getBoldLabel("formatDate")}函数</p>`,
  codeTips: `
<p>回调函数代码片段：</p>
${commonTips("value, key")}
<p>参数：${getBoldLabel("value")}是当前变更值；</p>
<p>参数：${getBoldLabel("key")}是当前键值；</p>
<p>例如：${getBoldLabel("console.log(value, key);")}</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  showTips: `
<p>动态表单项的条件显示逻辑函数；</p>
${commonTips("formData")}
<p>当为表单配置时，才有参数：${getBoldLabel("formData")}为当前表单的数据值；</p>
<p>例如：${getBoldLabel("return formData.type !== 2;")}</p>
<p>返回${getBoldLabel("false")}则不展示对应项，以${getBoldLabel("return")}为函数代码片段标记；</p>
<p>例如：${getBoldLabel("return false;")}</p>
<p>筛选配置中没有参数${getBoldLabel("formData")}</p>
`,
  disabledTips: `
<p>动态表单项的条件禁用逻辑函数；</p>
${commonTips("formData")}
<p>参数：${getBoldLabel("formData")}为当前表单的数据值；</p>
<p>返回${getBoldLabel("true")}则禁用对应项；</p>
<p>以${getBoldLabel("return")}为函数代码片段标记；</p>
<p>例如：${getBoldLabel("return formData.type === 2;")}为禁用。</p>
`,
  dateDisabledTips: `
<p>日期禁用函数代码片段：</p>
${commonTips("time")}
<p>参数：${getBoldLabel("time")}是每一个日期的值，</p>
<p>返回${getBoldLabel("true")}则禁用对应日期；</p>
<p>例如：${getBoldLabel("return true;")}</p>
`,
  dateShortcutTips: `
<p>日期快捷按钮代码片段：</p>
${commonTips("")}
<p>需要返回一个数组；</p>
<p>${getBoldLabel('return [{ text: "按钮", value() { // do some... } }]')}</p>
<p>不建议在当前输入框内进行代码编写，</p>
<p>请优先在其他编辑器中编写完成再粘贴过来。</p>
`
};

export const tableBatch = {
  tips: `[{ id: 1, name: "名称", status: 2 }]`,
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("list, selected")}
<p>参数：${getBoldLabel("list")}是当前选中键值列表；</p>
<p>参数：${getBoldLabel("selected")}是当前选中的完整列表；</p>
<p>例如：${getBoldLabel("console.log(list, selected);")}</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`
};

export const tableColumn = {
  codeTips: `
<p>函数代码片段：</p>
${commonTips("cellValue, row")}
<p>参数：${getBoldLabel("cellValue")}是表格值；</p>
<p>参数：${getBoldLabel("row")}是完整对象；</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`
};

export const tableForm = {
  showCodeTips: `
<p>按钮显示逻辑代码片段：</p>
${commonTips("")}
<p>例如${getBoldLabel("return false;")}为隐藏，</p>
<p>不填则默认显示</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  openCodeTips: `
<p>表单提交函数代码片段：</p>
${commonTips("row")}
<p>参数：${getBoldLabel("row")}为当前表格行数据，当编辑操作时存在；</p>
<p>可以对${getBoldLabel("row")}进行数据处理操作；</p>
<p>示例：${getBoldLabel('console.log("表单打开 >>", row);')}</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`,
  submitCodeTips: `
<p>表单提交函数代码片段：</p>
${commonTips("formData, current, batch")}
<p>参数：${getBoldLabel("formData")}表单完整对象；</p>
<p>参数：${getBoldLabel("current")}界面展示中的字段对象；</p>
<p>参数：${getBoldLabel("batch")}批量操作（如批量操作中为选中的列表参数对象）</p>
<p>可以点击${getBoldLabel("使用示例代码")}进行快速编辑</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`
};

export const remarkTips = `
<p>与服务端交互的约定配置：</p>
<p>
  <a class="el-link el-link--primary" target="_blank" href="https://alidocs.dingtalk.com/i/nodes/R1zknDm0WRwdOaj2fnE9j2n9VBQEx5rG?utm_scene=team_space&iframeQuery=anchorId%3Duu_mhaboo0u6j9mgqi13d3">查看使用文档</a>
</p>
`;

export const searchSubmitTips = `
<p>查询数据函数代码片段：</p>
${commonTips("params")}
<p>参数：${getBoldLabel("params")}为当前查询参数对象；</p>
<p>返回${getBoldLabel("true")}则可以查询，返回${getBoldLabel("false")}则终止查询；</p>
<p>${fnLinkLabel}</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`;

export const tableOperation = {
  fnTips: `
<p>函数代码片段，点击的时候运行；</p>
${commonTips("")}
<p>例如：${getBoldLabel("console.log('测试');")}</p>
`,
  showTips: `
<p>可以输入代码片段；</p>
${commonTips("")}
<p>以${getBoldLabel("return")}关键字为函数标记；</p>
<p>例如：${getBoldLabel('return _hasAuth("权限标识");')}返回布尔值进行判断显示或者隐藏。</p>
`
};
```
