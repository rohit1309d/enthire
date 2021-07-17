import { DEFAULT_EXPORT_PADDING } from "../constants";
import { NonDeletedExcalidrawElement } from "../element/types";
import { exportToCanvas } from "../scene/export";
import { AppState } from "../types";
import { canvasToBlob } from "./blob";
import { serializeAsJSON } from "./json";

export { loadFromBlob } from "./blob";
export { loadFromJSON, saveAsJSON } from "./json";

export const exportCanvasServer = async (
  elements: readonly NonDeletedExcalidrawElement[],
  appState: AppState,
  {
    exportBackground,
    exportPadding = DEFAULT_EXPORT_PADDING,
    viewBackgroundColor,
    name,
  }: {
    exportBackground: boolean;
    exportPadding?: number;
    viewBackgroundColor: string;
    name: string;
  },
) => {
  const tempCanvas = exportToCanvas(elements, appState, {
    exportBackground,
    viewBackgroundColor,
    exportPadding,
  });
  tempCanvas.style.display = "none";
  document.body.appendChild(tempCanvas);
  let blob = await canvasToBlob(tempCanvas);
  tempCanvas.remove();

  if (appState.exportEmbedScene) {
    blob = await (
      await import(/* webpackChunkName: "image" */ "./image")
    ).encodePngMetadata({
      blob,
      metadata: serializeAsJSON(elements, appState),
    });
  }

  return blob;
};
