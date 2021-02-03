import { defineComponent, onMounted, ref } from "vue";
import TsxCard from "./card";

const TsxExample = defineComponent({
    setup() {
        const content = "tsx 卡片组件";
        const list = [
            { img: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" },
            { img: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" },
            { img: "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg" },
            { img: "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg" }
        ]

        const inputStyle = "width: 100%; max-width: 500px; margin: 0 auto 14px; display: block;";

        let inputValue = ref("");

        function onChange(index: number) {
            console.log("图片索引 >>", index);
        }
        
        console.clear();

        onMounted(function() {
            console.log("on mounted");
            
        })

        return () => (
            <div class="tsx-example">
                <el-alert closable={ false } title={ content } style="margin-bottom: 14px;" />
                <el-input vModel={ inputValue.value } style={ inputStyle } placeholder="请输入卡片标题" maxlength="17" show-word-limit clearable />
                <TsxCard images={ list } title={ inputValue.value } change={ onChange } />
            </div>
        )
    }
})

export default TsxExample;