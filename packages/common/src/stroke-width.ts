import type { ExcalidrawElement } from "@excalidraw/element/types";

import {
  STROKE_WIDTH,
  STROKE_WIDTH_KEYS,
  FREEDRAW_STROKE_WIDTH,
} from "./constants";

import type { StrokeWidthKey } from "./constants";

// Hard bounds (and step) for a nominal stroke width, enforced by the UI
// slider and number input (see ADR-0001).
export const STROKE_WIDTH_MIN = 0.5;
export const STROKE_WIDTH_MAX = 32;
export const STROKE_WIDTH_STEP = 0.5;

// freedraw is rendered at half the nominal width: FREEDRAW_STROKE_WIDTH is
// exactly half of STROKE_WIDTH for every preset (perfect-freehand interprets
// the width differently from roughjs). Derive the factor from those existing
// constants rather than hardcoding ½, so the two stay in lockstep.
const FREEDRAW_SCALE = FREEDRAW_STROKE_WIDTH.medium / STROKE_WIDTH.medium;

/**
 * Convert a nominal stroke width (the value shown in the UI and stored for
 * shapes) into the effective width actually carried by the element. Identity
 * for shapes, halved for freedraw — presets and custom values follow the same
 * rule.
 */
export const nominalToActual = (
  elementType: ExcalidrawElement["type"],
  nominal: ExcalidrawElement["strokeWidth"],
): ExcalidrawElement["strokeWidth"] =>
  elementType === "freedraw" ? nominal * FREEDRAW_SCALE : nominal;

/**
 * Inverse of {@link nominalToActual}: recover the nominal width from an
 * effective one. The round-trip is stable for shapes (identity) and freedraw
 * (×½ then ×2).
 */
export const actualToNominal = (
  elementType: ExcalidrawElement["type"],
  actual: ExcalidrawElement["strokeWidth"],
): ExcalidrawElement["strokeWidth"] =>
  elementType === "freedraw" ? actual / FREEDRAW_SCALE : actual;

/**
 * Hard-clamp a nominal stroke width to `[STROKE_WIDTH_MIN, STROKE_WIDTH_MAX]`.
 */
export const clampStrokeWidth = (
  nominal: number,
): ExcalidrawElement["strokeWidth"] =>
  Math.min(STROKE_WIDTH_MAX, Math.max(STROKE_WIDTH_MIN, nominal));

/**
 * Reverse-map a nominal width to the preset key it matches exactly (1/2/4 →
 * thin/medium/bold), or `null` for a custom width that falls on no preset.
 */
export const getPresetForWidth = (
  nominal: ExcalidrawElement["strokeWidth"],
): StrokeWidthKey | null =>
  STROKE_WIDTH_KEYS.find((key) => STROKE_WIDTH[key] === nominal) ?? null;
