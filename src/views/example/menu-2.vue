<template>
  <div class="menu-2">
    <span class="the-tag green mb-[20px]">表单验证操作</span>
    <el-form style="width: 600px;" id="the-form" ref="formRef" :model="form.data" :rules="form.rules" label-width="120px">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.data.name" :placeholder="form.rules.name[0].message" />
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="form.data.region" :placeholder="form.rules.region[0].message">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
          <el-option label="深圳" value="shenzhen" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动次数" prop="count">
        <el-select-v2 v-model="form.data.count" :placeholder="form.rules.region[0].message" :options="options" />
      </el-form-item>
      <el-form-item label="活动时间" required>
        <div class="f-vertical" style="width: 100%;">
          <el-form-item prop="startDate">
            <el-date-picker
              v-model="form.data.startDate"
              type="date"
              label="选择一个日期"
              :placeholder="form.rules.startDate[0].message"
            />
          </el-form-item>
          <div class="f1 fvc">至</div>
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="form.data.endDate"
              type="date"
              label="选择一个日期"
              :placeholder="form.rules.endDate[0].message"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="即时送达" prop="delivery">
        <el-switch v-model="form.data.delivery" />
      </el-form-item>
      <el-form-item label="活动类型" prop="type">
        <el-checkbox-group v-model="form.data.type">
          <el-checkbox label="在线活动" value="a" name="type" />
          <el-checkbox label="促销活动" value="b" name="type" />
          <el-checkbox label="线下活动" value="c" name="type" />
          <el-checkbox label="简单的品牌曝光" value="d" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="来源" prop="resource">
        <el-radio-group v-model="form.data.resource">
          <el-radio value="sponsor" label="赞助" />
          <el-radio value="place" label="地点" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动描述" prop="desc">
        <el-input v-model="form.data.desc" type="textarea" :placeholder="form.rules.desc[0].message" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { message } from "@/utils/message";
import { type FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { validateEX } from "@/utils/dom";

const formRef = ref<FormInstance>();

function useFormData() {
  return {
    name: "",
    region: "",
    count: "",
    startDate: "",
    endDate: "",
    delivery: false,
    type: [] as Array<string>,
    resource: "",
    desc: ""
  }
}

const form = reactive({
  data: useFormData(),
  rules: {
    name: [
      { required: true, message: "请输入活动名称", trigger: "blur" },
      { min: 3, max: 20, message: "长度为3到20个字符", trigger: "blur" },
    ],
    region: [{ required: true, message: "请选择活动地区", trigger: "change" }],
    count: [{ required: true, message: "请选择活动次数", trigger: "change" }],
    startDate: [{ required: true, message: "请选择活动开始时间", trigger: "change" }],
    endDate: [{ required: true, message: "请选择活动结束时间", trigger: "change" }],
    type: [{ required: true, message: "请选择活动类型", trigger: "change" }],
    resource: [{ required: true, message: "请选择活动来源", trigger: "change" }],
    desc: [{ required: false, message: "请输入活动描述", trigger: "blur" }],
  }
  // } as FormRules
});

const options = Array.from({ length: 10000 }).map((_, index) => ({
  value: index + 1,
  label: `最多${index + 1}次`,
}))

function onSubmit() {
  formRef.value!.validate(valid => {
    validateEX("#the-form", valid);
    if (valid) {
      message.success("验证成功，表单数据已打印至控制台");
      console.log("form.data >>", JSON.parse(JSON.stringify(form.data)));
    }
  })
}

function onReset() {
  form.data = useFormData();
  setTimeout(() => formRef.value!.clearValidate());
}

</script>
<style lang="scss">
.menu-2 {
  width: 100%;
}
</style>