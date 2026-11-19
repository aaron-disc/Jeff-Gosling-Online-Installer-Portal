import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a valid ISO date string in en-GB format", () => {
    expect(formatDate("2026-11-17")).toBe("17 Nov 2026");
  });

  it("pads single-digit days with a leading zero", () => {
    expect(formatDate("2026-11-07")).toBe("07 Nov 2026");
  });

  it("handles full ISO timestamps with time and UTC offset", () => {
    expect(formatDate("2026-12-24T14:30:00.000Z")).toBe("24 Dec 2026");
  });

  it("returns the original string when given an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDate("")).toBe("");
  });
});
