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
      <el-button type="success" @click="() => list.push(list.length + 1)">添加一个列表 item</el-button>
      <el-button type="primary" @click="openDialog('first')">打开弹出层-1</el-button>
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
      <h2 class="the-title mgr_40">折叠盒子</h2>
    </div>

    <section>
      <div class="mgb_20">
        <el-button type="primary" @click="collapse.showOne = !collapse.showOne">box-one switch</el-button>
        <el-button type="primary" @click="collapse.showTwo = !collapse.showTwo">box-one switch</el-button>
      </div>
      <div class="flex">
        <CollapseHeight :show="collapse.showOne" class="mgr_20">
          <div class="collapse-box">box-one</div>
        </CollapseHeight>
        <CollapseHeight :show="collapse.showTwo">
          <div class="collapse-box">box-two</div>
        </CollapseHeight>
      </div>
    </section>

    <div class="mgb_30">
      <h2 class="the-title mgr_40">自定义全局 Dialog 组件</h2>
    </div>

    <div class="flex">
      <el-button type="primary" @click="openDialog('first')">打开弹出层-1</el-button>
      <div class="f1"></div>
      <el-button type="success" @click="openDialog('second')">打开弹出层-2</el-button>
    </div>

    <base-dialog title="第一个 dialog" v-model="dialogInfo.first.show" @close="clearTimer()">
      <div>
        <p class="mgb_10">出现次数：{{ dialogInfo.first.count }}</p>
        <div v-if="delayShow">延迟出现</div>
      </div>
      <template #footer>
        <el-button type="danger" @click="closeDialog('first')">关闭</el-button>
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
            <el-button type="danger" @click="closeDialog('third')">关闭嵌套 Dialog</el-button>
          </template>
        </base-dialog>
      </div>
      <template #footer>
        <el-button type="danger" @click="closeDialog('second')">关闭</el-button>
        <el-button type="success" @click="openDialog('third')">打开嵌套 Dialog</el-button>
      </template>
    </base-dialog>

    <div class="mgb_30">
      <h2 class="the-title">自定义 Message 控件</h2>
    </div>

    <div class="mgb_50">
      <el-button v-for="item in messageBtns" :key="item.type" :type="item.btnType" @click="openMessage(item)">{{ item.label }}</el-button>
    </div>

    <div class="mgb_30">
      <h2 class="the-title">自定义 MessageBox 控件</h2>
    </div>

    <div class="mgb_50">
      <el-button type="primary" @click="openMessageBox()">打开确认框</el-button>
      <el-button type="primary" @click="openMessageBox(true)">打开确认取消框</el-button>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import Scrollbar from "@/components/Scrollbar/index.vue";
import UploadImage from "@/components/Upload/Image.vue";
import CollapseHeight from "@/components/CollapseHeight/index.vue";
import { Message, message, messageBox } from "@/utils/message";

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

interface MessageBtn {
  label: string
  type: Message.Type
  btnType: "primary"|"success"|"warning"|"danger"
}

const messageBtns: Array<MessageBtn> = [
  { label: "message-info", type: "info", btnType: "primary" },
  { label: "message-success", type: "success", btnType: "success" },
  { label: "message-warning", type: "warning", btnType: "warning" },
  { label: "message-error", type: "error", btnType: "danger" },
];

function openMessage(item: MessageBtn) {
  message.show(`This is a prompt message for ${item.type}`, item.type);
}

function openMessageBox(isConfirm = false) {
  messageBox({
    content: isConfirm ? "确认取消框" : "确认框",
    cancelText: isConfirm ? "取消" : undefined
  });
}

const collapse = reactive({
  showOne: true,
  showTwo: true
});

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
  .base-upload-image + .base-upload-image {
    margin-left: 14px;
  }
  .collapse-box {
    width: 300px;
    height: 21vh;
    background-color: #f8f8f8;
    text-align: center;
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