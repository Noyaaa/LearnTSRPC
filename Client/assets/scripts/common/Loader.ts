/**
 * 2020/07/02 lzz
 * 资源加载器
 */

 import { Asset, Prefab, resources, sp, Sprite, SpriteFrame } from "cc"

 export default class Loader {
     public parent: Loader = null
     public subLoader: Loader[] = []
     public resCountMap: { [key: string]: number } = {}
     private _resMap: { [key: string]: typeof Asset } = {}
 
     /**
      * 创建一个子加载器
      */
     public createSub() {
         let loader: Loader = new Loader()
         loader.parent = this
         this.subLoader.push(loader)
         return loader
     }
 
     /**
      * 获得最上级加载器
      */
     public getRootLoader() {
         let loader: Loader = this
         while (loader.parent != null) {
             loader = loader.parent
         }
         return loader
     }
 
     /**
      * 加载资源
      * @param urls       资源路径
      * @param type       资源类型
      * @param retryTimes 重试次数
      */
     public load(urls: string[] | string, type: typeof Asset, retryTimes?: number) {
         if (!Array.isArray(urls)) {
             urls = [urls]
         }
         if (typeof retryTimes == 'undefined') {
             retryTimes = 3
         }
         return new Promise<any>((resolve, reject) => {
             urls = urls as string[]
             urls.forEach((value: string, index: number) => {
                 // 缓存资源
                 this._cacheRes(value, type)
             })
             // 开始加载
             resources.load(urls, type, function (error, assets) {
                 if (error) {
                     if (!retryTimes) {
                         console.error(error)
                         reject()
                     } else {
                         return this.load(urls, type, retryTimes - 1)
                     }
                 }
 
                 if (!Array.isArray(assets)) {
                     assets = [assets]
                 }
                 // 缓存预制体中的骨骼动画和精灵帧防止被顺带释放掉
                 for (let asset of assets) {
                     if (asset instanceof Prefab) {
                         // 缓存预制体中的骨骼动画
                         let skeletonComs: sp.Skeleton[] = asset.data.getComponentsInChildren(sp.Skeleton)
                         for (let com of skeletonComs) {
                             let data: sp.SkeletonData = com.skeletonData
                             if (data) {
                                 let info: any = resources.getAssetInfo(data['_uuid'])
                                 info && this._cacheRes(info.path, sp.SkeletonData)
                             }
                         }
                         // 缓存预制体中的精灵
                         let spriteComs: Sprite[] = asset.data.getComponentsInChildren(Sprite)
                         for (let com of spriteComs) {
                             let data: SpriteFrame = com.spriteFrame
                             if (data) {
                                 let info: any = resources.getAssetInfo(data['_uuid'])
                                 info && this._cacheRes(info.path, SpriteFrame)
                             }
                         }
                     }
                 }
                 resolve(assets)
             }.bind(this))
         })
     }
 
     /**
      * 释放资源
      */
     public release() {
         // 先释放所有子加载器的资源
         for (let loader of this.subLoader) {
             loader.release()
         }
         this.subLoader = []
         // 再释放自己
         let rootLoader: Loader = this.getRootLoader()
         let allResCountMap: { [key: string]: number } = rootLoader.getAllResources()
         for (let url in this._resMap) {
             if (allResCountMap[url]) {
                 allResCountMap[url]--
                 if (this.resCountMap[url]) {
                     this.resCountMap[url]--
                     if (!this.resCountMap[url]) {
                         delete this.resCountMap[url]
                     }
                 }
             }
             if (!allResCountMap[url]) {
                 resources.release(url, this._resMap[url])
                 delete this._resMap[url]
             }
         }
         this._resMap = {}
         // 从父加载器里删除自己
         if (this.parent) {
             for (let index = 0, len = this.parent.subLoader.length; index < len; index++) {
                 let loader: Loader = this.parent.subLoader[index]
                 if (loader == this) {
                     this.parent.subLoader.splice(index, 1)
                     break
                 }
             }
         }
     }
 
     public getAllResources(): { [key: string]: number } {
         let targetMap: { [key: string]: number } = {}
         this.mergeResCount(targetMap)
         return targetMap
     }
 
     /**
      * 合并所有资源次数
      * @param countMap 资源对应的次数
      */
     public mergeResCount(targetMap: { [key: string]: number }) {
         for (let res in this.resCountMap) {
             if (!this.resCountMap[res]) continue
             if (!targetMap[res]) {
                 targetMap[res] = 1
             } else {
                 targetMap[res] += 1
             }
         }
         for (let loader of this.subLoader) {
             loader.mergeResCount(targetMap)
         }
     }
 
     /**
      * 缓存资源
      * @param path 资源路径
      * @param type 资源格式
      */
     private _cacheRes(path: string, type: typeof Asset) {
         // 保存资源类型
         this._resMap[path] = type
         // 保存资源加载次数
         if (!this.resCountMap[path]) {
             this.resCountMap[path] = 1
         } else {
             this.resCountMap[path]++
         }
     }
 }