/**
 * @author https://github.com/Hansen-hjs
 * @description 工具类
 */
class ModuleUtil {
    /**
     * 获取日期周几
     * @param date 日期 '2019/04/28' & '2019/04/28 12:12:12'
     */
    getDateDayString(date: string | Date) {
        return '周' + '日一二三四五六'.charAt(new Date(date).getDay());
    }

    /**
     * 将秒数换成时分秒格式
     * @param value 秒数
     */
    secondFormat(value: number) {
        let day: string | number = 0, hour: string | number = 0, minute: string | number = 0, second: string | number = 0;
        day = Math.floor(value / (24 * 3600));
        hour = Math.floor(value / 3600) - (day * 24);
        minute = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
        // 格式化
        day = ('0' + day).slice(-2);
        hour = ('0' + hour).slice(-2);
        minute = ('0' + minute).slice(-2);
        second = ('0' + second).slice(-2);
        return { day, hour, minute, second };
    }

    /**
     * 时间戳生成 
     * @param num 1时为明天，-1为昨天天，以此类推
     * @description 返回格式：'yyyy/mm/dd hh:mm:ss'
     */
    getDateFormat(num: number = 0) {
        const date = new Date(Date.now() + (num * 24 * 3600 * 1000));
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const hour = `0${date.getHours()}`.slice(-2);
        const minute = `0${date.getMinutes()}`.slice(-2);
        const second = `0${date.getSeconds()}`.slice(-2);
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    }

    /**
     * 写入并下载文件（只支持Chrome && Firefox）
     * @param filename 文件名 xxx.text | xxx.js | xxx.[type]
     * @param content 文件内容
     */
    download(filename: string, content: string) {
        const label = document.createElement('a');
        label.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        label.setAttribute('download', filename);
        if (document.createEvent) {
            const event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
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
    copyText(text: string, success?: Function, fail?: (res: string) => void) {
        text = text.replace(/(^\s*)|(\s*$)/g, '');
        if (!text) {
            fail && fail('复制的内容不能为空！');
            return;
        }
        const id = 'the-clipboard';
        let clipboard = (document.getElementById(id) as HTMLTextAreaElement);
        if (!clipboard) {
            clipboard = document.createElement('textarea');
            clipboard.id = id;
            clipboard.style.cssText = 'font-size: 15px; position: fixed; top: -1000%; left: -1000%;';
            document.body.appendChild(clipboard);
        }
        clipboard.value = text;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        document.execCommand('copy');
        success && success();
    }

    isvalidUsername(str: string) {
        const valid = ['admin', 'editor']
        return valid.indexOf(str.trim()) >= 0
    }

    isExternal(path: string) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }

    isValidPassowrd(psd: string) {
        return /^[\w]{6,10}$/.test(psd)
    }
    
}

/** 工具模块 */
const utils = new ModuleUtil();

export default utils;