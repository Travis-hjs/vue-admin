import { defineComponent, onMounted, onUnmounted, ref, watch, Transition, Teleport } from "vue";
import "./dialog.scss";

/** 全局定位层级，每使用一个组件累加一次 */
let zIndex = 1000;

/**
 * # 基础弹出框组件
 * **当前`jsx`组件有个两个问题：**
 * 1. `<Transition>`组件在隐藏节点时，没有过渡动画
 * 2. 当`<base-dialog>`组件有嵌套的情况，且外层有`v-if`判断的时候，内层会出现闪烁的问题。具体看示例组件打开第二个dialog里面的嵌套组件时可以出现
 * 
 * *以上问题具体原因还不清楚，所以暂时没有使用该组件；sfc单文件组件没有这类问题*
 */
export default defineComponent({
  name: "base-dialog",
  props: {
    title: {
      type: String,
      default: "提示"
    },
    /** 双向绑定显示隐藏值 */
    modelValue: {
      type: Boolean,
      default: false
    },
    /** 弹出层内容区域宽度 */
    width: {
      type: String,
      default: "50%"
    },
    /** 是否可以通过点击遮罩层关闭`Dialog` */
    closeByMask: {
      type: Boolean,
      default: true
    },
    /** `Dialog`自身是否插入至`body`元素上。嵌套的`Dialog`必须指定该属性并赋值为`true` */
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    /** 当前使用的层级 */
    const _zIndex = zIndex;
    // 累加
    zIndex++;
    /** 当前组件节点 */
    const dialog = ref<HTMLElement>();
    /** 关闭按钮节点 */
    const closeBtn = ref<HTMLElement>();
    /** 弹出框内容节点 */
    const contentBox = ref<HTMLElement>();
    /**
     * 是否显示弹框中间内容
     * - 因为需要动态设置偏移位置，所以设置完位置之后单独控制该节点切换动画
     */
    const contentShow = ref(false);

    watch(() => props.modelValue, function (val) {
      if (val) {
        // TODO: 等设置完偏移变量值之后，再开始缩放动画
        // 这里不能用 nextTick 代替
        setTimeout(() => {
          contentShow.value = true;
        }, 0);
      } else {
        contentShow.value = false;
      }
    })

    /**  
     * 设置内容区域位置
     * @param e 鼠标事件
     */
    function setContentPosition(e: MouseEvent) {
      // 只有在外部点击，且关闭的情况下才会记录坐标
      if (!props.modelValue || contentShow.value || dialog.value!.contains(e.target as HTMLElement)) return;
      const { clientWidth, clientHeight } = dialog.value!;
      const centerX = clientWidth / 2;
      const centerY = clientHeight / 2;
      const pageY = e.clientY - centerY;
      const pageX = e.clientX - centerX;
      const x = `${pageX / clientWidth * 100}vw`;
      const y = `${pageY / clientHeight * 100}vh`;
      setVariable(x, y);
    }
    
    /**
     * 设置内容节点偏移位置变量
     * @param x
     * @param y
     */
    function setVariable(x: string, y: string) {
      const el = contentBox.value;
      if (el) {
        el.style.setProperty("--contentX", x);
        el.style.setProperty("--contentY", y);
      }
    }

    function onClose(e: MouseEvent) {
      // console.log("onClose >>", e.target);
      if ((e && e.target === dialog.value && props.closeByMask) || (e && e.target === closeBtn.value)) {
        context.emit("update:modelValue", false);
        context.emit("close");
      }
    }

    onMounted(function () {
      // 该操作只能用在 vue 2.x 里面，3.x 会报错
      // if (props.appendToBody) {
      //     // 节点初始化之后移动至<body>处
      //     dialog.value!.remove();
      //     document.body.appendChild(dialog.value!);
      // }
      document.addEventListener("click", setContentPosition);
    });

    onUnmounted(function () {
      document.removeEventListener("click", setContentPosition);
      // props.appendToBody && dialog.value!.remove(); // 插入至body处的节点要单独移除
    });

    return function () {
      const Dialog = () => (
        <Transition name="fade" appear={ true }>
          <div
            ref={ dialog }
            class="base-dialog fvc"
            style={{ zIndex: _zIndex }}
            v-show={ props.modelValue }
            onClick={ e => onClose(e) }
          >
            <Transition name="dialog-move" appear={ true }>
              <div
                ref={ contentBox }
                class="base-dialog-content flex"
                style={{ 'width': props.width }}
                v-show={ contentShow.value }
              >
                <div class="base-dialog-title fbetween fvertical">
                  <h2>{ props.title }</h2>
                  <i ref={ closeBtn } onClick={ e => onClose(e) }></i>
                </div>
                <div class="base-dialog-body">{context.slots.default?.()}</div>
                { context.slots.footer ? (<div class="base-dialog-footer">{context.slots.footer()}</div>) : undefined }
              </div>
            </Transition>
          </div>
        </Transition>
      );
      return props.appendToBody ? (<Teleport to="body"><Dialog /></Teleport>) : <Dialog />;
    }
  }
})