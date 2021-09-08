export const countFilter = (count: number): number | string => (count < 1000 ? count : `${(count / 1000).toFixed(1)}k`);
