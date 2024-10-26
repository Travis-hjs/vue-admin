import {
  defineComponent,
  type PropType,
  reactive,
  ref,
  TransitionGroup,
  watch,
  computed
} from "vue";
import { openPreview } from "../ImageViewer";
import {
  getActionData,
  getColumnData,
  getFormConfig,
  useProvideState,
  type CurdType
} from "./index";
import type { FormInstance } from "element-plus";
import { deepClone, inputOnlyNumber } from "@/utils";
import Field from "./Field.vue";
import { useListDrag } from "@/hooks/common";
import { messageBox } from "@/utils/message";

// --------------------- 表格相关零散功能组件 ---------------------

/** 操作栏的标记 */
export const actionProp = "action-right";
/** 表格操作列中，编辑按钮的`key` */
export const actionEditKey = "action-edit";

export type EditBtnType = "exit" | "copy" | "complete";

/**
 * 页面编辑按钮
 * @param props
 */
export function EditBtn(props: { onAction?: (type: EditBtnType) => void }) {
  const emit = props.onAction || (() => { });
  return (
    <>
      <el-button link onClick={() => emit("exit")}>
        退出编辑
      </el-button>
      <el-button type="success" link onClick={() => emit("copy")}>
        <i class="el-icon-document-copy el-icon--left" />
        复制JSON
      </el-button>
      <el-button type="primary" onClick={() => emit("complete")}>
        完成编辑
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

interface Part {
  column: CurdType.Table.Column;
}

interface TableImageProps extends Part {
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
      class="h-[80px] w-[80px] cursor-pointer"
      style={getImageStyle(props.column)}
      src={props.src}
      onClick={onPreview}
      fit="cover"
    />
  ) : null;
}

interface TableHeaderProps extends Part {
  /**
   * 触发排序方法
   * @param key 数据对象对应的键值
   * @param action 排序操作
   */
  onSort?: (key: string, action: CurdType.Table.Column["sort"]) => void;
}

/**
 * 自定义表头
 * @param props
 */
export function TableHeader(props: TableHeaderProps) {
  const col = props.column;
  const map = {
    true: {
      index: 0,
      icon: "el-icon-sort"
    },
    asc: {
      index: 1,
      icon: "el-icon-sort-up"
    },
    desc: {
      index: 2,
      icon: "el-icon-sort-down"
    }
  };
  const actions = [true, "asc", "desc"] as const;

  function onSwitch() {
    const key = col.sort.toString() as keyof typeof map;
    let index = map[key].index;
    index++;
    if (index >= actions.length) {
      index = 0;
    }
    const action = actions[index];
    props.onSort && props.onSort(col.prop, action);
  }

  return !col.sort && !col.iconTips ? (
    <>{col.label}</>
  ) : (
    <div class="f-vertical w-full">
      {col.label}
      {col.iconTips ? (
        <el-tooltip effect="dark" content={col.iconTips} placement="top">
          <i class="el-icon--right el-icon-question text-[#666]" />
        </el-tooltip>
      ) : null}
      {col.sort ? (
        <div class="f1 f-right">
          <el-button link onClick={onSwitch}>
            <i class={`el-icon--right ${map[col.sort.toString() as keyof typeof map].icon}`} />
          </el-button>
        </div>
      ) : null}
    </div>
  );
}

export type OptionBtn = "delete" | "add" | "export" | "setting" | "edit";

interface TableOptionProps {
  /** 是否编辑模式 */
  editMode?: boolean;
  /** 配置数据 */
  config: CurdType.Table.Config;
  /**
   * 按钮操作回调
   * @param type
   */
  onAction?: (type: OptionBtn) => void;
}

/**
 * 表格操作选项组件
 * @param props
 */
export function TableOption(props: TableOptionProps) {
  const emit = props.onAction || (() => {});
  const state = props.config;
  const hasDelete = !!state.selectKey;
  const hasAdd = state.formAdd && state.formAdd.fields.length > 0;
  const hasEdit = state.formEdit && state.formEdit.fields.length > 0;
  const icon = {
    on: "el-icon-success",
    off: "el-icon-remove-outline"
  };
  const editModeBtnList = [
    {
      type: "delete",
      text: hasDelete ? "修改删除" : "配置删除",
      icon: hasDelete ? icon.on : icon.off,
      style: hasDelete ? "primary" : "info"
    },
    {
      type: "add",
      text: hasAdd ? "修改新增表单" : "配置新增表单",
      icon: hasAdd ? icon.on : icon.off,
      style: hasAdd ? "primary" : "info"
    },
    {
      type: "edit",
      text: hasEdit ? "修改编辑表单" : "配置编辑表单",
      icon: hasEdit ? icon.on : icon.off,
      style: hasEdit ? "primary" : "info"
    }
  ] as const;
  return (
    <div>
      {props.editMode ? (
        <>
          {editModeBtnList.map(btn => (
            <el-button type={btn.style} link onClick={() => emit(btn.type)}>
              <i class={`el-icon--left ${btn.icon}`} />
              {btn.text}
            </el-button>
          ))}
        </>
      ) : (
        <>
          {hasDelete ? (
            <el-button type="danger" link onClick={() => emit("delete")}>
              <i class="el-icon--left el-icon-delete" />
              删除
            </el-button>
          ) : null}
          {hasAdd ? (
            <el-button type="primary" link onClick={() => emit("add")}>
              <i class="el-icon--left el-icon-plus" />
              新增
            </el-button>
          ) : null}
          <el-button type="primary" link onClick={() => emit("export")}>
            <i class="el-icon--left el-icon-download" />
            导出
          </el-button>
          <el-tooltip
            effect="dark"
            content="配置表格展示、排序等操作"
            placement="top-end"
          >
            <el-button type="primary" link onClick={() => emit("setting")}>
              <i class="el-icon--left el-icon-setting" />
              设置
            </el-button>
          </el-tooltip>
        </>
      )}
    </div>
  );
}

interface FooterBtnProps {
  loading?: boolean;
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
      <el-button type="primary" loading={props.loading} onClick={submit}>
        确 认
      </el-button>
    </>
  );
}

