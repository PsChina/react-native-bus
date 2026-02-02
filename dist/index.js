"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = exports.EventBus = void 0;
const react_native_1 = require("react-native");
class EventBus {
    constructor() {
        this.bus = new react_native_1.NativeEventEmitter();
        this.subscriptionMap = new Map();
    }
    // 监听事件（对标vue-bus $on）
    on(eventName, callback) {
        // 初始化事件名对应的Map
        if (!this.subscriptionMap.has(eventName)) {
            this.subscriptionMap.set(eventName, new Map());
        }
        const callbackMap = this.subscriptionMap.get(eventName);
        // 避免重复监听同一回调
        if (callbackMap.has(callback)) {
            return callbackMap.get(callback);
        }
        // 添加监听并存储
        const subscription = this.bus.addListener(eventName, callback);
        callbackMap.set(callback, subscription);
        return subscription;
    }
    // 发射事件（对标vue-bus $emit）
    emit(eventName, ...args) {
        this.bus.emit(eventName, ...args);
    }
    // 只监听一次（对标vue-bus $once）
    once(eventName, callback) {
        // 包装后的一次性回调
        const onceCallback = (...args) => {
            // 先移除监听，再执行回调（核心逻辑）
            exports.bus.off(eventName, onceCallback);
            callback(...args);
        };
        // 注册一次性回调（复用on方法）
        return exports.bus.on(eventName, onceCallback);
    }
    // 移除监听（对标vue-bus $off）
    off(eventName, fn) {
        const callbackMap = this.subscriptionMap.get(eventName);
        if (!callbackMap)
            return;
        // 场景1：传入fn，只移除该回调的监听
        if (fn) {
            const subscription = callbackMap.get(fn);
            subscription?.remove();
            callbackMap.delete(fn);
            // 如果该事件名无回调，清理外层Map
            if (callbackMap.size === 0) {
                this.subscriptionMap.delete(eventName);
            }
        }
        // 场景2：不传fn，移除该事件名的所有监听
        else {
            // 遍历移除所有订阅
            callbackMap.forEach((subscription) => subscription.remove());
            callbackMap.clear();
            this.subscriptionMap.delete(eventName);
        }
    }
    // 扩展：清理所有事件的所有监听（vue-bus隐含支持，RN需显式提供）
    clear() {
        this.subscriptionMap.forEach((callbackMap, eventName) => {
            callbackMap.forEach((subscription) => subscription.remove());
            callbackMap.clear();
            // 兜底清理NativeEventEmitter的所有监听
            this.bus.removeAllListeners(eventName);
        });
        this.subscriptionMap.clear();
    }
    // 5. 静态方法：获取全局唯一实例（单例核心）
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
}
exports.EventBus = EventBus;
// 1. 私有静态实例：确保类层面唯一
EventBus.instance = null;
exports.bus = EventBus.getInstance();
exports.default = exports.bus;
