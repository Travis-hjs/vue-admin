import { openPreview } from "@/components/ImageViewer";
import type { CurdType, PresetCodeType } from "./types";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import type { PropType } from "vue";
import { formatDate, isType } from "@/utils";
import { shortcutMap } from "./data";
import icons from "./data/element-icons.json";
import { curdConfigState } from "./hooks";
import { watch } from "vue";
import { presetCodeMap } from "./data/code";
// ----------------- 一些零散的单一组件 -----------------

interface FooterBtnProps {
  loading?: boolean;
  disabledSubmit?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}

/**
 * 底部按钮
 * @param props
 */
export function FooterBtn(props: FooterBtnProps) {
  const close = props.onClose || (() => { });
  const submit = props.onSubmit || (() => { });
  return (
    <>
      <el-button onClick={close}>取 消</el-button>
      <el-button type="primary" loading={props.loading} disabled={props.disabledSubmit} onClick={submit}>
        确 认
      </el-button>
    </>
  );
}

/**
 * 获取元素尺寸样式
 * @param column
 */
function getImageStyle(column: CurdType.Table.Column) {
  const style: { width?: string; height?: string } = {};
  if (column.imageWidth) {
    style.width = `${column.imageWidth}px`;
  }
  if (column.imageHeight) {
    style.height = `${column.imageHeight}px`;
  }
  return style;
}

export interface TableImageProps {
  /** 表格列配置 */
  column: CurdType.Table.Column;
  /** 图片路径 */
  src: string;
  /** 预览列表，不传则使用`src`值代替 */
  previewList?: Array<string>;
}

/**
 * 表格图片-内部做了展示类型判断
 * @param props
 */
export function TableImage(props: TableImageProps) {
  function onPreview() {
    openPreview({
      urls: props.previewList ? props.previewList : [props.src]
    });
  }
  return props.column.cellType === "image" ? (
    <el-image
      class="the-table-image"
      style={getImageStyle(props.column)}
      src={props.src}
      onClick={onPreview}
      fit="cover"
    />
  ) : null;
}

/**
 * 图标`class`输入框
 * - [图标库](https://element.eleme.cn/#/zh-CN/component/icon)
 */
export const IconInput = defineComponent({
  props: {
    value: {
      type: [String, Function],
      default: ""
    }
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const iconClass = computed({
      get() {
        const val = typeof props.value === "function" ? "" : props.value;
        return val;
      },
      set(val) {
        emit("update:value", val);
      }
    });

    const keyword = ref("");

    const iconList = computed(() => {
      if (keyword) {
        return icons.filter(iconName => iconName.includes(keyword.value));
      }
      return icons;
    });

    const popoverRef = ref();

    function selectIcon(icon: string) {
      keyword.value = "";
      iconClass.value = icon;
      popoverRef.value.hide();
    }

    return () => (
      <div class="f-vertical w-full">
        <el-input
          v-model={iconClass.value}
          placeholder="请输入图标 class"
          class="mr-[6px]"
          v-slots={{
            suffix: () => <i class={iconClass.value}></i>
          }}
        />
        <el-popover
          ref={popoverRef}
          placement="top-start"
          width="400"
          trigger="click"
          v-slots={{
            reference: () => (
              <el-button type="primary" link>
                选择图标
              </el-button>
            )
          }}
        >
          <el-input
            class="mb-[10px]"
            v-model={keyword.value}
            placeholder="请输入关键字检索图标"
            clearable
            v-slots={{
              prefix: () => <i class="el-icon-search"></i>
            }}
          ></el-input>
          <ul class="grid max-h-[50vh] grid-cols-3 gap-[10px] overflow-auto">
            {iconList.value.map(icon => (
              <li
                class="fvc h-[100px] cursor-pointer flex-col border border-dashed border-[#ccc] px-[4px] text-center hover:border-[var(--blue)]"
                onClick={() => selectIcon(icon)}
              >
                <i
                  class={"mb-[10px] text-[#606266] " + icon}
                  style="font-size: 24px"
                ></i>
                <span class="text-[12px] text-[#99a9bf]">{icon}</span>
              </li>
            ))}
          </ul>
          {iconList.value.length <= 0 ? (
            <el-empty description="未检索到对应图标"></el-empty>
          ) : null}
        </el-popover>
      </div>
    );
  }
});

