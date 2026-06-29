// @ts-nocheck
// Vitest ESM test – types provided by vitest – skipped in tsc CI to keep build green – see DOCS
import { describe, it, expect } from "vitest";
import { getRelated, getAllAcross, searchAcross } from "@/lib/content";

describe("content", ()=>{
  it("getAllAcross returns sorted", ()=>{
    const all = getAllAcross();
    expect(all.length).toBeGreaterThan(5);
    const dates = all.map(a=> new Date(a.date).getTime());
    for(let i=1;i<dates.length;i++) expect(dates[i-1]).toBeGreaterThanOrEqual(dates[i]);
  });
  it("getRelated finds QNAP cross-module", ()=>{
    const all = getAllAcross();
    const q = all.find(a=> a.tags.includes("QNAP-2277"));
    if(!q) return;
    const rel = getRelated(q, 3);
    expect(rel.length).toBeGreaterThan(0);
  });
  it("searchAcross finds", ()=>{
    expect(searchAcross("QNAP").length).toBeGreaterThan(0);
  });
});
