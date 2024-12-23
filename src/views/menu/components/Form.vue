<template>
  <Drawer
    :title="props.type === 'edit' ? '编辑菜单' : '添加菜单'"
    v-model:show="state.show"
    size="620px"
    @close="onClose()"
  >
    <el-form
      label-position="left"
      label-width="128px"
      class="menu-form"
      ref="formRef"
      :model="state.formData"
      :rules="formRules"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="state.formData.parentId"
          placeholder="请选择上级菜单"
          :data="options"
          check-strictly
          :render-after-expand="false"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="类型" prop="meta.type">
        <el-radio-group v-model="state.formData.meta.type" @change="onType()">
          <el-radio-button label="菜单" value="menu" />
          <el-radio-button label="权限功能" value="auth" />
        </el-radio-group>
      </el-form-item>
      <template v-if="state.formData.meta.type === 'menu'">
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">基础配置</el-text>
        </el-divider>
        <el-form-item label="菜单名称" prop="meta.title">
          <el-input
            v-model="state.formData.meta.title"
            clearable
            :placeholder="formRules['meta.title'][0].message"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单权限标识" prop="code">
          <el-input
            v-model="state.formData.code"
            clearable
            :placeholder="formRules.code[0].message"
          ></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="state.formData.path"
            clearable
            placeholder="请确保路径唯一性，如不填，则在提交时自动设置"
          ></el-input>
        </el-form-item>
        <el-form-item prop="component">
          <template #label>
            <LabelTips label="视图组件路径" :tips="tips.component" />
          </template>
          <el-input
            v-model="state.formData.component"
            clearable
            placeholder="当为目录时可以不用填"
          ></el-input>
        </el-form-item>
        <el-form-item label="重定向路径" prop="redirect">
          <el-input
            v-model="state.formData.redirect"
            clearable
            placeholder="当为目录且不填时，则默认拿下级第一项作为该值"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="meta.icon">
          <el-input
            class="f1 mgr-10"
            v-model="state.formData.meta.icon"
            clearable
            placeholder="请选择或者输入图标"
          ></el-input>
          <div class="fvc mgr-10" v-if="state.formData.meta.icon">
            <el-icon :size="20" style="color: var(--el-color-primary);">
              <svg-icon :name="state.formData.meta.icon" />
            </el-icon>
          </div>
          <el-button type="primary" plain @click="state.showIcon = true">选择图标</el-button>
        </el-form-item>
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">辅助配置</el-text>
        </el-divider>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number v-model="state.formData.sort" :min="1" />
        </el-form-item>
        <el-form-item label="菜单隐藏" prop="meta.hidden">
          <el-switch
            v-model="state.formData.meta.hidden"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="是否需要路由缓存" prop="meta.keepAlive">
          <el-switch
            v-model="state.formData.meta.keepAlive"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="state.formData.name"
            clearable
            placeholder="请确保名称唯一性，否则路由缓存匹配会异常"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置为外链" prop="meta.link">
          <el-input
            v-model="state.formData.meta.link"
            clearable
            placeholder="设置外链时则覆盖路由路径"
          ></el-input>
        </el-form-item>
        <el-form-item prop="meta.lang">
          <template #label>
            <LabelTips label="多语言设置" :tips="tips.lang" />
          </template>
          <el-input
            v-model="state.formData.meta.lang"
            clearable
            placeholder="请输入语言配置表中的键值"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="功能名称" prop="meta.title" key="auth-title">
          <el-input
            v-model="state.formData.meta.title"
            clearable
            :placeholder="formRules['meta.title'][0].message"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能权限标识" prop="code" key="auth">
          <el-input
            v-model="state.formData.code"
            clearable
            :placeholder="formRules.code[0].message"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能权限标识" prop="meta.status" key="status">
          <el-radio-group v-model="state.formData.meta.status">
            <el-radio-button label="正常" :value="1" />
            <el-radio-button label="停用" :value="2" />
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>
    <IconList v-model:show="state.showIcon" @select="onIcon" />
    <template #footer>
      <el-button @click="onClose()">取 消</el-button>
      <el-button @click="onSubmit()" type="primary">确 认</el-button>
    </template>
  </Drawer>
