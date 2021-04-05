import store from "../store";
import utils from "../utils";

const version = require("element-plus/package.json").version;

/**
 * `element-ui`原来的主题颜色
 */
const originTheme = "#409EFF";

/**
 * `element-ui`线上`css`资源路径
 */
const elementCssUrl = `https://unpkg.com/element-plus@${version}/lib/theme-chalk/index.css`;

/**
 * 请求版本线上`css`资源
*/
let cssAssets = "";

/**
 * 获取线上`css`资源
 * @param url 资源路径
 */
 function getCssAssets(url: string) {
    return new Promise<string>(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const result = xhr.responseText.replace(/@font-face{[^}]+}/, "");
                resolve(result);
            }
        }
        xhr.open("GET", url);
        xhr.send();
    })
}

function updateStyle(style: string, oldCluster: string[], newCluster: string[]) {
    let newStyle = style;
    oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
    })
    return newStyle;
}

function tintColor(color: string, tint: number) {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    if (tint === 0) {
        return [red, green, blue].join(",");
    } else {
        red += Math.round(tint * (255 - red));
        green += Math.round(tint * (255 - green));
        blue += Math.round(tint * (255 - blue));
        return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
    }
}

function shadeColor(color: string, shade: number) {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}

function getThemeCluster(theme: string) {
    const clusters = [theme];
    for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
    }
    clusters.push(shadeColor(theme, 0.1))
    return clusters;
}

/**
 * 设置指定`<style id="id">`内容
 * @param id 指定`id`
 * @param context 内容
 */
 function setStyleContext(id: string, context: string) {
    let styleLabel = document.getElementById(id);
    if (!styleLabel) {
        styleLabel = document.createElement("style");
        styleLabel.id = id;
        document.head.appendChild(styleLabel);
    }
    styleLabel.innerText = context;
}

/**
 * 异步更变主题颜色
 * @description 获取线上版本css之后替换颜色，！！！注意：会修改`src/styles/element-variables.scss`配置颜色
 * @param theme 主题色
 */
export async function themeChangeAsync(theme: string) {
    const oldValue = cssAssets ? store.layout.state.theme : originTheme;
    const themeCluster = getThemeCluster(theme.replace("#", ""));
    const originalCluster = getThemeCluster(oldValue.replace("#", ""));
    if (!cssAssets) {
        const message = utils.showMessage({
            message: "切换主题中...",
            customClass: "theme-message",
            type: "info",
            duration: 0,
            iconClass: "el-icon-loading"
        })
        const value = await getCssAssets(elementCssUrl)
        cssAssets = value;
        message.close();
    }

    const colors = getThemeCluster(originTheme.replace("#", ""));
    const newStyle = updateStyle(cssAssets, colors, themeCluster);

    setStyleContext("theme_style", newStyle);

    let styles: HTMLElement[] = [].slice.call(document.querySelectorAll("style"));

    styles = styles.filter(style => {
        const text = style.innerText
        return new RegExp(oldValue, "i").test(text) && !/Chalk Variables/.test(text)
    });

    styles.forEach(style => {
        const { innerText } = style;
        if (typeof innerText !== "string") return;
        style.innerText = updateStyle(innerText, originalCluster, themeCluster);
    });

}