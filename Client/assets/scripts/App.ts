import EventCenter from "./common/EventCenter";
import Loader from "./common/Loader";
import WebSocket from "./common/WebSocket";

// 版本信息
export interface IVersion {
    version: string,            // 版本号
    build: string               // 打包次数
}

class App {
    /** 版本信息 */
    public versionInfo: IVersion = null;

    /** 资源管理 */
    public loader: Loader = null;

    /** 事件监听 */
    public eventCenter: EventCenter = null;

    /** 网络链接对象 */
    public webSocket: WebSocket = null;

    // 初始化所有功能
    public init(versionInfo: IVersion) {
        this.versionInfo = versionInfo;
        this.loader = new Loader();
        this.eventCenter = new EventCenter();
        this.webSocket = new WebSocket();
    }
}

let app: App = new App();
window['App'] = app;
export default app;