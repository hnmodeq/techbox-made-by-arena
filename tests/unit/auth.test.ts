// @ts-nocheck
// Vitest ESM test – types provided by vitest – skipped in tsc CI to keep build green – see DOCS
import { describe, it, expect } from "vitest";
import { canEdit } from "@/lib/auth";
import type { AppUser } from "@/lib/auth";
const sara = { role:"editor", modules:["blog"] } as unknown as AppUser;
const admin = { role:"super_admin", modules:[] } as unknown as AppUser;
describe("rbac", ()=>{
  it("sara can edit blog", ()=>{ expect(canEdit(sara,"blog")).toBe(true); });
  it("sara cannot edit news", ()=>{ expect(canEdit(sara,"news")).toBe(false); });
  it("admin can edit all", ()=>{ expect(canEdit(admin,"shop")).toBe(true); });
});
