import { defineComponent, computed, PropType, ref } from "vue";
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
        let index = ref(0);

        const listStyle = computed(function() {
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
            <div class="tsx_card">
                {
                    props.title ? (<div class="title">标题：{ props.title }</div>) : null
                }
                <div class="card">
                    <div class="card_box">
                        <div class="card_list flex" style={ listStyle.value }>
                            {
                                props.images.map((item, index) => (
                                    <img class="image f1" src={ item.img } key={ index } />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div class="btn_box">
                    <el-button type="primary" icon="el-icon-arrow-left" onClick={ () => switchImage(false) } disabled= { index.value == 0 }>上一张图片</el-button>
                    <el-button type="primary" onClick={ () => switchImage(true) } disabled= { index.value == (props.images.length - 1) }>下一张图片<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </div>
            </div>
        );
    }
})

export default TsxCard;