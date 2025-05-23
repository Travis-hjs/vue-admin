import type { TreeType } from "./types";

/**
 * 获取展示内容
 * @param opt 
 * @param setting 
 */
export function getLabel(opt: any, setting: TreeType.Setting): number | string {
  return opt[setting.label!] || "-";
}

const empty = [null, undefined, ""];

/**
 * 获取唯一`key`值
 * @param opt 
 * @param setting 
 */
export function getKey(opt: any, setting: TreeType.Setting): number | string {
  const key = opt[setting.key!];
  const value = opt[setting.value!];
  return empty.includes(key) ? value : key;
}