/** 日期选择器 */
export const DatePicker = defineComponent({
  props: {
    /** 表单组件配置 */
    config: {
      type: Object as PropType<CurdType.Date>,
      required: true
    },
    disabled: {
      type: Boolean
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    /** 日期侧边栏按钮列表 */
    let shortcutBtnList: Array<HTMLElement> = [];

    const className = "the-date-shortcut-selected";

    function onPickerChange() {
      const selected = document.querySelector(`.${className}`);
      selected && selected.classList.remove(className);
      const field = props.config;
      // 处理两个相同的范围日期
      if (["daterange", "datetimerange"].includes(field.dateType)) {
        const list = field.value as Array<Date>;
        if (list && new Date(list[0]).getTime() === new Date(list[1]).getTime()) {
          (field.value as typeof list)[1] = new Date(formatDate(list[1], "Y-M-D 23:59:59"));
        }
      }
      emit("change");
    }
    
    function selectPanelBtn(el: HTMLElement) {
      // onPickerChange(); // TODO: 因为日期组件的 change 事件会先触发，所以这里不需要再执行多一次了
      el.classList.add(className);
    }

    onMounted(function () {
      const field = props.config;
      if (field.type === "date") {
        const className = `.${field.id} .el-picker-panel__sidebar`;
        const panel = document.querySelector(className);
        if (!panel) return console.warn("找不到日期快捷面板节点！");
        shortcutBtnList = Array.from(panel.children) as Array<HTMLElement>;
        shortcutBtnList.forEach(btn => {
          btn.addEventListener("click", () => selectPanelBtn(btn));
        });
        const index = field.shortcutIndex;
        if (isType(index, "number") && index >= 0) {
          selectPanelBtn(shortcutBtnList[index]);
        }
      }
    });
  
    return () => (
      <>
        <el-date-picker
          v-model={props.config.value}
          placeholder={props.config.placeholder}
          type={props.config.dateType}
          format={props.config.formatShow}
          shortcuts={shortcutMap[props.config.dateType]}
          disabled={props.disabled}
          popper-class={props.config.id.toString()}
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="the-curd-field"
          onChange={onPickerChange}
        />
      </>
    )
  }
});

/**
 * `el-select`组件
 */
export const SelectField = defineComponent({
  props: {
    /** 表单组件配置 */
    config: {
      type: Object as PropType<CurdType.Select>,
      required: true
    },
    /** 选项配置 */
    setting: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const selected = computed({
      get() {
        return props.config.value;
      },
      set(val) {
        props.config.value = val;
        emit("change", val);
      }
    });

    const keyword = ref("");

    const selectOptions = computed(() => {
      const list = props.config.options || [];
      const join = props.config.joinShow;
      const key = keyword.value;
      if (key) {
        return list.filter(opt => {
          const label = opt[props.setting.label]?.toString() || "";
          const value = opt[props.setting.value]?.toString() || "";
          if (join) {
            return label.includes(key) || value.includes(key);
          }
          return label.includes(key);
        });
      }
      return list;
    });

    function getSelectProps() {
      const field = props.config;
      return {
        placeholder: field.placeholder,
        disabled: props.disabled,
        multiple: field.multiple,
        clearable: true,
        filterable: true,
        collapseTags: true,
        maxCollapseTags: field.max,
        class: `field-item${field.multiple ? " is-multiple-select" : ""}`,
        filterMethod(val: string) {
          keyword.value = val;
        },
      }
    }
    
    function getSelectLabel(option: BaseObj<string | number>) {
      const field = props.config;
      const setting = props.setting;
      if (field.joinShow) {
        return `${option[setting.label]}-${option[setting.value]}`;
      }
      return `${option[setting.label]}`;
    }

    return () => (
      <>
        {props.config.options.length > 36 ? (
          <el-select-v2
            v-model={selected.value}
            options={selectOptions.value}
            props={props.setting}
            {...getSelectProps()}
            v-slots={{
              default: ({ item }: { item: any }) => (
                <span title={getSelectLabel(item)}>{getSelectLabel(item)}</span>
              )
            }}
          />
        ) : (
          <el-select v-model={selected.value} {...getSelectProps()}>
            {selectOptions.value.map(item => (
              <el-option
                key={item[props.setting.value]}
                value={item[props.setting.value]}
                label={getSelectLabel(item)}
              />
            ))}
          </el-select>
        )}
      </>
    )
  }
});

/**
 * 预设代码组件
 */
export const PresetCode = defineComponent({
  props: {
    /** 字典类型 */
    type: {
      type: String as PropType<PresetCodeType.Key>,
      required: true,
    },
    /** 输入框绑定值 */
    value: {
      type: [String, Function],
      default: "",
    }
  },
  emits: ["update:value", "blur"],
  setup(props, { emit }) {
    const input = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      }
    });

    const state = reactive({
      loading: false,
      options: [] as Array<PresetCodeType.Item>,
      selected: undefined as undefined | number
    });

    function onInput() {
      state.selected = undefined;
    }

    function onSelect() {
      const option = state.options.find(opt => opt.id === state.selected);
      if (!option) return;
      const { pageId } = curdConfigState;
      input.value = option.code.replace("_pageId", pageId);
    }

    async function getOptions() {
      // state.loading = true;
      // const res = await getCurdTableList();
      // state.loading = false;
      // if (res.code !== 1) return;
      // console.log("getOptions >>", res.data);
      // state.options = res.data.records || [];
      state.options = presetCodeMap[props.type]
    }

    watch(
      () => props.type,
      () => {
        getOptions();
        onInput();
      },
      { immediate: true }
    );

    return () => (
      <>
        <el-input
          v-model={input.value}
          rows={6}
          type="textarea"
          placeholder="请输入代码片段"
          class="mb-[10px]"
          onInput={onInput}
          onBlur={() => emit("blur")}
        />
        <div class="f-vertical w-full">
          <el-text type="primary" class="min-w-[86px]">
            <i class="el-icon--left el-icon-position"></i>
            预设代码
          </el-text>
          <el-select
            v-model={state.selected}
            placeholder="请选择示例代码"
            onChange={onSelect}
          >
            {state.options.map(item => (
              <el-option key={item.id} label={item.name} value={item.id} />
            ))}
          </el-select>
        </div>
      </>
    );
  }
});
