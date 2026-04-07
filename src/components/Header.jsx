import { useRef } from "react";

const IconLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <circle cx="12" cy="6" r="2" />

    <path d="M8 12h8" />
    <path d="M12 8v2" />
  </svg>
);

const IconPlay = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconSave = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const IconUpload = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconReset = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.12" />
  </svg>
);

const IconTrash = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export default function Header({
  onPreview,
  onSave,
  onLoad,
  onReset,
  onClear,
  mode,
  onModeChange,
}) {
  const fileInputRef = useRef(null);

  const handleLoadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoad(file);
      e.target.value = ""; // reset so same file can be re-loaded
    }
  };

  return (
    <header className="header">
      {/* Brand */}
      <div className="header-brand">
        <div className="header-logo">
          <IconLogo />
        </div>
        <span className="header-title">
          Flow<span>Craft</span>
        </span>
      </div>

      {/* Mode tabs */}
      <div className="header-center">
        <button
          className={`header-tab ${mode === "build" ? "active" : ""}`}
          onClick={() => onModeChange("build")}
        >
          Builder
        </button>
        <button
          className={`header-tab ${mode === "preview" ? "active" : ""}`}
          onClick={() => {
            onModeChange("preview");
            onPreview();
          }}
        >
          Preview
        </button>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button
          className="btn btn-ghost"
          onClick={onReset}
          title="Reset to default flow"
        >
          <IconReset /> Reset
        </button>
        <button
          className="btn btn-ghost"
          onClick={handleLoadClick}
          title="Load flow from JSON"
        >
          <IconUpload /> Load
        </button>
        <button
          className="btn btn-ghost"
          onClick={onSave}
          title="Save flow as JSON"
        >
          <IconSave /> Save
        </button>
        <button
          className="btn btn-danger"
          onClick={onClear}
          title="Clear canvas"
        >
          <IconTrash /> Clear
        </button>
        <button className="btn btn-primary" onClick={onPreview}>
          <IconPlay /> Run Preview
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </header>
  );
}
