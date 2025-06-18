import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const TipTapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // includes Bold, Italic, Strike, BulletList, OrderedList, ListItem, etc.
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  const toolbarButtons = [
    { action: () => editor.chain().focus().toggleBold().run(), label: "Bold", symbol: "B", style: "bold" },
    { action: () => editor.chain().focus().toggleItalic().run(), label: "Italic", symbol: "I", style: "italic" },
    { action: () => editor.chain().focus().toggleUnderline().run(), label: "Underline", symbol: "U", style: "underline" },
    { action: () => editor.chain().focus().toggleStrike().run(), label: "Strikethrough", symbol: "S̶", style: "strike" },
    { action: () => editor.chain().focus().toggleSuperscript().run(), label: "Superscript", symbol: "X²", style: "superscript" },
    { action: () => editor.chain().focus().toggleSubscript().run(), label: "Subscript", symbol: "X₂", style: "subscript" },
    { action: () => editor.chain().focus().toggleBulletList().run(), label: "Bullet List", symbol: "•", style: "bulletList" },
    { action: () => editor.chain().focus().toggleOrderedList().run(), label: "Ordered List", symbol: "1.", style: "orderedList" },
    { action: () => editor.chain().focus().setTextAlign("left").run(), label: "Align Left", symbol: "⬅️", style: "left" },
    { action: () => editor.chain().focus().setTextAlign("center").run(), label: "Align Center", symbol: "⬜", style: "center" },
    { action: () => editor.chain().focus().setTextAlign("right").run(), label: "Align Right", symbol: "➡️", style: "right" },
    {
      action: () => {
        const url = prompt("Enter URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      label: "Insert Link",
      symbol: "🔗",
      style: "link",
    },
  ];

  return (
    <div className="p-2 rounded-md">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 pb-2 flex-wrap">
        {toolbarButtons.map(({ action, label, symbol, style }, index) => (
          <Tippy key={index} content={label} delay={[100, 0]}>
            <button
              onClick={action}
              className={`p-2 w-10 h-10 rounded 
                ${editor.isActive(style) ? "bg-yellow-400 dark:bg-yellow-500" : "bg-gray-200 dark:bg-gray-950"}`}
            >
              {symbol}
            </button>
          </Tippy>
        ))}
      </div>

      {/* Editor Content */}
      <div onClick={() => editor.chain().focus().run()}>
        <EditorContent
          editor={editor}
          className="block p-2.5 min-h-40 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
            focus:ring-yellow-500 focus:border-yellow-500 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
        />
      </div>
    </div>
  );
};

export default TipTapEditor;
