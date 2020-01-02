<template>
    <div class="upload-img">

    </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

@Component({})
export default class UploadImgComponent extends Vue {

    /** 上传的图片路径 */
    @Prop({
        type: String,
        default: ''
    })
    private imgUrl!: string;

    /** 发送数据到父组件中 */
    @Emit('getImgUrl') sendImgSrc(src: string) {}

    /** 上传图片 */
    private uploadImg() {
        // let input: any = this.$refs.uploadinput;
        // let file: File = input.files[0];
        // // console.log('上传图片文件 >>', file);
        
        // /** 上传类型数组 */
        // let typeStr = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];

        // // 判断文件类型
        // if (typeStr.indexOf(file.type) < 0) {
        //     Global.openDialog({
        //         type: 'alert',
        //         content: '文件格式只支持：jpg 和 png'
        //     });
        //     return;
        // }

        // // 判断大小
        // if (file.size > 2 * 1024 * 1024) {
        //     Global.openDialog({
        //         type: 'alert',
        //         content: '上传的文件不能大于2M'
        //     });
        //     return;
        // }

        // /** from表单转换 */
        // let formData = new FormData();
        // formData.append('file', file);

        // Global.openDialog({ type: 'loading', content: '图片上传中' });
        // api.uploadImg(formData, (res: any) => {
        //     Global.hideDialog();
        //     // console.log('上传成功 >>', res);
        //     /** 图片路径 */
        //     let src: string = res.data[0];
        //     this.sendImgSrc(src);
        // }, (err: any) => {
        //     Global.hideDialog();
        //     console.log('上传图片失败 >>', err);
        //     setTimeout(() => {
        //         Global.openDialog({
        //             type: 'alert',
        //             content: '上传图片失败'
        //         });
        //     }, 10);
        // });
    }

    /** 清除当前图片 */
    private removeImg() {
        this.sendImgSrc('');
    }
}
</script>

<style lang="scss">

</style>