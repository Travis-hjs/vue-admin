<template>
  <Curd :data="data" :action="action" />
</template>
<script lang="ts" setup>
import { getTableList } from "@/api/common";
import { actionEditKey, actionProp, Curd, getColumnData, getFieldData, type CurdType } from "@/components/Curd";
import { formatDate } from "@/utils";
import { reactive } from "vue";

const option = {
  gameType: [
    { label: "单机", value: 1 },
    { label: "网游", value: 2 },
  ]
}

const data = reactive<CurdType.Config>({
  search: {
    labelRight: false,
    labelWidth: 0,
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
      },
      {
        ...getFieldData("select", "gameType"),
        label: "游戏类型",
        placeholder: "请选择游戏类型",
        options: option.gameType,
        required: true,
        defaultValue: 1
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
        ...getColumnData(actionProp, "操作"),
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
        text: "上报游戏",
        click(row, index) {
          console.log("上报游戏 >>", row, index);
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
          valueType: "number"
        },
        {
          ...getFieldData("date", "gameDate"),
          label: "上架日期"
        },
        {
          ...getFieldData("switch", "gameLimit"),
          label: "设备登录限制",
          show(current) {
            return current.gameType === 2;
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
    console.log("getTableData >>", searchInfo, pageInfo);
    return getTableList({...searchInfo, ...pageInfo});
  },
  created(getData) {
    // console.log("curd created");
    getData();
  },
}

</script>
<style lang="scss"></style>
