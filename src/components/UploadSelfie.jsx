import { useEffect, useMemo, useState } from "react";

export default function UploadSelfie({ value, onChange }) {
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!value) return "";
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file) => {
    setError("");

    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image too large. Max ${maxMB}MB.`);
      return;
    }

    onChange(file);
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Selfie</h3>

      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <div style={{ marginTop: 8, background: "#ffe5e5", padding: 8, borderRadius: 8 }}>
          {error}
        </div>
      )}

      {value && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{value.name}</div>
          <img
            src={previewUrl}
            alt="Selfie preview"
            style={{
              marginTop: 8,
              width: "100%",
              maxWidth: 320,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}
    </div>
  );
}