/** 配置表格列弹框 */
export const ConfigColumn = defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: String as PropType<"add" | "edit">,
      required: true
    },
    keys: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    form: Object as PropType<CurdType.Table.Column>
  },
  emits: ["update:show", "submit"],
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      form: getColumnData()
    });

    const title = computed(() => `${props.type === "add" ? "新增" : "编辑"}表格列`);

    const formRef = ref<FormInstance>();

    const formRules = {
      label: [{ required: true, message: "请输入表格列标题", trigger: "blur" }],
      prop: [
        {
          required: true,
          validator(r: any, v: string, callback: (err?: Error) => void) {
            if (!v) {
              callback(new Error("输入字段不能为空！"));
            } else {
              if (props.keys.includes(state.form.prop)) {
                callback(new Error("已经存在相同的值！"));
              } else {
                callback();
              }
            }
          },
          trigger: "blur"
        }
      ],
      jsCode: [
        {
          required: true,
          validator(r: any, v: string, callback: (err?: Error) => void) {
            if (!v) {
              callback(new Error("代码片段不能为空！"));
            } else {
              if (v.includes("return")) {
                callback();
              } else {
                callback(new Error(`代码片段必须带有返回字段 "return"`));
              }
            }
          },
          trigger: "blur"
        }
      ]
    };

    function onInputNumber(val: string, key: "width" | "minWidth" | "imageWidth" | "imageHeight") {
      state.form[key] = inputOnlyNumber(val);
    }

    function onClose() {
      emit("update:show", false);
    }

    function onSubmit() {
      formRef.value?.validate(val => {
        if (!val) return;
        const form = deepClone(state.form);
        // TODO: 转换数字类型
        const keys = [
          "width",
          "minWidth",
          "imageWidth",
          "imageHeight"
        ] as const;
        keys.forEach(item => {
          if (form[item]) {
            form[item] = Number(form[item]);
          }
        });
        // TODO: 设置必须属性
        // form.key = form.prop;
        if (form.cellType === "image") {
          form.slot = form.prop;
        }
        if (form.sort || form.iconTips) {
          form.slotHead = `header-${form.prop}`;
        }
        emit("submit", form);
        onClose();
      });
    }

    watch(
      () => props.show,
      function (show) {
        state.show = show;
        if (!show) return;
        if (props.type === "add") {
          state.form = getColumnData();
        } else {
          state.form = deepClone(props.form)!;
        }
        setTimeout(() => formRef.value?.clearValidate());
      }
    );

    const cellTypeOptions: Array<CurdType.Table.ColumnOption<"cellType">> = [
      { label: "默认普通文本", value: "text" },
      { label: "图片预览组件", value: "image" },
      { label: "自定义 js 代码", value: "js" }
    ];

    const sortOptions: Array<CurdType.Table.ColumnOption<"sort">> = [
      { label: "不可排序", value: false },
      { label: "可排序", value: true },
      { label: "默认升序", value: "asc" },
      { label: "默认降序", value: "desc" }
    ];

    return () => (
      <base-dialog
        v-model={state.show}
        title={title.value}
        width="580px"
        onClose={onClose}
        v-slots={{
          footer: <FooterBtn onClose={onClose} onSubmit={onSubmit} />
        }}
      >
        <el-form
          ref={formRef}
          model={state.form}
          rules={formRules}
          label-position="right"
          label-width="130px"
        >
          <el-form-item label="表格列标题" prop="label">
            <el-input
              v-model={state.form.label}
              clearable
              placeholder={formRules.label[0].message}
            />
          </el-form-item>
          <el-form-item label="表格列键值" prop="prop">
            <el-input
              v-model={state.form.prop}
              clearable
              placeholder="请输入表格列键值"
            />
          </el-form-item>
          <el-form-item label="表格列宽度" prop="width">
            <el-input
              v-model={state.form.width}
              clearable
              placeholder="请输入表格列宽度，例如：120（默认自适应）"
              onChange={(e: string) => onInputNumber(e, "width")}
            />
          </el-form-item>
          <el-form-item label="表格列最小宽度" prop="minWidth">
            <el-input
              v-model={state.form.minWidth}
              clearable
              placeholder="请输入表格列最小宽度，例如：120（默认自适应）"
              onChange={(e: string) => onInputNumber(e, "minWidth")}
            />
          </el-form-item>
          <el-form-item label="表格列展示类型" prop="prop">
            <el-select v-model={state.form.cellType}>
              {cellTypeOptions.map(item => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                />
              ))}
            </el-select>
          </el-form-item>
          {state.form.cellType === "image" ? (
            <>
              <el-form-item label="图片宽度(像素)" prop="imageWidth">
                <el-input
                  v-model={state.form.imageWidth}
                  clearable
                  placeholder="请输入数字（默认80px）"
                  onChange={(e: string) => onInputNumber(e, "imageWidth")}
                />
              </el-form-item>
              <el-form-item label="图片高度(像素)" prop="imageHeight">
                <el-input
                  v-model={state.form.imageHeight}
                  clearable
                  placeholder="请输入数字（默认80px）"
                  onChange={(e: string) => onInputNumber(e, "imageHeight")}
                />
              </el-form-item>
            </>
          ) : null}
          {state.form.cellType === "js" ? (
            <el-form-item label="js代码" prop="jsCode">
              <el-input
                v-model={state.form.jsCode}
                type="textarea"
                placeholder="请输入代码片段"
              />
              <span class="the-tag mt-[10px] leading-[18px]">
                函数代码片段：第一个参数 cellValue 是表格值，第二个参数 row
                是完整对象
              </span>
            </el-form-item>
          ) : null}

          <el-form-item label="表格列排序操作" prop="sort">
            <el-select v-model={state.form.sort}>
              {sortOptions.map(item => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                />
              ))}
            </el-select>
          </el-form-item>
          <el-form-item label="内容溢出截断" prop="tooltip">
            <el-switch
              v-model={state.form.tooltip}
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item label="表头图标提示文字" prop="iconTips">
            <el-input
              v-model={state.form.iconTips}
              clearable
              placeholder="请输入表头图标提示文字"
            />
          </el-form-item>
        </el-form>
      </base-dialog>
    );
  }
});

