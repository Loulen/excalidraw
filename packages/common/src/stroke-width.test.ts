import {
  nominalToActual,
  actualToNominal,
  clampStrokeWidth,
  getPresetForWidth,
  STROKE_WIDTH_MIN,
  STROKE_WIDTH_MAX,
  STROKE_WIDTH_STEP,
} from "@excalidraw/common";

describe("stroke-width: nominal <-> effective conversion", () => {
  it("is the identity for shapes (round-trip stable)", () => {
    for (const nominal of [0.5, 1, 2, 4, 6, 32]) {
      const actual = nominalToActual("rectangle", nominal);
      expect(actual).toBe(nominal);
      expect(actualToNominal("rectangle", actual)).toBe(nominal);
    }
  });

  it("halves the width for freedraw and round-trips back to the nominal", () => {
    for (const nominal of [0.5, 1, 2, 4, 6, 32]) {
      const actual = nominalToActual("freedraw", nominal);
      expect(actual).toBe(nominal / 2);
      expect(actualToNominal("freedraw", actual)).toBe(nominal);
    }
  });
});

describe("stroke-width: clampStrokeWidth", () => {
  it("clamps below the minimum up to 0.5", () => {
    expect(clampStrokeWidth(0)).toBe(0.5);
    expect(clampStrokeWidth(-3)).toBe(0.5);
    expect(clampStrokeWidth(0.49)).toBe(0.5);
  });

  it("clamps above the maximum down to 32", () => {
    expect(clampStrokeWidth(33)).toBe(32);
    expect(clampStrokeWidth(1000)).toBe(32);
  });

  it("leaves in-range values unchanged", () => {
    expect(clampStrokeWidth(0.5)).toBe(0.5);
    expect(clampStrokeWidth(6)).toBe(6);
    expect(clampStrokeWidth(32)).toBe(32);
  });
});

describe("stroke-width: getPresetForWidth", () => {
  it("maps the nominal preset values to their key", () => {
    expect(getPresetForWidth(1)).toBe("thin");
    expect(getPresetForWidth(2)).toBe("medium");
    expect(getPresetForWidth(4)).toBe("bold");
  });

  it("returns null for a custom width that is not a preset", () => {
    expect(getPresetForWidth(3)).toBeNull();
    expect(getPresetForWidth(1.5)).toBeNull();
    expect(getPresetForWidth(6)).toBeNull();
  });
});

describe("stroke-width: bounds", () => {
  it("exposes the UI hard-clamp bounds and step", () => {
    expect(STROKE_WIDTH_MIN).toBe(0.5);
    expect(STROKE_WIDTH_MAX).toBe(32);
    expect(STROKE_WIDTH_STEP).toBe(0.5);
  });
});
