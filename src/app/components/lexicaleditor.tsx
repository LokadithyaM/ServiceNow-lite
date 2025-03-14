"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import { Bold, Italic, Underline, Send } from "lucide-react";

// Editor theme
const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

interface LexicalEditorProps {
    onPost: (message: string) => void;
}

// Handle text change
function onChange(editorState: any) {
  editorState.read(() => {
    console.log("Document:", editorState.toJSON());
  });
}

// Custom Placeholder
function Placeholder() {
  return <div className=" text-gray-400 pointer-events-none">Type here...</div>;
}

// Embedded Toolbar Component
function Toolbar({ onPost }: { onPost: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [format, setFormat] = useState({ bold: false, italic: false, underline: false });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setFormat({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          });
        }
      });
    });
  }, [editor]);

  return (
    <div className="flex justify-between items-center border-b p-2 bg-gray-200">
      {/* Post Button */}
      <button className="p-2 bg-blue-500 text-white rounded-md" onClick={onPost}>
        <Send size={18} />
      </button>

      <div className="flex gap-2">
        <button
          className={`p-2 ${format.bold ? "bg-green-300" : "bg-gray-100"}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          <Bold size={18} />
        </button>
        <button
          className={`p-2 ${format.italic ? "bg-green-300" : "bg-gray-100"}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          <Italic size={18} />
        </button>
        <button
          className={`p-2 ${format.underline ? "bg-green-300" : "bg-gray-100"}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        >
          <Underline size={18} />
        </button>
      </div>
    </div>
  );
}
function onPostAction(message: string) {
    throw new Error("Function not implemented.");
}

// Main Editor Component
interface LexicalEditorProps {
    onPostAction: (message: string) => void;
  }
  
  export default function LexicalEditor({ onPostAction }: LexicalEditorProps) {
    const initialConfig = {
      namespace: "LexicalEditor",
      theme,
      onError(error: any) {
        console.error(error);
      },
      nodes: [],
    };
  
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <EditorContainer onPostAction={onPostAction} />
      </LexicalComposer>
    );
  }
  
  

// Separate component to handle post functionality
function EditorContainer({ onPostAction }: { onPostAction: (message: string) => void }) {
    const [editor] = useLexicalComposerContext();
  
    const handlePost = () => {
      let message = "";
      editor.getEditorState().read(() => {
        message = $getRoot().getTextContent(); // Extract plain text
      });
  
      if (message.trim()) {
        onPostAction(message); // Send message to Chat component
      }
    };
  
    return (
      <div className="border rounded-md p-3 w-full max-w-lg">
        <Toolbar onPost={handlePost} />
        <div className="relative border p-2 mt-2">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[100px] outline-none p-2" />}
            placeholder={<Placeholder />}
            ErrorBoundary={() => <div>Error!</div>}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    );
  }
  