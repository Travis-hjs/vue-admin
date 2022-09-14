<template>
  <div class="the-components">
    <div class="mgb_30">
      <h2 class="the-title">上传图片组件</h2>
    </div>
    <div class="flex mgb_40">
      <UploadImage uploadId="logo" :src="formData.logo" tip="正方形图片" @change="onUpload" />
      <UploadImage uploadId="banner" :src="formData.banner" tip="高度自适应" :autoHeight="true" @change="onUpload" />
    </div>
    <div class="mgb_30">
      <h2 class="the-title mgr_40">滚动条组件</h2>
      <button class="the-btn green" v-ripple @click="() => list.push(list.length + 1)">添加一个列表 item</button>
      <button class="the-btn yellow" v-ripple @click="openDialog('first')">打开弹出层-1</button>
    </div>
    <div class="mgb_20"><span class="the-tag green">横向滚动</span></div>
    <div class="list-x mgb_40">
      <Scrollbar thumbColor="#42b983">
        <div class="item item-text" v-for="(item) in list" :key="item">item-{{ item }}</div>
      </Scrollbar>
    </div>
    <div class="mgb_20"><span class="the-tag blue">垂直滚动</span></div>
    <div class="list-y mgb_40">
      <Scrollbar thumbColor="#42b983">
        <div class="item item-text" v-for="(item) in list" :key="item">item-{{ item }}</div>
      </Scrollbar>
    </div>
    <div class="mgb_10"><span class="the-tag cyan">宽高超出滚动</span></div>
    <div style="width: 300px; height: 140px;" class="mgb_30">
      <Scrollbar>
        <div style="width: 500px; height: 300px; background-color: yellow; color: #555; line-height: 28px">
          <p>内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容</p>
        </div>
      </Scrollbar>
    </div>

    <div class="mgb_30">
      <h2 class="the-title mgr_40">自定义全局 Dialog 组件</h2>
    </div>

    <div class="flex">
      <button class="the-btn blue" v-ripple @click="openDialog('first')">打开弹出层-1</button>
      <div class="f1"></div>
      <button class="the-btn green" v-ripple @click="openDialog('second')">打开弹出层-2</button>
    </div>

    <base-dialog title="第一个 dialog" v-model="dialogInfo.first.show" @close="clearTimer()">
      <div>
        <p class="mgb_10">出现次数：{{ dialogInfo.first.count }}</p>
        <div v-if="delayShow">延迟出现</div>
      </div>
      <template #footer>
        <button class="the-btn red" v-ripple @click="closeDialog('first')">关闭</button>
      </template>
    </base-dialog>

    <base-dialog title="第二个 dialog" v-model="dialogInfo.second.show" :closeByMask="false">
      <div>
        <p><span class="the-tag orange">当前不可点击遮罩层关闭</span></p>
        <p class="mgb_10">出现次数：{{ dialogInfo.second.count }}</p>
        <div v-if="delayShow">延迟出现</div>

        <base-dialog title="第三个 dialog" v-model="dialogInfo.third.show" :appendToBody="true">
          <div>
            <p class="mgb_10">出现次数：{{ dialogInfo.third.count }}</p>
            <ul class="dialog-list">
              <li class="dialog-item fvertical" v-for="(item) in list" :key="item">{{ item }}</li>
            </ul>
          </div>
          <template #footer>
            <button class="the-btn red" v-ripple @click="closeDialog('third')">关闭嵌套 Dialog</button>
          </template>
        </base-dialog>
      </div>
      <template #footer>
        <button class="the-btn red" v-ripple @click="closeDialog('second')">关闭</button>
        <button class="the-btn blue" v-ripple @click="openDialog('third')">打开嵌套 Dialog</button>
      </template>
    </base-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import Scrollbar from "@/components/Scrollbar/index.vue";
import UploadImage, { UploadChange } from "@/components/Upload/Image.vue";

const formData = reactive({
  banner: "",
  logo: ""
})

const list = ref(new Array(10).fill(0).map((_, index) => index + 1));

/**
 * 监听上传图片
 * @param info 回调数据
 */
function onUpload(info: UploadChange<"banner" | "logo">) {
  // info.id 就是组件绑定的 uploadId，多个上传组件的时候用来区分用，可传可不传
  formData[info.id] = info.src;
}

const dialogInfo = reactive({
  first: {
    show: false,
    count: 0,
  },
  second: {
    show: false,
    count: 0
  },
  third: {
    show: false,
    count: 0
  }
})

const delayShow = ref(false);

let delayTimer: NodeJS.Timeout;

function openDialog(type: "first" | "second" | "third") {
  dialogInfo[type].count++;
  dialogInfo[type].show = true;
  delayTimer = setTimeout(() => {
    delayShow.value = true;
  }, 2000);
}

function closeDialog(type: "first" | "second" | "third") {
  dialogInfo[type].show = false;
  clearTimer();
}

function clearTimer() {
  delayShow.value = false;
  clearTimeout(delayTimer);
}
</script>
<style lang="scss">
.the-components {
  width: 100%;
  .item-text {
    color: #fff;
    line-height: 88px;
    text-align: center;
  }
  .list-x {
    width: 30vw;
    max-width: 500px;
    height: 88px;
    white-space: nowrap;
    .item {
      display: inline-block;
      width: 120px;
      height: 100%;
      background-color: tomato;
    }
    .item + .item {
      margin-left: 14px;
    }
  }
  .list-y {
    width: 120px;
    height: 400px;
    .item {
      width: 100%;
      height: 88px;
      margin-bottom: 14px;
      background-color: tomato;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .the-upload-image + .the-upload-image {
    margin-left: 14px;
  }
}
// 第三个弹出层插入至body处，所以样式要单独拎出来写在外部
.dialog-list {
  width: 100%;
  .dialog-item {
    height: 100px;
    width: 100%;
    background-color: #eee;
    font-size: 18px;
    padding: 0 14px;
  }
  .dialog-item:nth-child(even) {
    background-color: #fff;
  }
}
</style>