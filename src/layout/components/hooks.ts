import type { LayoutType } from "@/store/types";
import { useRoute, useRouter } from "vue-router";

type ActiveItem = Partial<Pick<LayoutType.Tag, 'path'>> & {
  query?: any;
  params?: any;
};

export function useLayoutRoute() {
  const route = useRoute();
  const router = useRouter();

  function toString<T>(value: T) {
    return JSON.stringify(value || {});
  }

  /**
   * 目标路由是否处于激活状态
   * @param tag
   */
  function isActive<T extends ActiveItem>(tag: T) {
    return (
      tag.path === route.path &&
      toString(tag.query) === toString(route.query) &&
      toString(tag.params) === toString(route.params)
    );
  }

  /**
   * 查找某个菜单项下面或自身是否有处于路由激活状态
   * @param menu 菜单项
   */
  function hasActive(menu: LayoutType.Menu) {
    if (isActive(menu)) {
      return true;
    }
    if (menu.children && menu.children.length) {
      for (let i = 0; i < menu.children.length; i++) {
        const sub = menu.children[i];
        if (hasActive(sub)) {
          return true;
        }
      }
    }
    return false;
  }

  return {
    route,
    router,
    isActive,
    hasActive,
  }
}
