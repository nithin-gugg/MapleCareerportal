"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import "./RichTextEditorStyles.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: string;
}

// ─── Default JD Template ─────────────────────────────────────────────────────

const JD_TEMPLATE = `<h2>Role Overview</h2>
<p>Provide a brief description of the role and its purpose within the organisation.</p>
<h2>Responsibilities</h2>
<ul>
  <li>Lead and coordinate cross-functional teams to deliver impactful outcomes</li>
  <li>Drive strategic initiatives and day-to-day operational decisions</li>
  <li>Collaborate with stakeholders across departments</li>
</ul>
<h2>Requirements</h2>
<ul>
  <li>Bachelor's degree in a relevant field (or equivalent experience)</li>
  <li>3+ years of professional experience in a similar role</li>
  <li>Excellent communication and problem-solving skills</li>
</ul>
<h2>What We Offer</h2>
<ul>
  <li>Competitive salary and benefits package</li>
  <li>Flexible working arrangements</li>
  <li>Continuous learning and growth opportunities</li>
</ul>`;

// ─── Toolbar Button ──────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={[
        "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        isActive
          ? "bg-primary text-white shadow-sm shadow-primary/30"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Toolbar Divider ─────────────────────────────────────────────────────────

function ToolbarDivider() {
  return <div className="w-px h-5 bg-surface-container mx-1 self-center" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write a structured job description with headings, bullet points, and sections…",
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        codeBlock: {},
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      const html = editor.isEmpty ? "" : editor.getHTML();
      onChange(html);
    },
  });

  const insertTemplate = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setContent(JD_TEMPLATE, true).run();
    onChange(JD_TEMPLATE);
  }, [editor, onChange]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={[
        "rounded-3xl border-none overflow-hidden bg-surface-container-low shadow-[0px_12px_32px_rgba(0,0,0,0.04)] transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-primary/20",
        error ? "ring-2 ring-destructive/30" : "",
      ].join(" ")}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      {/* Using background shift instead of border as per No-Line rule */}
      <div className="flex flex-wrap items-center gap-0.5 px-4 py-2.5 bg-surface-container-high/40 backdrop-blur-md">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <span className="underline underline-offset-2">U</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <span className="text-[11px] font-black">H1</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <span className="text-[11px] font-black">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <span className="text-[11px] font-black">H3</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-[17px]">
            format_list_bulleted
          </span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <span className="material-symbols-outlined text-[17px]">
            format_list_numbered
          </span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <span className="material-symbols-outlined text-[17px]">link</span>
        </ToolbarButton>

        {/* Code Block */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <span className="material-symbols-outlined text-[17px]">code</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Template */}
        <button
          type="button"
          onClick={insertTemplate}
          title="Insert JD Template"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">
            auto_awesome
          </span>
          Template
        </button>
      </div>

      {/* ── Editor Content ───────────────────────────────────────────────── */}
      <div className="rte-editor bg-surface-container-lowest">
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer / char count ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface-container-low/50">
        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
          Neural-Optimized Input Mode · Precision Vitality Enabled
        </span>
        {error && (
          <span className="text-[10px] font-black text-destructive flex items-center gap-1 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
