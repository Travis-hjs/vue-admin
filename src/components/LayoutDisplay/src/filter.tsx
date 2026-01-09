import "../styles/filter.scss";
import type { FilterType } from "./types";

const width = "--label-width";

/**
 * 筛选包裹组件
 */
export function FilterWrap(props: FilterType.Wrap, { slots }: FilterType.WrapCtx) {
  return (
    <section 
      class={`the-filter-wrap flex${props.labelRight ? " label-right" : ""}`} 
      style={{ [width]: props.labelWidth || "96px" }}
    >
      { slots.left ? <div class="the-filter-side">{ slots.left() }</div> : null }
      {
        slots.content ? slots.content() : (
          <div class="the-filter-content f1">
            { slots.default && slots.default() }
          </div>
        )
      }
      { slots.right ? <div class="the-filter-side">{ slots.right() }</div> : null }
    </section>
  );
}

/**
 * 筛选节点组件
 */
export function FilterItem(props: FilterType.Item, { slots }: FilterType.ItemCtx) {
  function getWidth() {
    const val = props.tooltipWidth;
    if (!val) return undefined;
    if (typeof val === "number") {
      return `${val}px`;
    }
    return val;
  }
  return (
    <div class={`the-filter-item flex${props.required ? " is-required" : ""}`}>
      {slots.prefix ? slots.prefix() : null}
      {slots.label || props.label ? (
        <span
          class={`the-filter-label f-vertical${props.tooltip ? " the-tooltip" : ""}${props.tooltipWidth ? " wrap" : ""}`}
          style={{ [width]: props.labelWidth, "--tip-width": getWidth() }}
          data-tooltip={props.tooltip}
        >
          {slots.label ? slots.label() : props.label}
        </span>
      ) : null}
      {slots.default && slots.default()}
    </div>
  )
}

/**
 * 搜索 + 重置按钮
 * @param props 
 */
export function SearchBtn(props: FilterType.Btn) {
  const emit = props.onSearch || (() => {});
  return (
    <>
      {props.noReset ? null : (
        <el-button disabled={props.disabled || props.loading} onClick={() => emit(true)}>
          <i class={`el-icon-${props.loading ? "loading" : "refresh"} el-icon--left`} />
          重置
        </el-button>
      )}
      <el-button type="primary" disabled={props.disabled || props.loading} onClick={() => emit(false)}>
        <i class={`el-icon-${props.loading ? "loading" : "search"} el-icon--left`} />
        搜索
      </el-button>
    </>
  );
}
