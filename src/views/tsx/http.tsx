import { defineComponent, onMounted, reactive } from "vue";
import api from "../../api";
import utils from "../../utils";

const SwitchProtocol = defineComponent({
    setup() {
        function openHttp() {
            location.href = location.href.replace("https", "http");
        }
        return () => (
            <div style="margin-bottom: 20px;">
                <el-tag type="danger" style="margin-right: 14px;">请求接口为http，与当前域名https不匹配，可能无法正常请求到数据，需要在http环境下进行</el-tag>
                <el-button type="warning" size="small" onClick={ openHttp }>切换至http</el-button>
            </div>
        )
    }
})

const TsxHttpRequest = defineComponent({
    setup() {
        const state = reactive({
            city: "广州",
            loading: false,
            content: "",
            showTip: false
        })

        async function getData() {
            if (!state.city) return utils.showWarning("请输入城市名");
            state.loading = true;
            const res = await api.getWeather(state.city)
            state.loading = false;
            console.log("获取天气预报数据 >>", res);
            if (res.state === 1) {
                state.content = JSON.stringify(res.data, null, 4);
            }
        }
        
        if (location.origin.includes("https")) {
            state.showTip = true;
        }

        onMounted(() => {
            console.clear();
        })

        return () => (
            <el-card>
                {
                    state.showTip ? <SwitchProtocol /> : null
                }
                <div class="flex fvertical" style="margin-bottom: 16px;">
                    <el-input v-model={ state.city } clearable placeholder="请输入城市名" style="width: 300px; margin-right: 16px;"></el-input>
                    <el-button type="primary" onClick={ getData } loading={ state.loading } >
                        { state.loading ? null : <svg-icon name="international" /> }
                        <span style="padding-left: 8px;">获取天气数据</span>
                    </el-button>
                    {
                        state.content ? <el-button type="success" icon="el-icon-document" v-copy={ state.content }>复制数据</el-button> : null
                    }
                </div>
                <el-input type="textarea" autosize placeholder="数据响应结果" v-model={ state.content }></el-input>
            </el-card>
        )
    }
})

export default TsxHttpRequest;