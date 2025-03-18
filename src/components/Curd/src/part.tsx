import { openPreview } from "@/components/ImageViewer";
import type { CurdType, EditBtnType } from "./types";
import { computed, defineComponent, onMounted, ref } from "vue";
import type { PropType } from "vue";
import { formatDate, isType } from "@/utils";
import { shortcutMap } from "./data";

// ----------------- 一些零散且无状态的单一组件 -----------------

/**
 * 页面编辑按钮
 * @param props
 */
export function EditBtn(props: { onAction?: (type: EditBtnType) => void }) {
  const emit = props.onAction || (() => {});
  return (
    <>
      <el-button onClick={() => emit("exit")}>
        退 出
      </el-button>
      <el-button type="success" plain onClick={() => emit("copy")}>
        <i class="el-icon-document-copy el-icon--left" />
        复制JSON
      </el-button>
      <el-button type="primary" onClick={() => emit("complete")}>
        保 存
      </el-button>
    </>
  );
}

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

interface TableImageProps {
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

/** 图标`class`输入框 */
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

    const iconLink = "https://element.eleme.cn/#/zh-CN/component/icon";

    return () => (
      <div class="f-vertical w-full">
        <el-input
          v-model={iconClass.value}
          placeholder="请输入图标 class"
          class="mgr-10"
          clearable
        />
        <el-button type="primary" link>
          <a href={iconLink} target="_blank">
            去官网复制
          </a>
        </el-button>
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
      type: Object as PropType<CurdType.Select | CurdType.SelectMultiple>,
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
      const isMultiple = field.type === "select-multiple";
      return {
        placeholder: field.placeholder,
        disabled: props.disabled,
        multiple: field.type === "select-multiple",
        clearable: true,
        filterable: true,
        collapseTags: true,
        class: `field-item${isMultiple ? " is-multiple-select" : ""}`,
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

/** 搜索组件缩略图 */
export function ThumbnailSearch() {
  const list = Array.from({ length: 6 }).map((_, index) => ({ id: index }));
  return (
    <div class="the-thumbnail-search flex">
      <div class="the-thumbnail-search-content f1">
        {list.map(item => (
          <div key={item.id} class="the-thumbnail-search-item" />
        ))}
      </div>
      <div class="the-thumbnail-search-btn f-vertical">
        <i class="el-icon-search" />
      </div>
    </div>
  );
}

/** 表格组件缩略图 */
export function ThumbnailTable() {
  // const { ratio } = props;
  const ratio = 1;
  // 计算放大后的宽度和高度
  const width = 280 * ratio;
  const height = 180 * ratio;

  return (
    <section class="the-thumbnail-table">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${280 * ratio} ${180 * ratio}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-d2b0a988=""
        class="the-thumbnail-table-svg"
      >
        <rect width={width} height={height} fill=""></rect>
        <g filter="url(#filter0_d_13550_224439)">
          <path
            d="M65 60C65 58.8954 65.8954 58 67 58H213C214.105 58 215 58.8954 215 60V132C215 133.105 214.105 134 213 134H67C65.8954 134 65 133.105 65 132V60Z"
            fill="var(--el-fill-color-blank)"
          ></path>
          <path
            d="M67 57.7C65.7297 57.7 64.7 58.7297 64.7 60V132C64.7 133.27 65.7297 134.3 67 134.3H213C214.27 134.3 215.3 133.27 215.3 132V60C215.3 58.7297 214.27 57.7 213 57.7H67Z"
            stroke="var(--el-border-color-dark)"
            stroke-width={0.6 * ratio}
          ></path>
        </g>
        {[76, 92, 108, 124].map((y, index) => (
          <rect
            key={index}
            x={71 * ratio}
            y={y * ratio}
            width={16 * ratio}
            height={4 * ratio}
            rx={2 * ratio}
            fill="var(--el-color-primary)"
          />
        ))}
        {[107, 143, 197].map((x, colIndex) =>
          [76, 92, 108, 124].map((y, rowIndex) => (
            <rect
              key={`${colIndex}-${rowIndex}`}
              x={x * ratio}
              y={y * ratio}
              width={colIndex === 2 ? 12 * ratio : 20 * ratio}
              height={4 * ratio}
              rx={2 * ratio}
              fill="var(--el-border-color-dark)"
            />
          ))
        )}
        <path
          d="M65 60C65 58.8954 65.8954 58 67 58H213C214.105 58 215 58.8954 215 60V70H65V60Z"
          fill="var(--el-border-color-light)"
        ></path>
        {[71, 107, 143, 199].map(x => (
          <rect
            key={x}
            x={x * ratio}
            y={63 * ratio}
            width={10 * ratio}
            height={2 * ratio}
            rx={1 * ratio}
            fill="var(--el-border-color-dark)"
          />
        ))}
        {[85.75, 101.75, 117.75].map((y, index) => (
          <line
            key={index}
            x1={65 * ratio}
            y1={y * ratio}
            x2={215 * ratio}
            y2={y * ratio}
            stroke="var(--el-border-color-light)"
            stroke-width={0.5 * ratio}
          />
        ))}
        <defs>
          <filter
            id="filter0_d_13550_224439"
            x="51.0666"
            y="44.0671"
            width={177.867 * ratio}
            height={103.866 * ratio}
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            ></feColorMatrix>
            <feOffset></feOffset>
            <feGaussianBlur stdDeviation={6.66667 * ratio}></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="out"></feComposite>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            ></feColorMatrix>
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_13550_224439"
            ></feBlend>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_13550_224439"
              result="shape"
            ></feBlend>
          </filter>
        </defs>
      </svg>
    </section>
  );
}
