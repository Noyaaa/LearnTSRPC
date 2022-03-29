import { WsClient } from "tsrpc-browser";
import { serviceProto } from "../shared/protocols/serviceProto";

export default class WebSocket {
    /** IP地址 */
    private _ip: string = null;

    /** 端口 */
    private _port: number = null;

    /** 是否有证书 */
    private _isSSL: boolean = false;

    /** server链接对象 */
    private _wsClient: any = null;

    /** 是否初始化过 */
    private _isInited: boolean = false;

    /**
     * IP初始化
     * @param ip     IP地址
     * @param port   端口
     * @param isSSL  是否有证书
     */
    public init(ip: string, port: number, isSSL: boolean) {
        this._ip = ip;
        this._port = port;
        this._isSSL = isSSL;
        this._wsClient = new WsClient(serviceProto, {
            server: `${this._isSSL ? 'wss' : 'ws'}://${this._ip}:${this._port}`,
            json: true
        })
        this._isInited = true;
    }

    /** 链接 */
    public async connect(): Promise<{ isSucc: boolean, errMsg: string }> {
        return new Promise((resolve, reject) => {
            this._wsClient.connect().then((res: { isSucc: boolean, errMsg: string }) => {
                if (res.isSucc) {
                    return resolve(res);
                }
                return resolve(res);
            });
        });
    }
}