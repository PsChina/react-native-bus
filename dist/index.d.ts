import { NativeEventEmitter, type EmitterSubscription } from "react-native";
type EventCallback = (...rest: any[]) => void;
type SubscriptionMap = Map<string, Map<EventCallback, EmitterSubscription>>;
export declare class EventBus {
    bus: NativeEventEmitter;
    subscriptionMap: SubscriptionMap;
    constructor();
    on(eventName: string, callback: EventCallback): EmitterSubscription;
    emit(eventName: string, ...args: any[]): void;
    once(eventName: string, callback: EventCallback): EmitterSubscription;
    off(eventName: string, fn?: EventCallback): void;
    clear(): void;
}
export declare const bus: {
    on: (eventName: string, callback: EventCallback) => EmitterSubscription;
    emit: (eventName: string, ...args: any[]) => void;
    once: (eventName: string, callback: EventCallback) => EmitterSubscription;
    off: (eventName: string, fn?: EventCallback) => void;
    clear: () => void;
};
export default bus;
