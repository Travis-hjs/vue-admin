import { Component, Vue, Watch } from "vue-property-decorator";
import store from "../../modules/store";

const WIDTH = 992 // refer to Bootstrap's responsive design

@Component({
    name: 'ResizeMixin'
})
export default class extends Vue {
    get device() {
        return store.layoutState.device;
        // console.log('AppModule.device', AppModule.device);
        // return AppModule.device;
    }

    get sidebar() {
        return store.layoutState;
        // console.log('AppModule.sidebar', AppModule.sidebar);
        // return AppModule.sidebar;
    }

    @Watch('$route')
    private onRouteChange() {
        if (this.device === 'mobile' && this.sidebar.sidebarOpen) {
            store.layoutState.sidebarWithoutAnimation = false;
            // AppModule.CloseSideBar(false)
        }
    }

    beforeMount() {
        window.addEventListener('resize', this.resizeHandler);
    }

    mounted() {
        const isMobile = this.isMobile();
        if (isMobile) {
            store.layoutState.device = 'mobile';
            store.layoutState.sidebarWithoutAnimation = true;

            // AppModule.ToggleDevice(DeviceType.Mobile)
            // AppModule.CloseSideBar(true)
        }
    }

    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    private isMobile() {
        const rect = document.body.getBoundingClientRect();
        return rect.width - 1 < WIDTH;
    }

    private resizeHandler() {
        if (!document.hidden) {
            const isMobile = this.isMobile();
            store.layoutState.device = isMobile ? 'mobile' : 'desktop';
            // AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
            if (isMobile) {
                store.layoutState.sidebarWithoutAnimation = true;
                // AppModule.CloseSideBar(true)
            }
        }
    }
}
