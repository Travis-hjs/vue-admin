<template>
  <Curd v-model:data="data" :action="action" :pageId="pageId" />
</template>
<script lang="ts" setup>
import { getTableList, saveForm, setReport } from "@/api/common";
import {
  Curd,
  CurdEnum,
  getColumnData,
  getFieldData,
  type CurdType
} from "@/components/Curd";
import { TableEnum } from "@/components/Table";
import { formatDate } from "@/utils";
import { message, messageBox } from "@/utils/message";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pageId = route.name as string;

const option = {
  gameType: [
    { label: "单机", value: 1 },
    { label: "网游", value: 2 },
  ]
}

const data = ref<CurdType.Config>({
  search: {
    labelRight: false,
    labelWidth: undefined,
    list: [
      {
        ...getFieldData("input", "gameName"),
        label: "游戏名称"
      },
      {
        ...getFieldData("input-between", "gamePrice"),
        label: "游戏价格",
        placeholder: ["最小价格", "最大价格"],
        valueType: "array<number>",
        valueWidth: 300
      },
      {
        ...getFieldData("select", "gameType"),
        label: "游戏类型",
        placeholder: "请选择游戏类型",
        options: option.gameType,
        required: true,
        defaultValue: 1,
      },
      {
        ...getFieldData("date", "gameDate"),
        label: "上架日期",
        dateType: "daterange",
        formatShow: "YYYY-MM-DD HH:mm:ss",
        format: "Y-M-D h:m:s",
        valueType: "array",
        valueWidth: 400
      }
    ],
  },
  table: {
    columns: [
      {
        ...getColumnData("gameName", "游戏名称"),
        minWidth: 140,
      },
      {
        ...getColumnData("gameType", "游戏类型"),
        width: 140,
        rawContent(cellValue) {
          const map = {
            1: {
              color: "cyan",
              text: "单机"
            },
            2: {
              color: "purple",
              text: "网游"
            }
          }
          const key = cellValue as keyof typeof map;
          const val = map[key];
          return `<span class="the-tag ${val.color}">${val.text}</span>`
        }
      },
      {
        ...getColumnData("num", "游戏编号"),
        width: 140,
        cellType: "js",
        tooltip: false,
        jsCode: 'return `<button type="button" class="el-button el-button--primary is-link" onclick="_copyText(${cellValue}, () => _message.success(\'复制成功\'))"><span>Num: ${cellValue}</span></button>`;',
        slot: "render-cell-num",
      },
      {
        ...getColumnData("banner", "游戏封面"),
        width: 110,
        cellType: "image",
        slot: "preview-image-banner",
      },
      {
        ...getColumnData("gamePrice", "游戏价格"),
        width: 140,
        formatter(row, cellValue) {
          return cellValue ? `￥${cellValue}` : "-";
        },
        sort: "desc",
      },
      {
        ...getColumnData("date", "上架时间"),
        width: 200,
        formatter(row, cellValue) {
          return cellValue ? formatDate(cellValue) : "-";
        },
        sort: true,
        titleTips: "人工设置的时间"
      },
      {
        ...getColumnData(TableEnum.Right, "操作"),
        width: 220,
      },
    ],
    actions: [
      {
        key: CurdEnum.ActionEdit,
        text: "编辑",
        type: "success",
        icon: "el-icon-edit"
      },
      {
        key: "1",
        text: row => row.report === 1 ? "上报游戏" : "取消上报",
        type: "primary",
        click(row, index) {
          console.log("上报游戏 >>", row, index);
          const name = row.report === 1 ? "上报游戏" : "取消上报";
          messageBox({
            content: `是否${name}？`,
            cancelText: "取消",
            async confirm() {
              const res = await setReport(row.report);
              row.report = res.data;
              message.success(`${name}成功~`);
            },
          });
        },
      },
      {
        key: "2",
        text: "同步数据",
        type: "primary",
        click: `const pageId = "${pageId}";
const page = window[\`_\${pageId}\`];
_messageBox({
  title: "操作提示",
  content: \`是否同步【\${row.gameName}】数据？\`,
  cancelText: "取消",
  confirm() {
    _message.success("同步数据成功！");
    page.getData();
  }
});`,
      }
    ],
    formAdd: {
      width: 520,
      labelPosition: "left",
      labelWidth: 140,
      fields: [
        {
          ...getFieldData("input", "gameName"),
          label: "游戏名称",
          required: true,
          placeholder: "请输入游戏名称",
        },
        {
          ...getFieldData("select", "gameType"),
          label: "游戏类型",
          required: true,
          placeholder: "请选择游戏类型",
          valueType: "number",
          options: option.gameType
        },
        {
          ...getFieldData("input", "gamePrice"),
          label: "游戏价格",
          required: true,
          placeholder: "请输入游戏价格",
          valueType: "number",
        },
        {
          ...getFieldData("date", "gameDate"),
          label: "上架日期"
        },
        {
          ...getFieldData("switch", "gameLimit"),
          label: "设备登录限制",
          show(formData) {
            // console.log("formData >>", formData);
            return formData.gameType === 2;
          },
        }
      ]
    },
    formEdit: {
      width: 520,
      labelPosition: "left",
      labelWidth: 140,
      fields: [
        {
          ...getFieldData("input", "gameName"),
          label: "游戏名称",
          required: true,
          placeholder: "请输入游戏名称",
        },
        {
          ...getFieldData("select", "gameType"),
          label: "游戏类型",
          required: true,
          placeholder: "请选择游戏类型",
          valueType: "number",
          options: option.gameType
        },
        {
          ...getFieldData("input", "gamePrice"),
          label: "游戏价格",
          required: true,
          placeholder: "请输入游戏价格",
          valueType: "number"
        },
      ]
    },
    selectKey: "id",
    batchs: [
      {
        text: "批量删除",
        type: "danger",
        key: "batch-delete",
        click: `
const pageId = "${pageId}";
const page = window[\`_${pageId}\`];
const text = "删除";
_messageBox({
  title: "操作提示",
  content: \`是否\${text}选中的 \${list.length} 条数据？\`,
  cancelText: "取消",
  confirm() {
    _message.success(text + "成功！");
    page.onSearch();
  }
});`
      },
      {
        text: "批量上报",
        type: "primary",
        key: "batch-post",
        click(list, selectList) {
          console.log("多选数据 >>", list, selectList);
          message.info("上报成功！");
          const page = (window as any)[`_${pageId}`];
          page.onSearch();
        },
      }
    ],
    operations: [
      {
        text: "导出数据",
        type: "primary",
        key: "export-data",
        click: `_message.success("导出成功！")`
      }
    ]
  }
});

const action: CurdType.Action = {
  getTableData(searchInfo, pageInfo) {
    console.log("getTableData >>", searchInfo, pageInfo);
    return getTableList({...searchInfo, ...pageInfo});
  },
  created(getData) {
    // console.log("curd created");
    getData();
  },
  onAdd(form, current) {
    // console.log("onAdd >>", form, current);
    return saveForm(current);
  },
  onEdit(form, current) {
    // console.log("onEdit >>", form, current);
    return saveForm(form);
  },
}

</script>
<style lang="scss"></style>
