import { openPreview } from "@/components/ImageViewer";
import type { CurdType, EditBtnType, TableOptionType } from "./types";

// ----------------- 一些零散且无状态的单一组件 -----------------

/**
 * 页面编辑按钮
 * @param props
 */
export function EditBtn(props: { onAction?: (type: EditBtnType) => void }) {
  const emit = props.onAction || (() => {});
  return (
    <>
      <el-button link onClick={() => emit("exit")}>
        退出编辑
      </el-button>
      <el-button type="success" plain onClick={() => emit("copy")}>
        <i class="el-icon-document-copy el-icon--left" />
        复制JSON
      </el-button>
      <el-button type="primary" onClick={() => emit("complete")}>
        完成编辑
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

interface LabelTipsProps {
  label: string;
  tips: string;
}

/**
 * 表单`label`文字 + 提示文字组件
 * @param props
 */
export function LabelTips(props: LabelTipsProps) {
  return (
    <>
      {props.label}
      <el-tooltip
        effect="dark"
        content={props.tips}
        raw-content
        placement="top-start"
      >
        <el-button type="info" link style="height: 32px;">
          <i class="el-icon-question"></i>
        </el-button>
      </el-tooltip>
    </>
  );
}

interface TableOptionProps {
  /** 是否编辑模式 */
  editMode?: boolean;
  /** 是否禁用状态 */
  disabled?: boolean;
  /** 配置数据 */
  config: CurdType.Table.Config;
  /**
   * 按钮操作回调
   * @param type
   */
  onAction?: (type: TableOptionType) => void;
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
            <el-button type="danger" link disabled={props.disabled} onClick={() => emit("delete")}>
              <i class="el-icon--left el-icon-delete" />
              删除
            </el-button>
          ) : null}
          {hasAdd ? (
            <el-button type="primary" link disabled={props.disabled} onClick={() => emit("add")}>
              <i class="el-icon--left el-icon-plus" />
              新增
            </el-button>
          ) : null}
          <el-button type="primary" link disabled={props.disabled} onClick={() => emit("export")}>
            <i class="el-icon--left el-icon-download" />
            导出
          </el-button>
          <el-tooltip
            effect="dark"
            content="配置表格展示、排序等操作"
            placement="top-end"
          >
            <el-button type="primary" link disabled={props.disabled} onClick={() => emit("setting")}>
              <i class="el-icon--left el-icon-setting" />
              设置
            </el-button>
          </el-tooltip>
        </>
      )}
    </div>
  );
}

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