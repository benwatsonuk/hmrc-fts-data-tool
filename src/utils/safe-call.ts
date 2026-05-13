export async function safeCall<T>(
    label: string,
    fn: () => Promise<T>
): Promise<T | null> {
    try {
        return await fn();
    } catch (err) {
        console.error(`⚠️ ${label} failed:`, err);
        return null;
    }
}