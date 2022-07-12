<template>
  <div class="menu-4">
    <span class="the-tag cyan">menu-4</span>
    <!-- <code>{{ data }}</code>
        <button class="the-btn blue" @click="addYear()">修改月份</button>
        <button class="the-btn red" @click="resetData()">重置数据</button> -->
  </div>
</template>
<script lang="ts">
import { modifyData } from "@/utils";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup(props, context) {
    const info = {
      year: 2022,
      month: 5,
      day: 5,
    };

    const data = reactive({ ...info });

    function addYear() {
      data.year++;
      console.log("addYear >>", data);
    }

    function resetData() {
      // data = reactive({...info});
      modifyData(data, info);
      // data = info;
      console.log("resetData >>", data);
    }

    return {
      data,
      addYear,
      resetData,
    };
  },
});
</script>
<style lang="scss">
.menu-4 {
  width: 100%;
}
</style>