import { ActionsManagerInterface } from "../actions/types";
import { NonDeletedExcalidrawElement } from "../element/types";
import { useIsMobile } from "./App";
import { AppState } from "../types";
import { ToolButton } from "./ToolButton";
import "./ExportDialog.scss";
import { exportToFileIcon } from "../components/icons";

export type ExportCB = (
  elements: readonly NonDeletedExcalidrawElement[],
  scale?: number,
) => void;

export const ButtonExportToServer = ({
  elements,
  appState,
  exportToServer,
}: {
  appState: AppState;
  elements: readonly NonDeletedExcalidrawElement[];
  exportPadding?: number;
  actionManager: ActionsManagerInterface;
  exportToServer: ExportCB;
}) => {
  return (
    <>
      <ToolButton
        type="button"
        icon={exportToFileIcon}
        title="Save to Server"
        aria-label="Save to Server"
        showAriaLabel={useIsMobile()}
        data-testid="save-to-server-button"
        onClick={() => exportToServer(elements)}
      />
    </>
  );
};
