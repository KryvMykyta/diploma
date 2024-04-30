import type { LocaleStorageSchema } from "./types";

class LocalStorage {
  static set = <T extends keyof LocaleStorageSchema>(
    key: T,
    value: LocaleStorageSchema[T]
  ): void => {
    localStorage?.setItem(key, JSON.stringify(value));
  };
  static get = <T extends keyof LocaleStorageSchema>(
    key: T
  ): LocaleStorageSchema[T] | undefined => {
    const value = localStorage?.getItem(key);
    if (!value) return undefined;
    return value as LocaleStorageSchema[T];
  };
}
export default LocalStorage;
