import { 
    JavaScriptTypes, 
    NumberSymbols 
} from "./interfaces";

/**
 * @author https://github.com/Hansen-hjs
 * @description 工具类
 */
class ModuleUtil {
    /**
     * 获取日期周几
     * @param value 指定日期
     */
    getDateDayString(value: string | number | Date) {
        return "周" + "日一二三四五六".charAt(new Date(value).getDay());
    }

    /**
     * 将秒数换成时分秒格式
     * @param value 秒数
     * @param withDay 是否带天数倒计
     */
    formatSecond(value: number, withDay: boolean = false) {
        let day: number | string = Math.floor(value / (24 * 3600));
        let hour: number | string = Math.floor(value / 3600) - day * 24;
        let minute: number | string = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
        let second: number | string = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
        if (!withDay) {
            hour = hour + day * 24;
        }
        // 格式化
        day = day < 10 ? ("0" + day).slice(-2) : day.toString();
        hour = hour < 10 ? ("0" + hour).slice(-2) : hour.toString();
        minute = ("0" + minute).slice(-2);
        second = ("0" + second).slice(-2);
        return { day, hour, minute, second }
    }

    /**
     * 格式化日期
     * @param value 指定日期
     * @param format 格式化的规则
     * @example
     * ```js
     * formatDate();
     * formatDate(1603264465956);
     * formatDate(1603264465956, "h:m:s");
     * formatDate(1603264465956, "Y年M月D日");
     * ```
     */
    formatDate(value: string | number | Date = Date.now(), format = "Y-M-D h:m:s") {
        const formatNumber = (n: number) => `0${n}`.slice(-2);
        const date = new Date(value);
        const formatList = ["Y", "M", "D", "h", "m", "s"];
        const resultList = [];
        resultList.push(date.getFullYear().toString());
        resultList.push(formatNumber(date.getMonth() + 1));
        resultList.push(formatNumber(date.getDate()));
        resultList.push(formatNumber(date.getHours()));
        resultList.push(formatNumber(date.getMinutes()));
        resultList.push(formatNumber(date.getSeconds()));
        for (let i = 0; i < resultList.length; i++) {
            format = format.replace(formatList[i], resultList[i]);
        }
        return format;
    }

    /**
     * 写入并下载文件（只支持Chrome && Firefox）
     * @param filename 文件名 xxx.text | xxx.js | xxx.[type]
     * @param content 文件内容
     */
    download(filename: string, content: string) {
        const label = document.createElement("a");
        label.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
        label.setAttribute("download", filename);
        if (document.createEvent) {
            const event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            label.dispatchEvent(event);
        } else {
            label.click();
        }
    }

    /**
     * 点击复制
     * @param text 复制的内容
     * @param success 成功回调
     * @param fail 出错回调
     */
    copyText(text: string, success?: () => void, fail?: (res: string) => void) {
        text = text.replace(/(^\s*)|(\s*$)/g, "");
        if (!text) {
            fail && fail("复制的内容不能为空！");
            return;
        }
        const id = "the-clipboard";
        let clipboard = (document.getElementById(id) as HTMLTextAreaElement);
        if (!clipboard) {
            clipboard = document.createElement("textarea");
            clipboard.id = id;
            clipboard.readOnly = true;
            clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
            document.body.appendChild(clipboard);
        }
        clipboard.value = text;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        document.execCommand("copy");
        const state = document.execCommand("copy");
        if (state) {
            success && success();
        } else {
            fail && fail("复制失败");
        }
    }

    /**
     * 检测类型
     * @param target 检测的目标
     */
    checkType(target: any) {
        const value: string = Object.prototype.toString.call(target);
        const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
        return result.toLocaleLowerCase() as JavaScriptTypes;
    }

    /**
     * 数字运算（主要用于小数点精度问题）
     * [see](https://juejin.im/post/6844904066418491406#heading-12)
     * @param a 前面的值
     * @param type 计算方式
     * @param b 后面的值
     * @example 
     * ```js
     * // 可链式调用
     * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
     * console.log(res);
     * ```
     */
    computeNumber(a: number, type: NumberSymbols, b: number) {
        const THAT = this;
        /**
         * 获取数字小数点的长度
         * @param n 数字
         */
        function getDecimalLength(n: number) {
            const decimal = n.toString().split(".")[1];
            return decimal ? decimal.length : 0;
        }
        /** 倍率 */
        const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
        let result = 0;

        // 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的暴力处理
        a = Math.round(a * power);
        b = Math.round(b * power);

        switch (type) {
            case "+":
                result = (a + b) / power;
                break;
            case "-":
                result = (a - b) / power;
                break;
            case "*":
                result = (a * b) / (power * power);
                break;
            case "/":
                result = a / b;
                break;
        }

        return {
            /** 计算结果 */
            result,
            /**
             * 继续计算
             * @param nextType 继续计算方式
             * @param nextValue 继续计算的值
             */
            next(nextType: NumberSymbols, nextValue: number) {
                return THAT.computeNumber(result, nextType, nextValue);
            },
        };
    }

    /**
     * 判断是否外部链接
     * @param path 路径
     */
    isExternal(path: string) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }

    /**
     * 校验密码
     * @param value 
     */
    isValidPassowrd(value: string) {
        return /^[\w]{6,10}$/.test(value)
    }
    
}

/** 工具模块 */
const utils = new ModuleUtil();

export default utils;