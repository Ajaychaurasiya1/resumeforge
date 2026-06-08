export function cloneWithNewId<T extends { id: string }>(item: T): T {
  return { ...item, id: crypto.randomUUID() }
}
