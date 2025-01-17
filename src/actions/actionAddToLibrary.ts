import { register } from "./register";
import { getSelectedElements } from "../scene";
import { getNonDeletedElements } from "../element";
import { deepCopyElement } from "../element/newElement";
import { randomId } from "../random";
import { t } from "../i18n";
import { NamedActionResult } from "./types";

export const actionAddToLibrary = register({
  name: "addToLibrary",
  trackEvent: { category: "element" },
  perform: (elements, appState, _, app) => {
    const selectedElements = getSelectedElements(
      getNonDeletedElements(elements),
      appState,
      true,
    );
    if (selectedElements.some((element) => element.type === "image")) {
      return {
        commitToHistory: false,
        appState: {
          ...appState,
          errorMessage: "Support for adding images to the library coming soon!",
        },
      };
    }

    return app.library
      .getLatestLibrary()
      .then((items) => {
        return app.library.setLibrary([
          {
            id: randomId(),
            status: "unpublished",
            elements: selectedElements.map(deepCopyElement),
            created: Date.now(),
          },
          ...items,
        ]);
      })
      .then((): NamedActionResult => {
        return {
          commitToHistory: false,
          appState: {
            ...appState,
            toastMessage: t("toast.addedToLibrary"),
          },
        };
      })
      .catch((error): NamedActionResult => {
        return {
          commitToHistory: false,
          appState: {
            ...appState,
            errorMessage: error.message,
          },
        };
      });
  },
  contextItemLabel: "labels.addToLibrary",
});
