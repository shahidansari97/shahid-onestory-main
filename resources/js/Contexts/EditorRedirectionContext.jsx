import { createContext, useContext } from "react";
import useEditorRedirection from "@/Hooks/useEditorRedirection";

const EditorRedirectionContext = createContext(null);

export const EditorRedirectionProvider = ({ userId, children }) => {
  const editorRedirection = useEditorRedirection({ userId });
  return (
    <EditorRedirectionContext.Provider value={editorRedirection}>
      {children}
    </EditorRedirectionContext.Provider>
  );
};

export const useEditorRedirectionContext = () => {
  const ctx = useContext(EditorRedirectionContext);
  if (!ctx) {
    throw new Error("useEditorRedirectionContext must be used within EditorRedirectionProvider");
  }
  return ctx;
};
