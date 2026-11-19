import { describe, it, expect } from "vitest";
import { formatFileSize } from "./formatFileSize";

describe("formatFileSize", () => {
  it("returns the value in bytes if there is less than 1024 bytes", () => {
    expect(formatFileSize(1023)).toBe("1023 B");
  });
  it("returns the value in kilobytes if there is more than 1024 bytes and less than 1048576 bytes", () => {
    expect(formatFileSize(620927)).toBe("606.4 KB");
  });
  it("returns the value in megabytes if there is more than 1048576 bytes", () => {
    expect(formatFileSize(12048576)).toBe("11.5 MB");
  });
});