/** 配置删除 */
export const ConfigDelete = defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectKey: {
      type: String,
      default: ""
    }
  },
  emits: ["update:show", "submit"],
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      keyword: ""
    });

    function onClose() {
      emit("update:show", false);
    }

    function onSubmit() {
      onClose();
      emit("submit", state.keyword);
    }

    watch(
      () => props.show,
      function (show) {
        state.show = show;
        if (!show) return;
        state.keyword = props.selectKey || "";
      },
      { immediate: true }
    );

    const tips = `[{ id: 1, name: "名称", status: 2 }]`;

    return () => (
      <base-dialog
        v-model={state.show}
        title="配置多选删除功能"
        width="420px"
        onClose={onClose}
        v-slots={{
          footer: <FooterBtn onClose={onClose} onSubmit={onSubmit} />
        }}
      >
        <el-form labelPosition="right" labelWidth="120px">
          <el-form-item label="数据键值">
            <el-input
              class="mb-[8px]"
              v-model={state.keyword}
              placeholder="请输入数据键值"
              clearable
            />
            <div class="the-tag">
              <p class="mb-[8px]">表格数据中的字段，例如表格数：</p>
              <p class="mb-[8px]">{tips}</p>
              <p class="mb-[8px]">则键值可以为 id</p>
              <p>
                <i class="el-icon-info el-icon--left" />
                不填则没有删除功能
              </p>
            </div>
          </el-form-item>
        </el-form>
      </base-dialog>
    );
  }
});

