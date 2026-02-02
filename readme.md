# react-native-bus

一个轻量、高效的 **React Native 全局事件总线**，对标 `vue-bus` 设计，基于 RN 原生 `NativeEventEmitter` 实现，无额外第三方依赖，支持 TypeScript 类型提示，适配 RN 0.60+ 所有版本。

## 特性

✅ 对标 `vue-bus` 核心 API：`on`/`emit`/`once`/`off`/`clear`  
✅ 基于 RN 原生 `NativeEventEmitter`，稳定性拉满  
✅ 纯 TS 开发，自带完整类型声明，友好的 TS 体验  
✅ 轻量无冗余，仅封装核心事件通信逻辑  
✅ 自动防重复监听，支持事件批量清理  
✅ 适配 RN 官方 Hermes/JSC 引擎

## 安装

### 方式1：npm 安装（发布后使用）

```bash
npm install react-native-bus --save
# 或 yarn
yarn add react-native-bus
# 或 pnpm
pnpm add react-native-bus
```

### 方式 2：本地引入（测试 / 自定义修改）

将编译后的 index.js 和 index.d.ts 文件复制到 RN 项目的工具目录（如 src/utils/），直接本地引入即可。

## 快速使用

```jsx
import { EventBus } from "react-native-bus"; // bus class
const bus = new EventBus(); // 实例化
```

### 基础示例（函数组件 / Class 组件通用）

```jsx
import React, { useEffect } from "react";
import { View, Button, Text } from "react-native";
import bus from "react-native-bus"; // npm 安装引入 (全局 bus 单例)
// import bus from './src/utils/react-native-bus'; // 本地引入

const EventBusDemo = () => {
  useEffect(() => {
    // 1. 监听普通事件（持续监听，直到手动移除/组件卸载）
    const subscription = bus.on("permissionChanged", (data) => {
      console.log("收到权限变化事件：", data);
      // 示例：data = { status: 'GRANTED', msg: '权限申请成功' }
    });

    // 2. 监听一次性事件（触发后自动移除，仅执行一次）
    bus.once("onceEvent", (msg) => {
      console.log("一次性事件触发：", msg);
    });

    // 组件卸载时清理监听（关键：避免内存泄漏）
    return () => {
      bus.off("permissionChanged", subscription); // 移除指定事件监听
      // 或 清空当前组件所有监听：bus.clear();
    };
  }, []);

  // 3. 发射事件（任意组件/任意位置均可调用）
  const sendEvent = () => {
    // 发射普通事件，可传任意参数（单个/多个/对象）
    bus.emit("permissionChanged", { status: "GRANTED", msg: "权限申请成功" });
    // 发射一次性事件
    bus.emit("onceEvent", "这是一个一次性事件");
    // 发射多参数事件
    bus.emit("multiParamsEvent", 123, "hello", { key: "value" });
  };

  return (
    <View style={{ padding: 20, gap: 15 }}>
      <Text>React Native Bus 测试</Text>
      <Button title="发送事件" onPress={sendEvent} />
    </View>
  );
};

export default EventBusDemo;
```

## API 文档

### 1. bus.on(eventName, callback)

| 参数      | 类型                       | 说明                   |
| :-------- | :------------------------- | :--------------------- |
| eventName | `string`                   | 事件名称(自定义)       |
| callback  | `(...args: any[]) => void` | 事件回调，接收发射参数 |
| 返回值    | `EmitterSubscription`      | 订阅实例，用于移除监听 |

```ts
const sub = bus.on("test", (a, b) => {
  console.log("test事件触发：", a, b);
});
```

### 2. bus.emit(eventName, ...args)

| 参数      | 类型      | 说明                   |
| :-------- | :-------- | :--------------------- |
| eventName | `string ` | 事件名称（与监听一致） |
| ...args   | `any[]`   | 事件回调，接收发射参数 |

```ts
bus.emit("test", 123, "hello", { key: "value" });
bus.emit("empty_event");
```

### 3. bus.once(eventName, callback)

| 参数 / 返回值 | 类型                       | 说明                   |
| :------------ | :------------------------- | :--------------------- |
| eventName     | `string`                   | 事件名称               |
| callback      | `(...args: any[]) => void` | 事件回调               |
| 返回值        | `EmitterSubscription`      | 订阅实例（可提前移除） |

```ts
bus.once("login", (user) => {
  console.log("登录成功：", user);
});
bus.emit("login", { id: 1 }); // 触发后自动移除
bus.emit("login", { id: 1 }); // 无响应
```

### 4. bus.off(eventName, fn)

移除指定事件的监听。

| 参数      | 类型       | 说明           |
| :-------- | :--------- | :------------- |
| eventName | `string`   | 事件名称       |
| fn        | `Function` | 可选，指定回调 |

```ts
// 移除单个监听
const sub = bus.on("test", callback);
bus.off("test", callback);

// 移除该事件所有监听
bus.off("test");
```

### 5. bus.clear()

清空全局所有事件的所有监听，无参数 / 返回值。

```ts
// 页面销毁/退出登录时清空
bus.clear();
```

## 注意事项

- 组件卸载必清理监听：未清理的监听会导致内存泄漏，函数组件在 useEffect 返回值中清理，Class 组件在 componentWillUnmount 中清理；
- 事件名称规范：建议按业务模块命名（如 user/login、permission/change），避免冲突；
- this 指向：Class 组件回调建议用箭头函数，避免 this 指向丢失；
- 版本兼容：RN 0.60+ 无需额外链接，低版本需手动链接 NativeEventEmitter。

## 开发构建

```bash
# 克隆项目
git clone git@github-personal:PsChina/react-native-bus.git

# 安装依赖
npm install

# 编译构建（生成 dist 目录）
npm run build
```

## 许可证

MIT License © 2026
