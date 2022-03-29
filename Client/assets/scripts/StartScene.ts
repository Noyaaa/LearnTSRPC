
import { _decorator, Component, Node, JsonAsset, director } from 'cc';
import app, { IVersion } from './App';
import Loader from './common/Loader';
import Const from './const/Const';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {
    @property({ type: JsonAsset, tooltip: "版本信息" })
    versionJson: JsonAsset = null;

    @property({ type: [String], tooltip: "配置路径" })
    configPaths: string[] = [];

    public async start() {
        // 初始化全局APP
        app.init(<IVersion>this.versionJson.json);
        // 预加载配置文件
        await this._loadConfigs();
        // 预加载游戏场景
        await this._loadGameScene();
        // 游戏游戏场景
        await this._enterGameScene();

        console.log("=============>> enter gamescene success!");
    }

    /**
     * 预加载配置文件
     * @returns 
     */
    private async _loadConfigs() {
        let jsonLoader: Loader = app.loader.createSub()
        return new Promise<void>((resolve, reject) => {
            jsonLoader.load(this.configPaths, JsonAsset).then((assets: JsonAsset[]) => {
                // TODO 解析配置
                resolve();
                // 保存完配置立即释放
                jsonLoader.release();
                jsonLoader = null;
            }).catch((err) => {
                console.error('==============> config parse failed! ' + err);
                reject();
            })
        })
    }

    /**
     * 预加载游戏场景
     */
    private async _loadGameScene() {
        return new Promise<void>((resolve, reject) => {
            director.preloadScene(Const.GAME_SCENE_NAME, null, (error: Error) => {
                if (error) {
                    console.error('============> load scene failed!');
                    return reject();
                }
                resolve();
            })
        })
    }

    /**
     * 进入游戏场景
     */
    private async _enterGameScene() {
        return new Promise<void>((resolve, reject) => {
            director.loadScene(Const.GAME_SCENE_NAME, (error: Error, asset: any) => {
                if (error) {
                    console.error(error);
                    return reject();
                }
                resolve();
            })
        })
    }
}