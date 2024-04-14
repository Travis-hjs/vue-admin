import { defineComponent, inject, type PropType } from "vue";
import globalEvent from "@/utils/event";

/** 递归树层级组件 */
const TreeLevel = defineComponent({
  name: "TreeLevel",
  props: {
    options: {
      type: Array as PropType<Array<TreeItem>>,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    },
    /** 选择父节点时，是否也选中所有其子节点 */
    checkChild: {
      type: Boolean,
      default: false
    },
    /** 是否需要选择功能 */
    checkbox: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    /** 父组件注入的对象 */
    const parentProvide = inject<{ eventMap: { itemClick: string, itemChange: string } }>("treeParent");

    function onOpen(item: TreeItem) {
      item.open = !item.open;
      globalEvent.dispatch(parentProvide!.eventMap.itemClick, item);
    }

    function onChecked(item: TreeItem) {
      item.checked = !item.checked;
      /**
       * 递归处理
       * @param list
       * @param value
       */
      function each(list: Array<TreeItem>, value: boolean) {
        list.forEach(function (e) {
          e.checked = value;
          e.children.length && each(e.children, value);
        })
      }
      if (props.checkChild) {
        each(item.children, item.checked);
      } 
      // else {
      //   !item.checked && each(item.children, false);
      // }
      globalEvent.dispatch(parentProvide!.eventMap.itemChange, item);
    }
    
    return () => (
      <div style={{ paddingLeft: props.level > 0 ? "15px" : "0px" }}>
        {
          props.options.map(item => (
            <div
              class="base-tree-level"
              style={{ "height": item.height + "px" }}
              key={item.key}
              data-key={item.key}
              data-level={props.level}
            >
              <div class="base-tree-item fvertical" onClick={() => onOpen(item)}>
                <i class={`base-tree-icon el-icon-caret-right ${item.children.length ? "" : "hidden-icon"} ${item.open ? "expanded" : ""}`}></i>
                {
                  props.checkbox ? (
                    <span onClick={ e => e.stopPropagation() }>
                      <el-checkbox model-value={item.checked} onChange={() => onChecked(item)} disabled={item.disabled}></el-checkbox>
                    </span>
                  ) : undefined
                }
                { context.slots.treeitem ? context.slots.treeitem(item) : item.label }
              </div>
              {
                item.children.length ? (
                  <TreeLevel
                    options={item.children}
                    level={props.level + 1}
                    checkChild={props.checkChild}
                    checkbox={props.checkbox}
                    v-slots={{
                      treeitem: context.slots.treeitem ? (info: TreeItem) => context.slots.treeitem!(info) : undefined
                    }}
                  />
                ) : undefined
              }
            </div>
          ))
        }
      </div>
    )
  }
});

export default TreeLevel;
