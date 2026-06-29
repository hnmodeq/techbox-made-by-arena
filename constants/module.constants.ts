export const MODULES = ["blog","news","media","review","tools","download","shop","forum"] as const;
export type ModuleSlug = typeof MODULES[number];
