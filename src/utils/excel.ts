import { saveAs } from "file-saver"
import XLSX, { WorkBook, WorkSheet, WritingOptions } from "xlsx"

interface ICell {
    v: Date | number | boolean | string
    t: string
    z: string
}

interface ExportExcelParams {
    /** 表格头部列表 */
    header: Array<string>
    /** 导出的表格数据（二维数组） */
    data: Array<Array<any>>
    /** 导出的文件名 */
    filename?: string
    /** 表格头部列表 */
    multiHeader?: Array<Array<string>>
    /** 合并的数组 */
    merges?: Array<any>
    /** 导出的表格内容自动填充宽度 */
    autoWidth?: boolean
    /** 导出的文件类型 */
    fileType?: WritingOptions["bookType"]
}

interface FormatJsonParams<T> {
    /** 
     * 索引的位置
     * ```js
     * function formatJson() {}
     * ```
     * 该方法可能后面用到，外部传参的时候不用
    */
    index?: number
    /** 表头字段 */
    header: string
    /** 对应表头的字段`key` */
    key: string
    /** 条件处理函数 */
    handle?: (item: T) => number | string
}

class Workbook implements WorkBook {
    SheetNames: string[] = []
    Sheets: { [sheet: string]: WorkSheet } = {}
}

function datenum(date: Date) {
    return (+date - +new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheetFromDataArray(data: any) {
    const ws: { [key: string]: any } = {}
    const range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    }
    for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R
            if (range.s.c > C) range.s.c = C
            if (range.e.r < R) range.e.r = R
            if (range.e.c < C) range.e.c = C
            const cell: ICell = {
                v: data[R][C],
                t: "",
                z: ""
            }
            if (cell.v == null) continue
            const cellRef = XLSX.utils.encode_cell({
                c: C,
                r: R
            })
            if (typeof cell.v === "number") cell.t = "n"
            else if (typeof cell.v === "boolean") cell.t = "b"
            else if (cell.v instanceof Date) {
                cell.t = "n"
                cell.z = XLSX.SSF.get_table()[14]
                cell.v = datenum(cell.v)
            } else cell.t = "s"
            ws[cellRef] = cell
        }
    }
    if (range.s.c < 10000000) {
        ws["!ref"] = XLSX.utils.encode_range(range)
    }
    return ws
}

function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf
}

/**
 * 导出`Excel`表格
 * @param options 传参配置
 */
export function exportExcel(options: ExportExcelParams) {
    const data = [...options.data];
    const multiHeader = options.multiHeader || [];
    const merges = options.merges || [];
    const fileType = options.fileType || "xlsx";

    data.unshift(options.header)
    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    const wsName = "SheetJS"
    const wb = new Workbook()
    const ws = sheetFromDataArray(data)

    if (merges.length > 0) {
        if (!ws["!merges"]) {
            ws["!merges"] = []
        }
        merges.forEach(item => {
            ws["!merges"].push(XLSX.utils.decode_range(item))
        })
    }

    if (options.autoWidth) {
        // 设置worksheet每列的最大宽度
        const colWidth = data.map((row: any) => row.map((val: any) => {
            // 先判断是否为 null/undefined
            if (val == null) {
                return {
                    wch: 10
                }
                // 再判断是否为中文
            } else if (val.toString().charCodeAt(0) > 255) {
                return {
                    wch: val.toString().length * 2
                }
            } else {
                return {
                    wch: val.toString().length
                }
            }
        }))
        // 以第一行为初始值
        const result = colWidth[0]
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j].wch < colWidth[i][j].wch) {
                    result[j].wch = colWidth[i][j].wch
                }
            }
        }
        ws["!cols"] = result
    }

    // Add worksheet to workbook
    wb.SheetNames.push(wsName)
    wb.Sheets[wsName] = ws

    const wbout = XLSX.write(wb, {
        bookType: fileType,
        bookSST: false,
        type: "binary"
    })

    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${options.filename || Math.random().toString(36).substr(2)}.${fileType}`)
}

/**
 * 格式化`json`返回导出表格需要的数据
 * @param target 处理的目标数组
 * @param options 处理配置数组，字段顺序按照这个来
 */
export function formatJson<T>(target: Array<T>, options: Array<FormatJsonParams<T>>) {
    const headers: Array<string> = [];
    const list: Array<Array<any>> = [];
    for (let i = 0; i < options.length; i++) {
        headers.push(options[i].header);
    }

    for (let i = 0; i < target.length; i++) {
        const item = target[i];
        list[i] = [];
        for (let j = 0; j < options.length; j++) {
            const option = options[j];
            const key = option.key as keyof T;
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                if (option.handle) {
                    list[i].push(option.handle(item));
                } else {
                    list[i].push(item[key])
                }
            }
        }
    }
    return {
        headers,
        list
    }
}