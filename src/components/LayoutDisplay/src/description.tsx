import "../styles/description.scss";
import type { PropType } from "vue";
import type { DescriptionType } from "./types";
import { defineComponent } from "vue";

/** 描述节点 */
export function DescriptionItem(
  props: DescriptionType.ItemProps,
  { slots }: { slots: Record<string, any> }
) {
  return (
    <div
      class={`the-description-item${props.span === "full" ? " full-span" : ""}`}
      style={{
        "--span": typeof props.span === "number" ? props.span : undefined
      }}
    >
      <div
        class="the-description-label"
        style={{ "--label-width": props.labelWidth?.toString() }}
      >
        {props.label}
      </div>
      <div class="the-description-content">
        {slots.default && slots.default()}
      </div>
    </div>
  );
}

/**
 * 描述列表容器
 */
export const Description = defineComponent({
  props: {
    /**
     * 一行多少列
     * - 默认`3`
     */
    columns: {
      type: Number,
      default: undefined
    },
    /** 整体label宽度 */
    labelWidth: {
      type: String,
      default: undefined
    },
    /** `item`列表配置 */
    items: {
      type: Array as PropType<DescriptionType.Item[]>,
      default: () => []
    }
  },
  setup(props, { slots }) {
    function getString(
      item: DescriptionType.Item,
      key: "label" | "labelWidth" | "content",
      index: number
    ) {
      const value = item[key];
      if (typeof value === "function") {
        return value(index);
      }
      return value!;
    }

    return () => (
      <section
        class="the-description"
        style={{
          "--columns": props.columns,
          "--label-width": props.labelWidth
        }}
      >
        {props.items.map((item, itemIndex) => {
          let show = true;
          if (typeof item.show === "function") {
            show = item.show(itemIndex);
          } else if (typeof item.show === "boolean") {
            show = item.show;
          }
          if (!show) return null;

          function getContent() {
            if (item.slot) {
              return slots[item.slot] && slots[item.slot]!();
            }
            if (item.html) {
              return (
                <div
                  innerHTML={getString(item, "content", itemIndex)}
                  class="w-full"
                ></div>
              );
            }
            return getString(item, "content", itemIndex);
          }

          return (
            <DescriptionItem
              key={item.key || `item-${itemIndex}`}
              label={getString(item, "label", itemIndex)}
              labelWidth={getString(item, "labelWidth", itemIndex)}
              span={item.span}
            >
              {getContent()}
            </DescriptionItem>
          );
        })}
        {slots.default && slots.default()}
      </section>
    );
  }
});
