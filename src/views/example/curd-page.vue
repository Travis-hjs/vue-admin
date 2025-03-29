<template>
  <Curd v-model:data="data" :action="action" />
</template>
<script lang="ts" setup>
import { getTableList, saveForm, setReport } from "@/api/common";
import {
  actionEditKey,
  columnActionProp,
  Curd,
  getColumnData,
  getFieldData,
  type CurdType
} from "@/components/Curd";
import { formatDate } from "@/utils";
import { message, messageBox } from "@/utils/message";
import { ref } from "vue";

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
        jsCode: 'return `<button type="button" class="el-button el-button--primary is-link" onclick="_copyText(${cellValue}, () => _message.success(\'复制成功\'))"><span>Num: ${cellValue}</span></button>`;'
      },
      {
        ...getColumnData("banner", "游戏封面"),
        width: 110,
        cellType: "image",
        slot: "banner"
      },
      {
        ...getColumnData("gamePrice", "游戏价格"),
        width: 140,
        formatter(row, cellValue) {
          return cellValue ? `￥${cellValue}` : "-";
        },
        sort: "desc",
        slotHead: "gamePrice",
      },
      {
        ...getColumnData("date", "上架时间"),
        width: 200,
        formatter(row, cellValue) {
          return cellValue ? formatDate(cellValue) : "-";
        },
        sort: true,
        slotHead: "date",
        iconTips: "人工设置的时间"
      },
      {
        ...getColumnData(columnActionProp, "操作"),
        width: 160,
      },
    ],
    actions: [
      {
        key: actionEditKey,
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
      }
    ],
    selectKey: "id",
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
  }
});

const action: CurdType.Action = {
  getTableData(searchInfo, pageInfo) {
    console.log("searchInfo >>", searchInfo);
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
