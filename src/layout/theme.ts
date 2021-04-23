import store from "../store";
import { Message } from "element-ui";

const { version } = require("element-ui/package.json");

/**
 * `element-ui`原来的主题颜色
 */
const originTheme = "#409EFF";

/**
 * `element-ui`线上`css`资源路径
 */
const elementCssUrl = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;

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
    let label = document.getElementById(id);
    if (!label) {
        label = document.createElement("style");
        label.id = id;
        document.head.appendChild(label);
    }
    label.innerText = context;
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
        const message = Message({
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

// /**
//  * 同步更变主题颜色
//  * @param theme 主题颜色
//  */
// export function themeChange(theme: string) {
//     // theme += " !important"
//     const css = `
//     .el-pagination button:hover {
//         color: ${theme};
//     }
//     .el-pagination__sizes .el-input .el-input__inner:hover {
//         border-color: ${theme};
//     }
//     .el-pagination.is-background .el-pager li:not(.disabled):hover {
//         color: ${theme};
//     }
//     .el-pagination.is-background .el-pager li:not(.disabled).active {
//         background-color: ${theme};
//     }
//     .el-pager li:hover {
//         color: ${theme};
//     }
//     .el-pager li.active {
//         color: ${theme};
//     }
//     .el-dialog__headerbtn:focus .el-dialog__close,
//     .el-dialog__headerbtn:hover .el-dialog__close {
//         color: ${theme};
//     }
//     .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
//         border-bottom-color: ${theme};
//     }
//     .el-menu--horizontal>.el-menu-item.is-active {
//         border-bottom-color: ${theme};
//     }
//     .el-menu-item.is-active {
//         color: ${theme};
//     }
//     .el-submenu.is-active .el-submenu__title {
//         border-bottom-color: ${theme};
//     }
//     .el-radio-button__inner:hover {
//         color: ${theme};
//     }
//     .el-radio-button__orig-radio:checked+.el-radio-button__inner {
//         background-color: ${theme};
//         border-color: ${theme};
//         -webkit-box-shadow: -1px 0 0 0 ${theme};
//         box-shadow: -1px 0 0 0 ${theme};
//     }
//     .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
//         -webkit-box-shadow: 0 0 2px 2px ${theme};
//         box-shadow: 0 0 2px 2px ${theme};
//     }
//     .el-switch__label.is-active {
//         color: ${theme};
//     }
//     .el-switch.is-checked .el-switch__core {
//         border-color: ${theme};
//         background-color: ${theme};
//     }
//     .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
//         color: ${theme};
//     }
//     .el-select-dropdown__item.selected {
//         color: ${theme};
//     }
//     .el-select .el-input__inner:focus {
//         border-color: ${theme};
//     }
//     .el-select .el-input.is-focus .el-input__inner {
//         border-color: ${theme};
//     }
//     .el-table th>.cell.highlight {
//         color: ${theme};
//     }
//     .el-table .ascending .sort-caret.ascending {
//         border-bottom-color: ${theme};
//     }
//     .el-table .descending .sort-caret.descending {
//         border-top-color: ${theme};
//     }
//     .el-table-filter__list-item.is-active {
//         background-color: ${theme};
//     }
//     .el-table-filter__bottom button:hover {
//         color: ${theme};
//     }
//     .el-date-table td.today span {
//         color: ${theme};
//         font-weight: 700
//     }
//     .el-date-table td.available:hover {
//         color: ${theme};
//     }
//     .el-date-table td.current:not(.disabled) span {
//         background-color: ${theme};
//     }
//     .el-date-table td.selected span {
//         background-color: ${theme};
//     }
//     .el-month-table td.today .cell {
//         color: ${theme};
//     }
//     .el-month-table td .cell:hover {
//         color: ${theme};
//     }
//     .el-month-table td.end-date .cell,
//     .el-month-table td.start-date .cell {
//         background-color: ${theme};
//     }
//     .el-month-table td.current:not(.disabled) .cell {
//         color: ${theme};
//     }
//     .el-year-table td.today .cell {
//         color: ${theme};
//     }
//     .el-year-table td .cell:hover,
//     .el-year-table td.current:not(.disabled) .cell {
//         color: ${theme};
//     }
//     .el-date-picker__header-label.active,
//     .el-date-picker__header-label:hover {
//         color: ${theme};
//     }
//     .time-select-item.selected:not(.disabled) {
//         color: ${theme};
//     }
//     .el-range-editor.is-active,
//     .el-range-editor.is-active:hover {
//         border-color: ${theme};
//     }
//     .el-picker-panel__shortcut:hover {
//         color: ${theme};
//     }
//     .el-picker-panel__shortcut.active {
//         background-color: #e6f1fe;
//         color: ${theme};
//     }
//     .el-picker-panel__icon-btn:hover {
//         color: ${theme};
//     }
//     .el-time-spinner__arrow:hover {
//         color: ${theme};
//     }
//     .el-time-panel__btn.confirm {;
//         color: ${theme};
//     }
//     .el-message-box__headerbtn:focus .el-message-box__close,
//     .el-message-box__headerbtn:hover .el-message-box__close {
//         color: ${theme};
//     }
//     .el-breadcrumb__inner a:hover,
//     .el-breadcrumb__inner.is-link:hover {
//         color: ${theme};
//     }
//     .el-tabs__active-bar {
//         background-color: ${theme};
//     }
//     .el-tabs__new-tab:hover {
//         color: ${theme};
//     }
//     .el-tabs__item:focus.is-active.is-focus:not(:active) {
//         -webkit-box-shadow: 0 0 2px 2px ${theme} inset;
//         box-shadow: 0 0 2px 2px ${theme} inset;
//     }
//     .el-tabs__item.is-active {
//         color: ${theme};
//     }
//     .el-tabs__item:hover {
//         color: ${theme};
//     }
//     .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
//         color: ${theme};
//     }
//     .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
//         color: ${theme};
//     }
//     .el-tree__drop-indicator {
//         background-color: ${theme};
//     }
//     .el-tree-node.is-drop-inner>.el-tree-node__content .el-tree-node__label {
//         background-color: ${theme};
//     }
//     .el-input-number__decrease:hover,
//     .el-input-number__increase:hover {
//         color: ${theme};
//     }
//     .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled),
//     .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) {
//         border-color: ${theme};
//     }
//     .el-slider__bar {
//         background-color: ${theme};
//     }
//     .el-slider__button {
//         border-color: ${theme};
//     }
//     .el-slider.is-vertical.el-slider--with-input .el-slider__input:active .el-input-number__decrease,
//     .el-slider.is-vertical.el-slider--with-input .el-slider__input:active .el-input-number__increase {
//         border-color: ${theme};
//     }
//     .el-loading-spinner .el-loading-text {
//         color: ${theme};
//     }
//     .el-loading-spinner .path {
//         stroke: ${theme};
//     }
//     .el-loading-spinner i {
//         color: ${theme};
//     }
//     .el-upload--picture-card:hover,
//     .el-upload:focus {
//         border-color: ${theme};
//         color: ${theme};
//     }
//     .el-upload:focus .el-upload-dragger {
//         border-color: ${theme};
//     }
//     .el-upload-dragger .el-upload__text em {
//         color: ${theme};
//     }
//     .el-upload-dragger:hover {
//         border-color: ${theme};
//     }
//     .el-upload-dragger.is-dragover {
//         border: 2px dashed ${theme};
//     }
//     .el-upload-list__item .el-icon-close-tip {
//         color: ${theme};
//     }
//     .el-upload-list__item.is-success .el-upload-list__item-name:focus,
//     .el-upload-list__item.is-success .el-upload-list__item-name:hover {
//         color: ${theme};
//     }
//     .el-upload-list__item-delete:hover {
//         color: ${theme};
//     }
//     .el-progress-bar__inner {
//         background-color: ${theme};
//     }
//     .el-badge__content--primary {
//         background-color: ${theme};
//     }
//     .el-step__head.is-finish {
//         color: ${theme};
//         border-color: ${theme};
//     }
//     .el-step__title.is-finish {
//         color: ${theme};
//     }
//     .el-step__description.is-finish {
//         color: ${theme};
//     }
//     .el-collapse-item__header.focusing:focus:not(:hover) {
//         color: ${theme};
//     }
//     .el-tag {
//         color: ${theme};
//     }
//     .el-tag.is-hit {
//         border-color: ${theme};
//     }
//     .el-tag .el-tag__close {
//         color: ${theme};
//     }
//     .el-tag .el-tag__close:hover {
//         background-color: ${theme};
//     }
//     .el-tag--dark {
//         background-color: ${theme};
//         border-color: ${theme};
//     }
//     .el-tag--dark.is-hit {
//         border-color: ${theme};
//     }
//     .el-tag--plain {
//         color: ${theme};
//     }
//     .el-tag--plain.is-hit {
//         border-color: ${theme};
//     }
//     .el-tag--plain .el-tag__close {
//         color: ${theme};
//     }
//     .el-tag--plain .el-tag__close:hover {
//         background-color: ${theme};
//     }
//     .el-cascader .el-input .el-input__inner:focus,
//     .el-cascader .el-input.is-focus .el-input__inner {
//         border-color: ${theme};
//     }
//     .el-cascader__suggestion-item.is-checked {
//         color: ${theme};
//     }
//     .el-color-predefine__color-selector.selected {
//         -webkit-box-shadow: 0 0 3px 2px ${theme};
//         box-shadow: 0 0 3px 2px ${theme}
//     }
//     .el-color-dropdown__btn:hover {
//         color: ${theme};
//         border-color: ${theme};
//     }
//     .el-color-dropdown__link-btn {
//         color: ${theme};
//     }
//     .el-color-dropdown__link-btn:hover {
//         color: tint(${theme}, 20%)
//     }
//     .el-textarea__inner:focus {
//         border-color: ${theme};
//     }
//     .el-input.is-active .el-input__inner,
//     .el-input__inner:focus {
//         border-color: ${theme};
//     }
//     .el-transfer__button {
//         background-color: ${theme};
//     }
//     .el-transfer-panel__item:hover {
//         color: ${theme};
//     }
//     .el-timeline-item__node--primary {
//         background-color: ${theme};
//     }
//     .el-link.is-underline:hover:after {
//         border-bottom: 1px solid ${theme};
//     }
//     .el-link.el-link--default:after,
//     .el-link.el-link--primary.is-underline:hover:after,
//     .el-link.el-link--primary:after {
//         border-color: ${theme};
//     }
//     .el-link.el-link--default:hover {
//         color: ${theme};
//     }
//     .el-link.el-link--primary {
//         color: ${theme};
//     }
//     .el-button:focus,
//     .el-button:hover {
//         color: ${theme};
//     }
//     .el-button.is-plain:focus,
//     .el-button.is-plain:hover {
//         border-color: ${theme};
//         color: ${theme};
//     }
//     .el-button--primary {
//         background-color: ${theme};
//         border-color: ${theme};
//     }
//     .el-button--primary.is-plain {
//         color: ${theme};
//     }
//     .el-button--primary.is-plain:focus,
//     .el-button--primary.is-plain:hover {
//         background: ${theme};
//         border-color: ${theme};
//     }
//     .el-button--text {
//         color: ${theme};
//     }
//     .el-backtop,
//     .el-calendar-table td.is-today {
//         color: ${theme};
//     }
//     .el-checkbox.is-bordered.is-checked {
//         border-color: ${theme};
//     }
//     .el-checkbox__input.is-checked .el-checkbox__inner,
//     .el-checkbox__input.is-indeterminate .el-checkbox__inner {
//         background-color: ${theme};
//         border-color: ${theme};
//     }
//     .el-checkbox__input.is-checked+.el-checkbox__label {
//         color: ${theme};
//     }
//     .el-checkbox__input.is-focus .el-checkbox__inner {
//         border-color: ${theme};
//     }
//     .el-checkbox__inner:hover {
//         border-color: ${theme};
//     }
//     .el-checkbox-button__inner:hover {
//         color: ${theme};
//     }
//     .el-checkbox-button.is-checked .el-checkbox-button__inner {
//         background-color: ${theme};
//         border-color: ${theme};
//     }
//     .el-checkbox-button.is-checked:first-child .el-checkbox-button__inner {
//         border-left-color: ${theme};
//     }
//     .el-checkbox-button.is-focus .el-checkbox-button__inner {
//         border-color: ${theme};
//     }
//     .el-radio.is-bordered.is-checked {
//         border-color: ${theme};
//     }
//     .el-radio__input.is-checked .el-radio__inner {
//         border-color: ${theme};
//         background: ${theme};
//     }
//     .el-radio__input.is-checked+.el-radio__label {
//         color: ${theme};
//     }
//     .el-radio__input.is-focus .el-radio__inner {
//         border-color: ${theme};
//     }
//     .el-radio__inner:hover {
//         border-color: ${theme};
//     }
//     .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
//         -webkit-box-shadow: 0 0 2px 2px ${theme};
//         box-shadow: 0 0 2px 2px ${theme};
//     }
//     .el-cascader-node.is-selectable.in-checked-path {
//         color: ${theme};
//     }
//     `
//     setStyleContext("theme_style", css);
// }