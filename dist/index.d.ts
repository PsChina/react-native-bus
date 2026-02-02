import { NativeEventEmitter, type EmitterSubscription } from "react-native";
type EventCallback = (...rest: any[]) => void;
type SubscriptionMap = Map<string, Map<EventCallback, EmitterSubscription>>;
export declare class EventBus {
    private static instance;
    bus: NativeEventEmitter;
    subscriptionMap: SubscriptionMap;
    constructor();
    on(eventName: string, callback: EventCallback): EmitterSubscription;
    emit(eventName: string, ...args: any[]): void;
    once(eventName: string, callback: EventCallback): EmitterSubscription;
    off(eventName: string, fn?: EventCallback): void;
    clear(): void;
    static getInstance(): EventBus;
}
export declare const bus: EventBus;
export default bus;
