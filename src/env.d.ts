/// <reference types="vite/client" />

// declare module "*.vue" {
//   import { DefineComponent } from "vue"
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

// declare namespace NodeJS {
//   type Timeout = number // 尝试修改 setTimeout | setInterval 的返回类型为 number; 会报错，但是成功
// }

declare module "timers" {
  global {
    // namespace NodeJS {
    //   type Timeout = number
    // }
    function setTimeout(callback: (args: void) => void, ms?: number): number;
  }
}
