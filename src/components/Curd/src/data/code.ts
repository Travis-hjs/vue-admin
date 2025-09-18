import type { PresetCodeType } from "../types";

/** 
 * 预设代码
 * - 后面可以改用接口形式在`<PresetCode />`组件中进行动态获取预设代码
 */
export const presetCodeMap: Record<PresetCodeType.Key, Array<PresetCodeType.Item>> = {
  "form-submit": [
    {
      id: 1,
      name: "表单提交（完整数据）",
      code: `console.log("表单提交 >>", formData, current);
// 当前页面/菜单标识
const pageId = "_pageId";
// 请求路径
const path = \`/save/xxx\`;
// 接口传参
const params = { ...formData, ...current };
// 请求域名，不设置则使用默认
const domain = "";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];
// 设置加载状态
page.setFormLoading(true);
// 开始发起请求
_request("POST", path, params, { domain }).then(res => {
  // code为 1 时表示成功，其他的直接跳出停止后面的操作
  if (res.code !== 1) return;
  // 成功后的提示
  _message.success("提交成功！");
  // 成功后重新获取表格数据，如果不想回到第一页那么可以用 page.getData(); 保留当前操作状态
  page.onSearch();
  // 并关闭弹框
  page.closeForm();
}).finally(() => {
  // 结束之后关闭加载状态
  page.setFormLoading(false);
});`,
    },
    {
      id: 12,
      name: "表单提交（当前展示表单项数据）",
      code: `console.log("表单提交 >>", formData, current);
// 当前页面/菜单标识
const pageId = "_pageId";
// 请求路径
const path = \`/save/xxx\`;
// 接口传参
const params = current;
if (formData.id) {
  params.id = formData.id;
}
// 请求域名，不设置则使用默认
const domain = "";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];
// 设置加载状态
page.setFormLoading(true);
// 开始发起请求
_request("POST", path, params, { domain }).then(res => {
  // code为 1 时表示成功，其他的直接跳出停止后面的操作
  if (res.code !== 1) return;
  // 成功后的提示
  _message.success("提交成功！");
  // 成功后重新获取表格数据，如果不想回到第一页那么可以用 page.getData(); 保留当前操作状态
  page.onSearch();
  // 并关闭弹框
  page.closeForm();
}).finally(() => {
  // 结束之后关闭加载状态
  page.setFormLoading(false);
});`,
    },
  ],
  "batch-submit": [
    {
      id: 100,
      name: "批量提交请求",
      code: `console.log("批量操作 >>", list, selectList);
// 当前页面/菜单标识
const pageId = "_pageId";
// 操作文案
const text = "批量xxx";
// 请求路径
const path = "/batch/xxx";
// 接口传参
const params = list;
// 请求域名，不设置使用默认
const domain = "";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];

// 弹出提示，确认后进行请求操作
_messageBox({
  title: "操作提示",
  content: \`是否\${text}选中的 \${list.length} 条数据？\`,
  cancelText: "取消",
  async confirm() {
    // 发起请求操作
    const res = await _request("POST", path, params, { domain });
    // code为 1 时表示成功，其他的直接跳出停止后面的操作
    if (res.code !== 1) return false;
    // 成功后的提示
    _message.success(text + "成功！");
    // 成功后重新获取表格数据
    page.onSearch();
    return true;
  }
});`,
    }
  ],
  "table-cell": [
    {
      id: 200,
      name: "颜色枚举值展示",
      code: `const text = {
  0: "蓝色",
  1: "绿色",
  2: "橙色",
  3: "灰色",
  4: "红色",
}

const color = {
  0: "blue",
  1: "green",
  2: "orange",
  3: "gray",
  4: "red",
}

return text[cellValue] ? \`<span class="the-tag \${color[cellValue]}">\${text[cellValue]}</span>\` : "-";`,
    }
  ],
  "action-submit": [
    {
      id: 300,
      name: "通用确认提交",
      code: `console.log("表格行数据 >>", row);
// 当前页面/菜单标识
const pageId = "_pageId";
/** 请求方法，全大写 */
const method = "POST";
/** 接口请求路径 */
const path = "/action/xxx";
/** 接口传参对象 */
const params = {
  id: row.id,
};
/** 接口请求域名，不填则使用默认 */
const domain = "";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];
// 发起弹框提示
_messageBox({
  title: "操作提示",
  content: "是否xxx当前操作？",
  cancelText: "取消",
  async confirm() {
    const res = await _request(method, path, params, { domain });
    if (res.code !== 1) return false;
    _message.success("xxx成功！");
    page.getData();
    return true;
  }
});`,
    }
  ],
  "operation-submit": [
    {
      id: 400,
      name: "导入文件(Excel)",
      code: `// 当前页面/菜单标识
const pageId = "_pageId";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];
// 导入请求路径
const path = "/upload/file";
// 导入请求域名，不传则使用默认域名
const domain = "";

_onUploadFile({
  // 弹框标题
  title: "导入文件",
  // 指定上传文件类型，逗号分割多种
  accept: ".xls,.xlsx",
  /**
   * 上传文件最大体积
   * - 单位\`M\`,
   * - 0 为不限制大小
   */
  maxSize: 0,
  /** 是否多个文件 */
  multiple: false,
  /**
   * @param {File | Array<File>} file 当个文件或列表，由\`multiple\`指定
   * @param callback 关闭回调
   */
  async change(file) {
    // 声明一个表单对象
    const formData = new FormData();
    // 处理单个文件
    formData.append("file", file);
    // 发起请求
    page.setLoading(true);
    const res = await _request("POST", path, formData, { domain });
    page.setLoading(false);
    if (res.code === 1) {
      _message.success("导入成功！");
      page.getData();
    }
  }
});`,
    },
    {
      id: 401,
      name: "导出数据(Excel)",
      code: `// 当前页面/菜单标识
const pageId = "_pageId";
// 当前页面功能对象
const page = window[\`_\${pageId}\`];
// 请求域名，不传则使用默认域名
const domain = "";
const method = "GET";
const path = "/export/xxx";
const params = page.getSearchParams();
page.setLoading(true);
_request(method, path, params,
  {
    responseType: "blob",
    timeout: 5 * 1000 * 60,
    domain: domain,
  }
).then(res => {
  if (res.code !== 1) return;
  _downloadFile(res.data, res.msg);
  _message.success("导出成功!");
}).finally(() => {
  page.setLoading(false);
});`,
    }
  ],
  "search-validate": [
    {
      id: 500,
      name: "校验查询参数",
      code: `console.log("查询参数 >>", params);

if (!params.userId && !params.userName) {
  _message.warning("用户ID、用户名称 必须填一个！");
  return false;
}

return true;`
    }
  ]
}
