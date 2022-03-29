/**
 * 2022/03/29 lzz
 * 日志管理器
 */

import { log } from "cc";

export enum LogLevel {
    None,
    Debug,
    Warn,
    Error,
    All
}

export default class Logger {
    /** 日志等级 */
    private _level: number = LogLevel.All;

    /**
     * Debug日志
     * @param message 消息
     * @param args    附带参数
     * @returns 
     */
    public debug(message: string, ...args: any[]) {
        if (this._level < LogLevel.Debug) return;
        log("===========>> debug: " + message, ...args);
    }

    /**
     * Warn日志
     * @param message 消息
     * @param args    附带参数
     * @returns 
     */
    public warn(message: string, ...args: any[]) {
        if (this._level < LogLevel.Warn) return;
        this.warn("===========>> warn: " + message, ...args);
    }

    /**
     * Error日志
     * @param message 消息
     * @param args    附带参数
     * @returns 
     */
    public error(message: string, ...args: any[]) {
        if (this._level < LogLevel.Error) return;
        this.error("===========>> error: " + message, ...args);
    }
}