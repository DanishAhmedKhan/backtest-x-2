import type { StorageProvider } from './StorageProvider'

export class LocalStorageProvider implements StorageProvider {
    public get<T>(key: string): T | null {
        const value = localStorage.getItem(key)
        if (!value) return null

        try {
            return JSON.parse(value) as T
        } catch {
            return null
        }
    }

    public set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value))
    }

    public remove(key: string): void {
        localStorage.removeItem(key)
    }
}
