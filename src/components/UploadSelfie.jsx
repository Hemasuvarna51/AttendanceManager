import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 16px;
  background: #fff;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #666;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid ${({ $ok }) => ($ok ? "#b7ebc6" : "#eee")};
  background: ${({ $ok }) => ($ok ? "#f0fff4" : "#fafafa")};
  color: ${({ $ok }) => ($ok ? "#11643a" : "#666")};
`;

const DropZone = styled.div`
  border: 1.5px dashed ${({ $drag }) => ($drag ? "#111" : "#ddd")};
  border-radius: 14px;
  padding: 14px;
  background: ${({ $drag }) => ($drag ? "#fafafa" : "#fff")};
  transition: 120ms ease;
  cursor: pointer;

  &:hover {
    border-color: #111;
    background: #fafafa;
  }
`;

const DropTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const DropHint = styled.div`
  font-size: 13px;
  color: #666;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorBox = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid #ffd2d2;
  background: #fff5f5;
  padding: 10px 12px;
  color: #b42318;
  font-size: 13px;
`;

const Preview = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Img = styled.img`
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #e7e7e7;
`;

const FileMeta = styled.div`
  font-size: 13px;
  color: #444;

  .name {
    font-weight: 600;
    margin-bottom: 6px;
  }
  .sub {
    color: #666;
    margin-top: 6px;
  }
`;

const Actions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e7e7e7;
  background: ${({ $primary }) => ($primary ? "#111" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#111")};
  cursor: pointer;
`;

export default function UploadSelfie({ value, onChange }) {
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const previewUrl = useMemo(() => {
    if (!value) return "";
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const maxMB = 5;

  const handleFile = (file) => {
    setError("");

    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image too large. Max ${maxMB}MB.`);
      return;
    }

    onChange(file);
  };

  const openPicker = () => inputRef.current?.click();

  const remove = () => {
    setError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <Wrap>
      <Head>
        <div>
          <h3>Selfie</h3>
          <p>Upload a clear face selfie for identity verification.</p>
        </div>
        <Chip $ok={!!value}>{value ? "✅ Captured" : "⏳ Pending"}</Chip>
      </Head>

      <DropZone
        role="button"
        tabIndex={0}
        $drag={drag}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === "Enter" ? openPicker() : null)}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <DropTitle>Click to upload or drag & drop</DropTitle>
        <DropHint>JPG/PNG/WebP • Max {maxMB}MB • Good lighting recommended</DropHint>

        <HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </DropZone>

      {error && <ErrorBox>{error}</ErrorBox>}

      {value && (
        <>
          <Preview>
            <Img src={previewUrl} alt="Selfie preview" />
            <FileMeta>
              <div className="name">{value.name}</div>
              <div>
                Size: <b>{(value.size / (1024 * 1024)).toFixed(2)}MB</b>
              </div>
              <div className="sub">
                Tip: Use a front-facing, well-lit photo (no masks / heavy blur).
              </div>
            </FileMeta>
          </Preview>

          <Actions>
            <Btn $primary onClick={openPicker}>Replace</Btn>
            <Btn onClick={remove}>Remove</Btn>
          </Actions>
        </>
      )}
    </Wrap>
  );
}
