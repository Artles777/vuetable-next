import { type Ref, type ComputedRef, unref } from "vue-demi";

export type MaybeRef<T = any> = T | Ref<T>;
export type MaybeRefOrGetter<T = any> = MaybeRef<T> | (() => T);

export function toValue<T> (source: MaybeRefOrGetter<T> | ComputedRef<T>): T {
  // @ts-ignore
  return typeof source === "function" ? source() : unref(source);
}