import type { PropType } from "vue";
import { defineComponent } from "vue";
import "./style.scss";

export namespace DescriptionType {
  export interface Item {
    /** 标题名称 */
    label: string | (() => string);
    /** 标题宽度 */
    labelWidth?: string | (() => string);
    /** 内容 */
    content?: string | (() => string);
    /** 插槽名称 */
    slot?: string;
    /**
     * 一行占位数量
     * - `full`: 占满整行
     */
    span?: number | "full";
    /**
     * 唯一标识
     * - 不传默认会以`index`代替
     */
    key?: string;
  }
}

/**
 * 描述容器`item`
 */
export const DescriptionItem = defineComponent({
  props: {
    /** 标题 */
    label: {
      type: String,
      default: undefined,
    },
    /** 标题宽度 */
    labelWidth: {
      type: String,
      default: undefined,
    },
    /**
     * 一行占位数量
     * - `full`: 占满整行
     */
    span: {
      type: [Number, String] as PropType<number | "full">,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div
        class={`the-description-item${props.span === "full" ? " full-span" : ""}`}
        style={{ "--span": typeof props.span === "number" ? props.span : undefined }}
      >
        <div class="the-description-label" style={{ "--label-width": props.labelWidth }}>
          {props.label}
        </div>
        <div class="the-description-content">
          {slots.default && slots.default()}
        </div>
      </div>
    );
  },
});

/**
 * 描述列表容器组件
 */
export const Description = defineComponent({
  props: {
    /** 一行多少列 */
    columns: {
      type: Number,
      default: undefined,
    },
    /** 整体label宽度 */
    labelWidth: {
      type: String,
      default: undefined,
    },
    /** `item`列表配置 */
    items: {
      type: Array as PropType<DescriptionType.Item[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    function getString(item: DescriptionType.Item, key: "label" | "labelWidth" | "content") {
      const value = item[key];
      if (typeof value === "function") {
        return value();
      }
      return value;
    }

    return () => (
      <section
        class="the-description"
        style={{
          "--columns": props.columns,
          "--label-width": props.labelWidth,
        }}
      >
        {props.items.map((item, itemIndex) => (
          <DescriptionItem
            key={item.key || `item-${itemIndex}`}
            label={getString(item, "label")}
            labelWidth={getString(item, "labelWidth")}
            span={item.span}
            v-slots={{
              default: () => {
                if (item.slot) {
                  return slots[item.slot] && slots[item.slot]!();
                }
                return getString(item, "content");
              },
            }}
          />
        ))}
        {slots.default && slots.default()}
      </section>
    );
  },
});
