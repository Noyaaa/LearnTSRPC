export default class EventCenter {
  public eventMap = {}

  public on(event, listener, thisObj) {
    let list = this.eventMap[event]

    if (list == null) {
      list = []
      this.eventMap[event] = list
    }

    let length = list.length

    for (let i = 0; i < length; i++) {
      let bin = list[i]

      if (!bin) continue

      if (bin.listener == listener && bin.thisObj == thisObj) {
        console.warn(`名为【${event}】的事件重复注册侦听器`)
      }
    }

    if (!listener) {
      console.warn(`注册【${event}】事件的侦听器函数为空`)
    }

    list.push({
      listener: listener, thisObj: thisObj
    })
  }

  public off(event, listener, thisObj) {
    let list = this.eventMap[event]

    if (!list) {
      console.log(`名为【${event}】的事件不存在`)
      return
    }

    let length = list.length

    let count = 0

    for (let i = 0; i < length; i++) {
      let bin = list[i]
      if (!bin) {
        count++
        continue
      }
      if (bin.listener == listener && bin.thisObj == thisObj) {
        // list.splice(i, 1)
        list[i] = null
        break
      }
    }
    if (list.length == count) {
      delete this.eventMap[event]
    }
  }

  public emit(event, ...arg) {
    let list = this.eventMap[event]

    if (list == null) {
      // cc.log(`名为【${event}】的事件没有被注册过`)
    } else {
      let length = list.length

      for (let i = 0; i < length; i++) {
        let eventBin = list[i]
        if (!eventBin) continue
        eventBin.listener.call(eventBin.thisObj, ...arg)
      }

      if (this.eventMap[event]) {
        for (let i = 0; i < this.eventMap[event].length; i++) {
          let eventBin = this.eventMap[event][i]
          if (!eventBin) {
            this.eventMap[event].splice(i, 1)
            i--
          }
        }
      }
    }
  }

  public lateEmit(event, ...arg) {
    setTimeout(() => {
      let list = this.eventMap[event]

      if (list == null) {
        // cc.log(`名为【${event}】的事件没有被注册过`)
      } else {
        let length = list.length

        for (let i = 0; i < length; i++) {
          let eventBin = list[i]
          if (!eventBin) continue
          eventBin.listener.call(eventBin.thisObj, ...arg)
        }

        if (this.eventMap[event]) {
          for (let i = 0; i < this.eventMap[event].length; i++) {
            let eventBin = this.eventMap[event][i]
            if (!eventBin) {
              this.eventMap[event].splice(i, 1)
              i--
            }
          }
        }
      }
    })
  }
}
