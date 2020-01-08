<template>
    <div class="the-upload-img" v-loading="loading" :style="{'width': width + 'px'}">
        <div v-if="imgUrl" class="img-box" :style="{ 'minHeight': width + 'px' }">
            <img class="image" :src="imgUrl">
            <div @click="removeImg()" class="remove flex fvertical fcenter">
                <i class="el-icon-close" />
            </div>
        </div>
        <div v-else class="upload flex fvertical fcenter" :style="{ 'minHeight': width + 'px' }">
            <div class="add-icon"></div>
            <input class="upload-input" type="file" name="picture" ref="uploadinput" @change="uploadImg()">
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import apiUser from '../api/user';

@Component({})
export default class UploadImg extends Vue {

    /** 上传的图片路径 */
    @Prop({
        type: String,
        default: ''
    })
    private imgUrl!: string;

    /** 图片宽度 */
    @Prop({
        type: Number,
        default: 240
    })
    width!: number;

    /** 加载动画 */
    private loading = false;

    /** 发送数据到父组件中 */
    @Emit('getImgUrl') sendImgSrc(src: string) {}

    /** 上传图片 */
    private uploadImg() {
        const input = (this.$refs.uploadinput as HTMLInputElement);

        const file: File = input.files[0];
        // console.log('上传图片文件 >>', file);
        
        /** 上传类型数组 */
        let typeStr = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];

        // 判断文件类型
        if (typeStr.indexOf(file.type) < 0) {
            this.$message.warning('文件格式只支持：jpg 和 png');
            return;
        }

        // 判断大小
        if (file.size > 2 * 1024 * 1024) {
            this.$message.warning('上传的文件不能大于2M');
            return;
        }

        // const formData = new FormData();

        // formData.append('file', file);

        this.loading = true;
        apiUser.uploadImg(file, (res: any) => {
            this.loading = false;
            /** 图片路径 */
            let src: string = res;
            this.sendImgSrc(src);
        }, (err: any) => {
            this.loading = false;
            this.$message.error('上传图片失败');
            // console.log('上传图片失败 >>', err);
        });
    }

    /** 清除当前图片 */
    private removeImg() {
        this.sendImgSrc('');
    }
}
</script>

<style lang="scss">
.the-upload-img {
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    overflow: hidden;
    &:hover{ border-color: #409eff; }
    .img-box{ 
        position: relative; width: 100%; height: 100%; overflow: hidden;
        .image{ display: block; width: 100%; }
        .remove{ position: absolute; top: 0; right: 0; line-height: normal; border-radius: 100%; cursor: pointer; width: 30px; height: 30px; background-color: rgba(0,0,0,0.5); font-size: 28px; color: #fff; }
    }
    .upload{ 
        width: 100%; position: relative; 
        .upload-input{ width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 2; opacity: 0; cursor: pointer; }
        .add-icon{
            position: relative; width: 30px; height: 30px;
            &::after{ content: ""; position: absolute; top: 0; left: 50%; width: 2px; height: 100%; background-color: #999; transform: translateX(-50%); }
            &::before{ content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background-color: #999; transform: translateY(-50%); }
        }
    }  
    .el-icon-close{ font-size: 20px; line-height: 20px; }
}
</style>