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
      class="table-image"
      style={getImageStyle(props.column)}
      src={props.src}
      onClick={onPreview}
      fit="cover"
    />
  ) : null;
}

interface TableOptionProps {
  /** 是否编辑模式 */
  editMode?: boolean;
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
