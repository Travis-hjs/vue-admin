import { defineComponent, computed, PropType, ref, Transition } from "vue";
import "./card.scss";

/** `tsx`卡片组件 */
const TsxCard = defineComponent({
  props: {
    images: {
      type: Array as PropType<Array<{ img: string }>>,
      required: true
    },
    title: String,
    change: Function as PropType<(res: number) => void>
  },
  setup(props, context) {
    // console.log(props.images);
    const index = ref(0);

    const listStyle = computed(function () {
      const length = props.images.length;
      return {
        width: length * 100 + "%",
        transform: `translate3d(-${index.value * (100 / length)}%, 0px, 0px)`
      }
    })

    /**
     * 切换图片
     * @param isNext 是否下一张
     */
    function switchImage(isNext: boolean) {
      if (isNext) {
        if (index.value < props.images.length - 1) {
          index.value++;
        }
      } else {
        if (index.value > 0) {
          index.value--;
        }
      }
      // context.emit("change", index.value);
      props.change && props.change(index.value);
    }

    return () => (
      <div class="tsx-card">
        <Transition name="fade" appear>
        {
          <div class="tsx-center" v-show={props.title}><span class="the-tag">输入框内容：{props.title}</span></div>
        }
        </Transition>
        
        <div class="card">
          <div class="card-box">
            <div class="card-list flex" style={listStyle.value}>
              {
                props.images.map((item, index) => (
                  <img class="image f1" src={item.img} key={index} />
                ))
              }
            </div>
          </div>
        </div>
        <div class="btn-box">
          <button class="the-btn blue" v-ripple onClick={() => switchImage(false)} disabled={index.value == 0}>上一张图片</button>
          <button class="the-btn blue" v-ripple onClick={() => switchImage(true)} disabled={index.value == (props.images.length - 1)}>下一张图片</button>
        </div>
      </div>
    );
  }
})

export default TsxCard;