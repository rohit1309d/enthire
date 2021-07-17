import { ActionsManagerInterface } from "../actions/types";
import { canvasToBlob, loadFromBlob } from "../data/blob";
import { NonDeletedExcalidrawElement } from "../element/types";
import { useIsMobile } from "./App";
import { exportToCanvas } from "../scene/export";
import { AppState } from "../types";
import { ToolButton } from "./ToolButton";
import "./ExportDialog.scss";
import {
  DEFAULT_EXPORT_PADDING,
  WINDOWS_EMOJI_FALLBACK_FONT,
} from "../constants";
import { exportToFileIcon } from "../components/icons";

var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())

const fs = require("browserify-fs");

function blobToUint8Array(b: any) {
  const uri = URL.createObjectURL(b);
  const xhr = new XMLHttpRequest();
  let i;
  let ui8;

  xhr.open("GET", uri, false);
  xhr.send();

  URL.revokeObjectURL(uri);

  ui8 = new Uint8Array(xhr.response.length);

  for (i = 0; i < xhr.response.length; ++i) {
    ui8[i] = xhr.response.charCodeAt(i);
  }

  return ui8;
}

export type ExportCB = (
  elements: readonly NonDeletedExcalidrawElement[],
  scale?: number,
) => void;

export const ButtonExportToServer = ({
  elements,
  appState,
}: {
  appState: AppState;
  elements: readonly NonDeletedExcalidrawElement[];
  exportPadding?: number;
  actionManager: ActionsManagerInterface;
}) => {
  const exportToServer = async () => {
    // window.confirm("Are you sure? This will clean the canvas");

    const tempCanvas = exportToCanvas(elements, appState, {
      exportBackground: false,
      viewBackgroundColor: appState.viewBackgroundColor,
      exportPadding: DEFAULT_EXPORT_PADDING,
    });

    tempCanvas.style.display = "none";
    document.body.appendChild(tempCanvas);
    const blob = await canvasToBlob(tempCanvas);
    tempCanvas.remove();

    var imageName = "name.png";
    
    var storage = multer.diskStorage({
      destination: function (req : any, file : any, cb : any) {
        cb(null, 'images')
      },
      filename: function (req : any, file : any, cb : any) {
        cb(null, Date.now() + '-' + imageName )
      }
    });

    


    // const url = window.URL.createObjectURL(
    //     new Blob([blob]),
    // );
    
    // console.log(url);
  };
  return (
    <>
      <ToolButton
        type="button"
        icon={exportToFileIcon}
        title="Save to Server"
        aria-label="Save to Server"
        showAriaLabel={useIsMobile()}
        data-testid="save-to-server-button"
        onClick={() => exportToServer()}
      />
    </>
  );
};
