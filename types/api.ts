export type ApiOk<T=unknown> = { ok: true } & T;
export type ApiError = { ok?: false; error: string };
export type Paginated<T> = { items: T[]; total: number; page: number };
