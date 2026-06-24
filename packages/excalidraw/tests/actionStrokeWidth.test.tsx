import { FREEDRAW_STROKE_WIDTH, STROKE_WIDTH } from "@excalidraw/common";

import { actionChangeStrokeWidth } from "../actions/actionProperties";
import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { Pointer, UI } from "./helpers/ui";
import { act, fireEvent, render, screen } from "./test-utils";

const { h } = window;

const mouse = new Pointer("mouse");

describe("actionChangeStrokeWidth", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  const setStrokeWidth = (value: number) => {
    act(() => {
      h.app.actionManager.executeAction(actionChangeStrokeWidth, "api", value);
    });
  };

  it("applies a custom nominal width to a selected shape and to the next stroke", () => {
    const rect = API.createElement({
      type: "rectangle",
      strokeWidth: STROKE_WIDTH.medium,
    });
    API.setElements([rect]);
    API.setSelectedElements([rect]);

    setStrokeWidth(6);

    expect(API.getElement(rect).strokeWidth).toBe(6);
    expect(h.state.currentItemStrokeWidth).toBe(6);
  });

  it("applies half the nominal width to a selected freedraw", () => {
    const draw = API.createElement({
      type: "freedraw",
      strokeWidth: FREEDRAW_STROKE_WIDTH.medium,
    });
    API.setElements([draw]);
    API.setSelectedElements([draw]);

    setStrokeWidth(6);

    expect(API.getElement(draw).strokeWidth).toBe(3);
    expect(h.state.currentItemStrokeWidth).toBe(6);
  });

  it("treats a preset value as plain sugar over the same path", () => {
    const draw = API.createElement({
      type: "freedraw",
      strokeWidth: FREEDRAW_STROKE_WIDTH.medium,
    });
    API.setElements([draw]);
    API.setSelectedElements([draw]);

    setStrokeWidth(STROKE_WIDTH.bold);

    expect(API.getElement(draw).strokeWidth).toBe(FREEDRAW_STROKE_WIDTH.bold);
    expect(h.state.currentItemStrokeWidth).toBe(STROKE_WIDTH.bold);
  });

  it("updates only the next stroke when nothing is selected", () => {
    const rect = API.createElement({
      type: "rectangle",
      strokeWidth: STROKE_WIDTH.medium,
    });
    API.setElements([rect]);
    API.clearSelection();

    setStrokeWidth(6);

    expect(h.state.currentItemStrokeWidth).toBe(6);
    // an unselected element is left untouched
    expect(API.getElement(rect).strokeWidth).toBe(STROKE_WIDTH.medium);
  });

  it("hard-clamps out-of-range values to [0.5, 32]", () => {
    const rect = API.createElement({
      type: "rectangle",
      strokeWidth: STROKE_WIDTH.medium,
    });
    API.setElements([rect]);
    API.setSelectedElements([rect]);

    setStrokeWidth(100);
    expect(API.getElement(rect).strokeWidth).toBe(32);
    expect(h.state.currentItemStrokeWidth).toBe(32);

    setStrokeWidth(0.1);
    expect(API.getElement(rect).strokeWidth).toBe(0.5);
    expect(h.state.currentItemStrokeWidth).toBe(0.5);
  });
});

describe("stroke width panel — custom numeric field", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  afterEach(async () => {
    // https://github.com/floating-ui/floating-ui/issues/1908#issuecomment-1301553793
    await act(async () => {});
  });

  it("applies a typed value to the selection (shape unchanged, freedraw halved)", () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(60, 60);

    fireEvent.change(screen.getByTestId("strokeWidth-custom"), {
      target: { value: "6" },
    });

    expect(API.getSelectedElement().strokeWidth).toBe(6);
    expect(h.state.currentItemStrokeWidth).toBe(6);
  });

  it("hard-clamps a typed value above the max", () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(60, 60);

    fireEvent.change(screen.getByTestId("strokeWidth-custom"), {
      target: { value: "100" },
    });

    expect(API.getSelectedElement().strokeWidth).toBe(32);
  });

  it("carries the typed value to the next drawn element", () => {
    // with a drawing tool active and no selection, the panel sets the next stroke
    UI.clickTool("rectangle");

    fireEvent.change(screen.getByTestId("strokeWidth-custom"), {
      target: { value: "6" },
    });
    expect(h.state.currentItemStrokeWidth).toBe(6);

    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(60, 60);

    expect(API.getSelectedElement().strokeWidth).toBe(6);
  });
});
