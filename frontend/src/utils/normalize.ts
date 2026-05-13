export function normalizeById<T extends { id: number }>(
  entities: T[]
): Record<number, T> {
  return entities.reduce(
    (acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    },
    {} as Record<number, T>
  );
}

export function extractIds<T extends { id: number }>(entities: T[]): number[] {
  return entities.map((e) => e.id);
}
