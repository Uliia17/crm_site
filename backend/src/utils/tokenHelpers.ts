export function normalizeExpiresIn(
    value: unknown,
    fallback: string | number = "1h",
): string | number {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return value;
    // якщо value — об'єкт з полем 'value' або 'stringValue' (наприклад protobuf), спробуємо витягти
    if (value && typeof value === "object") {
        // можливі поля у випадку protobuf wrappers
        const anyV = value as any;
        if (typeof anyV.value === "string" || typeof anyV.value === "number")
            return anyV.value;
        if (typeof anyV.stringValue === "string") return anyV.stringValue;
    }
    return fallback;
}
