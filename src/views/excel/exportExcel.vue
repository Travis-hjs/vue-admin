<template>
    <div class="export_excel">
        <div class="top flex fvertical">
            <div class="f1 title">表格总条数：{{ tableData.length }}</div>
            <el-button type="primary" v-if="isMergeHeader" size="medium" icon="el-icon-document" :loading="processing" @click="clickExportMergeHeaderExcel()">{{processing ? '导出中' : '导出表格'}}</el-button>
            <el-button type="primary" v-else size="medium" icon="el-icon-document" :loading="processing" @click="clickExportExcel()">{{processing ? '导出中' : '导出表格'}}</el-button>
        </div>
        <!-- 多级表头表单 -->
        <el-table :data="tableData" border style="width: 100%" v-if="isMergeHeader">
            <el-table-column prop="date" label="日期" width="150"></el-table-column>
            <el-table-column label="配送信息">
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column label="地址相关信息">
                    <el-table-column prop="province" label="省份" width="120">
                    </el-table-column>
                    <el-table-column prop="city" label="市区" width="120">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                    <el-table-column prop="zip" label="邮编" width="120">
                    </el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>
        <!-- 普通表单 -->
        <el-table :data="tableData" border style="width: 100%" v-else>
            <el-table-column label="日期" width="140">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" width="180">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column label="操作" width="240" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" disabled @click="clickEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="clickDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import utils from "../../utils";
import { exportExcel, formatJson } from "../../utils/excel";

interface tableItem {
    date: string
    name: string
    address: string
    city: string
    province: string
    zip: number | string
}

@Component({})
export default class ExportExcel extends Vue {
    /** 是否合并头部（多个头部） */
    @Prop({
        type: Boolean,
        default: false,
    })
    isMergeHeader!: boolean;

    tableData: Array<tableItem> = [];

    /** 是否在处理状态 */
    processing = false;

    clickEdit(index: number, item: tableItem) {
        console.log("点击编辑", index, item);
    }

    clickDelete(index: number, item: tableItem) {
        // console.log("点击删除", index, item);
        this.tableData.splice(index, 1);
    }

    /** 初始化`table`数据 */
    initTableData() {
        const total = utils.ranInt(8, 20);
        const list: Array<tableItem> = [];
        const date = new Date();
        for (let i = 0; i < total; i++) {
            list.push({
                date: `${date.getFullYear()}-${date.getMonth() + 1}-${i + 1}`,
                name: utils.randomText(2, 6),
                address: utils.randomText(5, 20),
                city: utils.randomText(2, 4) + "市",
                province: utils.randomText(2, 4) + "区",
                zip: utils.ranInt(10000, 52000)
            });
        }
        this.tableData = list;
    }

    /** 点击导出单个表头数据 */
    clickExportExcel() {
        this.processing = true;
        const json = formatJson(this.tableData, [
            {
                header: "日期",
                key: "date",
                handle(item) {
                    return utils.formatDate(item.date, "Y年M月D日");
                }
            }, {
                header: "姓名",
                key: "name"
            }, {
                header: "地址",
                key: "address"
            }
        ]);
        // return console.log(json);
        exportExcel({
            header: json.headers,
            data: json.list,
            autoWidth: true,
            filename: "typescript-admin-excel",
        });
        this.processing = false;
    }

    /** 点击导出多个个表头数据（害妹完善，需要看文档配置） */
    clickExportMergeHeaderExcel() {
        this.processing = true;
        const multiHeader = [
            ["日期", "配送信息", "", "", "", ""],
            ["", "姓名", "", "", "", ""],
            ["", "", "地址相关信息", "", "", ""]
        ];
        const merges = ["A1:A3", "B1:F2"]; // 这里定义规则，目前还没完全搞懂
        const json = formatJson(this.tableData, [
            {
                header: "", // 注意这里为空
                key: "date"
            }, {
                header: "", // 注意这里为空
                key: "name"
            }, {
                header: "城市",
                key: "city"
            }, {
                header: "地区",
                key: "province"
            }, {
                header: "地址", 
                key: "address"
            }, {
                header: "邮编", 
                key: "zip"
            }
        ]);
        exportExcel({
            header: json.headers,
            data: json.list,
            multiHeader: multiHeader,
            merges: merges,
            autoWidth: true,
            filename: "导出多级表头",
        });
        this.processing = false;
    }

    created() {
        this.initTableData();
    }
}
</script>
<style lang="scss" scoped>
.export_excel {
    width: 100%;
    .top {
        margin-bottom: 16px;
        .title {
            font-size: 18px;
            color: #555;
            font-weight: bold;
        }
    }
}
</style>