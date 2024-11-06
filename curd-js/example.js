import { default as _request } from "../src/utils/request";
import {
  formatDate as _formatDate,
  copyText as _copyText,
  jsonToPath as _jsonToPath
} from "../src/utils";
import {
  messageBox as _messageBox,
  message as _message
} from "../src/utils/message";

/**
 * 表格列渲染函数
 * @param {string|number} cellValue 表格值
 * @param {object} row 完整对象
 */
function table(cellValue, row) {
  // do some...
  // return cellValue;
}

/**
 * 表格列操作按钮函数
 * @param {object} row
 * @param {number} index
 */
function action(row, index) {
  _request("POST", "/sendData", { id: row.id }).then(res => {
    if (res.code !== 1) return;
    _message.success("请求成功");
  });
}
