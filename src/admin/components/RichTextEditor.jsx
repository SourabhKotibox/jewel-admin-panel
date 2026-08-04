import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const DEFAULT_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "blockquote",
  "link",
];

/**
 * Bagisto-style rich text for blog/FAQ/CMS body — headings + formatting.
 */
export default function RichTextEditor({
  value = "",
  onChange,
  label,
  placeholder = "Write content… Use H2/H3 for section headings.",
  minHeight = 220,
}) {
  const modules = useMemo(() => DEFAULT_MODULES, []);

  return (
    <div className="md:col-span-2 rich-editor-wrap">
      {label ? (
        <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
          {label}
        </label>
      ) : null}
      <div className="bg-ivory border border-champagne/25 focus-within:border-champagne transition-colors">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={(html) => onChange?.(html)}
          modules={modules}
          formats={DEFAULT_FORMATS}
          placeholder={placeholder}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
