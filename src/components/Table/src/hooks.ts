import { getCountId } from "@/hooks/common";
import { onActivated, onMounted, onUnmounted, reactive } from "vue";

/**
 * 表格高度自适应
 */
export function useAdaptiveTable() {
  const adaptive = reactive({
    height: undefined as number | undefined,
    id: getCountId("table"),
  });

  let tableElement: HTMLElement;

  function update() {
    if (!tableElement) return;
    let height = tableElement.clientHeight;
    if (!height) return;
    adaptive.height = height;
  }

  let init = false;

  let observer: ResizeObserver;

  onActivated(function () {
    init && update();
  });

  onMounted(function () {
    tableElement = document.getElementById(adaptive.id) as HTMLElement;
    if (!tableElement) return;
    // TODO: 判断是否为弹性盒子
    if (!tableElement.classList.contains("f1")) return;
    tableElement.style.overflow = "hidden";
    update();
    observer = new ResizeObserver(function () {
      update();
    });
    observer.observe(tableElement);
    setTimeout(() => {
      init = true;
    }, 100);
  });

  onUnmounted(function () {
    observer && observer.disconnect();
  });

  return {
    update,
    adaptive,
  }
}