/** 配置操作列表 */
export const ConfigAction = defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    /** 操作列按钮列表 */
    list: {
      type: Array as PropType<Array<CurdType.Table.Action>>,
      required: true
    },
    /** 列宽 */
    columnWidth: {
      type: [String, Number],
      default: ""
    }
  },
  emits: ["update:show", "submit"],
  setup(props, { emit }) {
    const formRef = ref<FormInstance>();
    const state = reactive({
      show: false,
      list: [] as typeof props.list,
      form: getActionData(),
      width: "",
      index: -1,
      /** 是否有编辑按钮在当前列表中 */
      hasEdit: false
    });

    const formRules = {
      text: {
        required: true,
        message: "请输入按钮文字",
        trigger: "blur"
      },
      jsCode: {
        required: true,
        message: "请输入按钮操作代码",
        trigger: "blur"
      },
      icon: {
        required: false,
        message: "请输入图标 class",
        trigger: "blur"
      },
      type: {
        required: false,
        message: "请选择按钮类型",
        trigger: "change"
      }
    };

    function onClose() {
      emit("update:show", false);
    }

    function onSubmit() {
      onClose();
      emit("submit", JSON.parse(JSON.stringify(state.list)), Number(state.width));
    }

    function onAdd() {
      formRef.value?.validate(val => {
        if (!val) return;
        const data = JSON.parse(JSON.stringify(state.form));
        state.list.push(data);
        state.form = getActionData();
      });
    }

    function onConfirm() {
      formRef.value?.validate(val => {
        if (!val) return;
        state.list[state.index] = state.form;
        state.index = -1;
        state.form = getActionData();
      });
    }

    function onEdit(index: number) {
      const data = state.list[index];
      state.form = JSON.parse(JSON.stringify(data));
      state.index = index;
    }

    function onDelete(index: number) {
      messageBox({
        title: "操作提示",
        content: `是否删除【${state.list[index].text}】？`,
        cancelText: "取消",
        confirm() {
          state.list.splice(index, 1);
        }
      });
    }

    watch(
      () => props.show,
      function (show) {
        state.show = show;
        if (!show) return;
        state.list = JSON.parse(JSON.stringify(props.list));
        state.form = getActionData();
        state.index = -1;
        state.hasEdit = state.list.some(item => item.key === actionEditKey);
        state.width = props.columnWidth.toString();
        setTimeout(() => formRef.value?.clearValidate());
      },
      { immediate: true }
    );

    const typeOptions = [
      { label: "默认（蓝色）", value: "primary" },
      { label: "成功（绿色）", value: "success" },
      { label: "警告（橙色）", value: "warning" },
      { label: "危险（红色）", value: "danger" },
      { label: "文本（灰色）", value: "info" }
    ];

    const iconLink = "https://element.eleme.cn/#/zh-CN/component/icon";

    const { onDragStart, onDragMove, onDropEnd } = useListDrag({
      list: () => state.list,
      update(newList) {
        state.list = newList;
      }
    });

    function onInputWidth(val: string) {
      state.width = inputOnlyNumber(val);
    }

    /** 是否能拖拽 */
    function canDraggable(action: CurdType.Table.Action) {
      if (action.key != actionEditKey && state.list.length > 1 && state.index === -1) {
        return true;
      }
      return undefined;
    }

    // 不将参数写在标签上是因为`class`属性类型报错，所以改用传参写法
    const transitionProp: any = {
      name: "the-group",
      tag: "div",
      class: "f1 the-curd-action-list"
    };

    return () => (
      <base-dialog
        v-model={state.show}
        title="配置操作列按钮功能"
        width="840px"
        onClose={onClose}
        v-slots={{
          footer: <FooterBtn onClose={onClose} onSubmit={onSubmit} />
        }}
      >
        <div class="flex">
          <TransitionGroup {...transitionProp}>
            {state.list.map((item, itemIndex) => (
              <div
                class={`the-curd-option-item f-vertical${itemIndex === state.index ? " the-curd-selected" : ""}`}
                key={item.key}
                data-key={item.key !== actionEditKey ? item.key : null}
                draggable={canDraggable(item)}
                onDragstart={() => onDragStart(itemIndex)}
                onDragover={(e: DragEvent) => onDragMove(e, itemIndex)}
                onDrop={onDropEnd}
              >
                {item.key === actionEditKey ? (
                  <>
                    <el-button type={item.type} link>
                      {item.icon ? (<i class={`el-icon--left ${item.icon}`} />) : null}
                      {item.text}
                    </el-button>
                    <div class="f1"></div>
                    <el-text type="info">编辑按钮不可删除、拖拽等操作，且处于首位</el-text>
                  </>
                ) : (
                  <>
                    {state.index === -1 ? (<i class="el-icon--left el-icon-rank" />) : null}
                    <el-button type={item.type} link>
                      {item.icon ? (<i class={`el-icon--left ${item.icon}`} />) : null}
                      {item.text}
                    </el-button>
                    <div class="f1"></div>
                    {state.index === -1 ? (
                      <>
                        <el-button link type="danger" onClick={() => onDelete(itemIndex)}>
                          <i class="el-icon-delete" />
                        </el-button>
                        <el-button link type="success" onClick={() => onEdit(itemIndex)}>
                          <i class="el-icon-edit" />
                        </el-button>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            ))}
            {!state.list.length ? (<el-empty image-size={120} description="请添加操作列功能按钮" />) : null}
          </TransitionGroup>
          <el-form
            ref={formRef}
            model={state.form}
            rules={formRules}
            labelPosition="right"
            labelWidth="120px"
            class="f1"
          >
            <el-form-item label="操作列宽度">
              <el-input
                v-model={state.width}
                placeholder="请输入表格列宽度，例如：160"
                clearable
                onChange={onInputWidth}
              />
            </el-form-item>
            <el-form-item label="按钮文字" prop="text">
              <el-input
                v-model={state.form.text}
                placeholder={formRules.text.message}
                clearable
              />
            </el-form-item>
            <el-form-item label="按钮功能代码" prop="jsCode">
              <el-input
                v-model={state.form.jsCode}
                type="textarea"
                placeholder="请输入代码片段"
              />
              <span class="the-tag mt-[10px] leading-[18px]">
                函数代码片段，点击的时候运行：第一个参数 row 是表格对象值，第二个参数 index 是当前索引
              </span>
            </el-form-item>
            <el-form-item label="按钮图标" prop="icon">
              <div class="f-vertical w-full">
                <el-input
                  v-model={state.form.icon}
                  placeholder={formRules.icon.message}
                  clearable
                />
                <el-text type="primary" style="width: 110px; text-align: right;">
                  <a href={iconLink} target="_blank">去官网复制</a>
                </el-text>
              </div>
            </el-form-item>
            <el-form-item label="按钮类型" prop="type">
              <el-select v-model={state.form.type} placeholder={formRules.type.message}>
                {typeOptions.map(item => (
                  <el-option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="f-right w-full">
                {state.index > -1 ? (
                  <el-button type="primary" plain onClick={onConfirm}>
                    <i class="el-icon--left el-icon-finished" />
                    确认
                  </el-button>
                ) : (
                  <el-button type="primary" plain onClick={onAdd}>
                    <i class="el-icon--left el-icon-plus" />
                    新增按钮
                  </el-button>
                )}
              </div>
            </el-form-item>
          </el-form>
        </div>
      </base-dialog>
    );
  }
});

/** 新增 or 编辑表单 */
export const TableForm = defineComponent({
  props: {
    config: {
      type: Object as PropType<CurdType.Table.From>,
      default: () => getFormConfig()
    },
    /** 表单类型 */
    type: {
      type: String as PropType<"add" | "edit">
    },
    /** 是否编辑模式 */
    editMode: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  emits: ["change"],
  setup(props, { emit, expose }) {
    const formRef = ref<FormInstance>();
    const config = getFormConfig();
    const state = reactive({
      config,
      form: {} as BaseObj<any>,
      rules: {} as BaseObj<any>
    });
    /** 父组件注入的对象 */
    const provideState = useProvideState();
    /** 当前表单操作名 */
    const currentName = props.type === "add" ? "新增" : "编辑";

    watch(
      () => props.config,
      function (config) {
        // console.log("config >>", config);
        if (config) {
          state.config = JSON.parse(JSON.stringify(config));
        }
      },
      { immediate: true }
    );

    watch(
      () => state.config.fields,
      function (fields) {
        // console.log("表单项变动 >>", fields);
        const form: typeof state.form = {};
        const rules: typeof state.rules = {};
        const blurs = ["input", "input-between", "textarea"];
        fields &&
          fields.forEach(field => {
            // TODO: 这里赋值什么都不重要，因为校验规则和组件绑定的数据不是这个对象，只是表单组件需要绑定而已
            form[field.key] = field.value;
            if (field.required) {
              // TODO: 验证数据的操作才是关键
              rules[field.key] = [
                {
                  required: true,
                  validator(_: any, val: any, callback: (err?: Error) => void) {
                    // console.log("validator >>", val);
                    if (field.type === "input-between" && !field.value[0] && !field.value[1]) {
                      callback(new Error("请输入两个范围字段"));
                      return;
                    }
                    if (field.valueType === "array" && !(field.value as Array<string>).length) {
                      callback( new Error((field.placeholder as string) || "请选择"));
                      return;
                    }
                    if (field.valueType !== "boolean" && [undefined, null, ""].includes(field.value as string)) {
                      const tips = blurs.includes(field.type) ? "请输入内容" : "请选择";
                      callback(new Error((field.placeholder as string) || tips));
                      return;
                    }
                    callback();
                  },
                  trigger: blurs.includes(field.type) ? "blur" : "change"
                }
              ];
            }
          });
        state.form = form;
        state.rules = rules;
        setTimeout(clear);
      },
      { immediate: true }
    );

    function openEditor(index: number) {
      clear();
      provideState.editor.action = index >= 0 ? "edit" : "add";
      provideState.editor.form = state.config;
      provideState.editor.index = index;
      provideState.editor.show = true;
    }

    function onDelete(index: number) {
      const list = state.config.fields;
      clear();
      messageBox({
        title: "操作提示",
        content: `是否删除【${list[index].label}】？`,
        cancelText: "取消",
        confirm() {
          list.splice(index, 1);
        }
      });
    }

    function onDeleteAll() {
      messageBox({
        title: "操作提示",
        content: `是否移除【${currentName}】表单？移除后将不会出现对应功能按钮。`,
        cancelText: "取消",
        confirm() {
          state.config.fields = [];
        }
      });
    }

    function onExit() {
      emit("change");
    }

    function onComplete() {
      const name = props.type === "add" ? "编辑" : "新增";
      messageBox({
        title: "操作提示",
        content: `是否将表单数据同步到【${name}】表单？`,
        cancelText: "不同步",
        confirmText: "同步",
        cancel() {
          emit("change", state.config);
        },
        confirm() {
          emit("change", state.config, true);
        }
      });
    }

    /**
     * 表单验证
     * @param callback
     */
    function validate(callback?: () => void) {
      formRef.value?.validate(val => val && callback && callback());
    }

    /** 表单移除验证 */
    function clear() {
      formRef.value?.clearValidate();
    }

    expose({
      clear,
      validate
    });

    const { onDragStart, onDragMove, onDropEnd } = useListDrag({
      list: () => state.config.fields,
      update(newList) {
        state.config.fields = newList;
      },
      findLevel: 10
    });

    const isEdit = computed(() => provideState.editor.show);
    
    const emptyText = `当前没有表单项，当没有表单项时【${currentName}】功能按钮不会出现~`;

    return () => (
      <el-form
        ref={formRef}
        model={state.form}
        rules={state.rules}
        labelWidth={state.config.labelWidth}
        labelPosition={state.config.labelPosition}
        disabled={props.disabled}
        style={props.editMode ? { width: state.config.width } : {}}
        class={props.editMode ? "is-edit-form" : ""}
      >
        {props.editMode ? (
          <>
            <TransitionGroup name="the-group" tag="div">
              {state.config.fields.map((field, fieldIndex) => (
                <el-form-item
                  class={provideState.editor.index === fieldIndex && isEdit.value ? "the-curd-selected" : "" }
                  prop={field.key}
                  key={field.key}
                  label={field.label}
                  data-key={field.key}
                  draggable={state.config.fields.length > 1}
                  onDragstart={() => onDragStart(fieldIndex)}
                  onDragover={(e: DragEvent) => onDragMove(e, fieldIndex)}
                  onDrop={onDropEnd}
                >
                  <div class="f-vertical w-full">
                    <Field class="mr-[10px]" fieldData={field} editMode />
                    <el-button
                      link
                      type="success"
                      disabled={isEdit.value}
                      onClick={() => openEditor(fieldIndex)}
                    >
                      <i class="el-icon-edit" />
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      disabled={isEdit.value}
                      onClick={() => onDelete(fieldIndex)}
                    >
                      <i class="el-icon-delete" />
                    </el-button>
                  </div>
                </el-form-item>
              ))}
            </TransitionGroup>
            {!state.config.fields.length ? ( <el-empty description={emptyText} />) : null}
            {!isEdit.value ? (
              <>
                <el-button link onClick={onExit}>
                  退出编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  disabled={!state.config.fields.length}
                  onClick={onDeleteAll}
                >
                  <i class="el-icon--left el-icon-delete" />
                  删除表单
                </el-button>
                <el-button type="success" link onClick={onComplete}>
                  <i class="el-icon--left el-icon-finished" />
                  完成表单
                </el-button>
                <el-button type="primary" link onClick={() => openEditor(-1)}>
                  <i class="el-icon--left el-icon-plus" />
                  添加一项
                </el-button>
                {/* <el-button onClick={() => validate()}>调试验证</el-button> */}
              </>
            ) : null}
          </>
        ) : (
          state.config?.fields?.map(field => (
            <el-form-item label={field.label} prop={field.key} key={field.key}>
              <Field fieldData={field} />
            </el-form-item>
          ))
        )}
      </el-form>
    );
  }
});

/** 表格展示相关设置 */
export const TableSetting = defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array<CurdType.Table.Column>,
      required: true
    }
  },
  emits: ["update:show", "submit"],
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      list: [] as typeof props.columns
    });

    function onClose() {
      emit("update:show", false);
    }

    function onSubmit() {
      onClose();
      emit("submit", JSON.parse(JSON.stringify(state.list)));
    }

    const { onDragStart, onDragMove, onDropEnd } = useListDrag({
      list: () => state.list,
      update(newList) {
        state.list = newList;
      }
    });

    watch(
      () => props.show,
      function (show) {
        state.show = show;
        if (!show) return;
        const list: typeof props.columns = JSON.parse(JSON.stringify(props.columns));
        // 这里要将操作栏过滤掉
        state.list = list.filter(item => item.prop !== actionEditKey);
      },
      { immediate: true }
    );

    const fixedOptions = [
      {
        label: "固定左边",
        value: "left"
      },
      {
        label: "默认",
        value: false
      },
      {
        label: "固定右边",
        value: "right"
      }
    ];

    return () => (
      <base-dialog
        v-model={state.show}
        title="表格设置"
        width="840px"
        onClose={onClose}
        v-slots={{
          footer: <FooterBtn onClose={onClose} onSubmit={onSubmit} />
        }}
      >
        <TransitionGroup name="the-group" tag="div">
          {state.list.map((item, itemIndex) => (
            <div
              class="the-curd-option-item f-vertical"
              key={item.prop}
              data-key={item.prop}
              draggable={true}
              onDragstart={() => onDragStart(itemIndex)}
              onDragover={(e: DragEvent) => onDragMove(e, itemIndex)}
              onDrop={onDropEnd}
            >
              <i class="el-icon--left el-icon-rank" />
              <span class="f1">{item.label}</span>
              <el-radio-group
                v-model={item.fixed}
                size="small"
                class="mgr-10"
              >
                {fixedOptions.map(item => (
                  <el-radio-button
                    key={item.value.toString()}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </el-radio-group>
              <el-switch
                v-model={item.visible}
                inline-prompt
                active-text="显示"
                inactive-text="隐藏"
              />
            </div>
          ))}
        </TransitionGroup>
      </base-dialog>
    );
  }
});
