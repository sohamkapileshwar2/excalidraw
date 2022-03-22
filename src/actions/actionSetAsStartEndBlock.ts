import {
  isTextElement,
  isExcalidrawElement,
  redrawTextBoundingBox,
} from "../element";
import { t } from "../i18n";
import { register } from "./register";
import { mutateElement, newElementWith } from "../element/mutateElement";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_TEXT_ALIGN,
} from "../constants";
import { getContainerElement } from "../element/textElement";

export const actionSetAsStartBlock = register({
  name: "setAsStartBlock",
  perform: (elements, appState) => {
    const element = elements.find((el) => appState.selectedElementIds[el.id]);
    return {
      appState: {
        ...appState,
        toastMessage: t("toast.assignedStartBlock"),
        startBlock: element,
      },
      commitToHistory: false,
    };
  },
  contextItemLabel: "labels.setAsStartBlock",
});

export const actionSetAsEndBlock = register({
  name: "setAsEndBlock",
  perform: (elements, appState) => {
    const element = elements.find((el) => appState.selectedElementIds[el.id]);
    return {
      appState: {
        ...appState,
        toastMessage: t("toast.assignedEndBlock"),
        endBlock: element,
      },
      commitToHistory: false,
    };
  },
  contextItemLabel: "labels.setAsEndBlock",
});
