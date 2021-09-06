/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

interface Window {
    /**
     * 当前版本，方便在控制台查看调试用
     * @description 引用的是`package.json`中的`version`
    */
    version: string
}