</template>
<script lang="ts">
/** 菜单编辑表单 */
export default {
  name: "Form"
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, type PropType } from "vue";
import { ElMessage, type FormInstance } from "element-plus"
import { validateEX } from "@/utils/dom";
import type { MenuForm } from "@/types";
import IconList from "./IconList.vue";
import { Drawer } from "@/components/Drawer";
import { LabelTips, getBoldLabel } from "@/components/Curd";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  /** 操作类型 */
  type: {
    type: String as PropType<"add" | "edit">,
  },
  /** 编辑表单数据 */
  form: {
    type: Object as PropType<MenuForm>,
    default: () => ({})
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void
  (event: "submit", form: MenuForm): void
}>();

function useFormData(): MenuForm {
  return {
    code: "",
    redirect: "",
    path: "",
    component: "",
    name: "",
    sort: 1,
    meta: {
      title: "",
      link: "",
      icon: "",
      hidden: false,
      keepAlive: false,
      type: "menu",
      status: 1,
      lang: "",
    }
  }
}

const state = reactive({
  show: false,
  loading: false,
  formData: useFormData(),
  showIcon: false,
});

const formRules = {
  "meta.icon": [
    {
      validator(_: any, value: string, callback: (err?: Error) => void) {
        if (!state.formData.parentId && !value) {
          callback(new Error("首级菜单必需设置图标"));
        } else {
          callback();
        }
      }
    },
  ],
  "meta.title": [
    { required: true, message: "请输入名称", trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入权限标识", trigger: "blur" }
  ],
  name: [
    {
      trigger: "blur",
      validator(_: any, value: string, callback: (err?: Error) => void) {
        if (state.formData.meta.keepAlive && !value) {
          callback(new Error("当设置路由缓存时，必需设置路由名称！"));
        } else {
          callback();
        }
      }
    }
  ]
}

const tips = {
  component: `<p>路径规则为："src/views/${getBoldLabel("${component}")}.vue"</p><p>${getBoldLabel("component")}就是要填写的路径</p>`,
  lang: `
  <p>参考 src/language/zh.ts 中的语言对象结构</p>
  <p>比如 ${getBoldLabel("login.account")}、${getBoldLabel("languageSetting")} 等</p>
  `
}

function onClose() {
  emit("update:show", false);
}

const formRef = ref<FormInstance>();

function onSubmit() {
  console.log("formData >>", JSON.parse(JSON.stringify(state.formData)));
  formRef.value!.validate(val => {
    validateEX(".menu-form", val);
    if (!val) return;
    if (state.formData.meta.type === "auth" && !state.formData.parentId) {
      ElMessage.error("功能权限必需选择上级菜单！");
      return;
    }
    // TODO: 处理对应提交逻辑
    // 当没有上级`id`时，则为根路由，这个时候设置它为 layout
    if (!state.formData.parentId) {
      state.formData.component = "Layout";
    }
    // 没有设置路由路径则要自动添加一个唯一路径
    // 当设置外链时需要
    if (!state.formData.path) {
      state.formData.path = `/auto-set-${Date.now()}`;
    }
    // 提交数据
    emit("submit", JSON.parse(JSON.stringify(state.formData)));
    onClose();
  })
}

const options = new Array(10).fill(0).map((_, index) => {
  const id = index + 1
  return {
    value: id, 
    label: `菜单-${id}`,
    children: new Array(6).fill(0).map((_, subIndex) => {
      const subId = id * 20 + subIndex;
      return {
        value: subId,
        label: `菜单-${subId}`
      }
    })
  }
})

function onIcon(icon: string) {
  state.formData.meta.icon = icon;
}

function onType() {
  state.formData.meta.status = 1;
}

watch(() => props.show, function(val) {
  state.show = val;
  if (val) {
    // 可以做一些重置操作
    state.formData = props.type === "edit" ? JSON.parse(JSON.stringify(props.form)) : useFormData();
    formRef.value && setTimeout(() => formRef.value!.clearValidate());
  }
}, {
  immediate: true
});
</script>
<style lang="scss" scoped>
// .value-box {
//   width: 80%;
// }
</style>