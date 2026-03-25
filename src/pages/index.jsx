"use client";
import { useState, useRef, useCallback } from "react";

const TIERS = [
  { id: "10", label: "10/10", labelColor: "#fff", bg: "#AA000A" },
  { id: "9", label: "9.5/10", labelColor: "#fff", bg: "#E8000D" },
  { id: "8", label: "9/10", labelColor: "#fff", bg: "#FF4800" },
  { id: "7", label: "8/10", labelColor: "#fff", bg: "#FF8C00" },
  { id: "6", label: "5-7/10", labelColor: "#111", bg: "#FFD000" },
  { id: "5", label: "3-5/10", labelColor: "#111", bg: "#4C6EF5" },
  { id: "4", label: "< 3/10", labelColor: "#fff", bg: "#9C27B0" },
  { id: "poop", label: "💩/10", labelColor: "#fff", bg: "#6D4C41" },
];

export default function TierList() {
  const [dark, setDark] = useState(true);
  const [images, setImages] = useState([]);
  const [tierImages, setTierImages] = useState(
    Object.fromEntries(TIERS.map((t) => [t.id, []]))
  );
  const [dragging, setDragging] = useState(null); // { id, src, from: 'sidebar'|tierId }
  const [dragOver, setDragOver] = useState(null);
  const fileRef = useRef();
  const idCounter = useRef(0);

  const handleFiles = (files) => {
    const newImgs = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      newImgs.push({ id: `img-${++idCounter.current}`, src: url, name: file.name });
    });
    setImages((prev) => [...prev, ...newImgs]);
  };

  const onDragStartSidebar = (img) => {
    setDragging({ ...img, from: "sidebar" });
  };

  const onDragStartTier = (img, tierId) => {
    setDragging({ ...img, from: tierId });
  };

  const onDropTier = (tierId) => {
    if (!dragging) return;
    const img = { id: dragging.id, src: dragging.src, name: dragging.name };

    // Remove from source
    if (dragging.from === "sidebar") {
      setImages((prev) => prev.filter((i) => i.id !== dragging.id));
    } else if (dragging.from !== tierId) {
      setTierImages((prev) => ({
        ...prev,
        [dragging.from]: prev[dragging.from].filter((i) => i.id !== dragging.id),
      }));
    } else {
      setDragging(null);
      setDragOver(null);
      return;
    }

    setTierImages((prev) => ({
      ...prev,
      [tierId]: [...prev[tierId], img],
    }));
    setDragging(null);
    setDragOver(null);
  };

  const onDropSidebar = () => {
    if (!dragging || dragging.from === "sidebar") {
      setDragging(null);
      setDragOver(null);
      return;
    }
    const img = { id: dragging.id, src: dragging.src, name: dragging.name };
    setTierImages((prev) => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter((i) => i.id !== dragging.id),
    }));
    setImages((prev) => [...prev, img]);
    setDragging(null);
    setDragOver(null);
  };

  const removeFromTier = (tierId, imgId) => {
    const img = tierImages[tierId].find((i) => i.id === imgId);
    if (!img) return;
    setTierImages((prev) => ({
      ...prev,
      [tierId]: prev[tierId].filter((i) => i.id !== imgId),
    }));
    setImages((prev) => [...prev, img]);
  };

  const bg = dark ? "#0A0A0F" : "#F0F0F5";
  const surface = dark ? "#13131A" : "#FFFFFF";
  const surfaceHover = dark ? "#1C1C28" : "#F5F5FA";
  const border = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const text = dark ? "#E8E8F0" : "#1A1A2E";
  const subtext = dark ? "#666688" : "#9999BB";

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      color: text,
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      transition: "background 0.3s, color 0.3s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333355; border-radius: 99px; }
        .tier-row { transition: background 0.2s; }
        .tier-row:hover { filter: brightness(1.05); }
        .img-card { transition: transform 0.15s, box-shadow 0.15s; cursor: grab; }
        .img-card:hover { transform: scale(1.04); z-index: 2; }
        .img-card:active { cursor: grabbing; transform: scale(0.97); }
        .drop-active { outline: 2px dashed currentColor; outline-offset: -2px; }
        .toggle-btn { transition: background 0.2s, transform 0.15s; }
        .toggle-btn:hover { transform: scale(1.08); }
        .upload-zone { transition: background 0.2s, border-color 0.2s; }
        .upload-zone:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(255,255,255,0.3) !important; }
        .remove-btn { opacity: 0; transition: opacity 0.15s; }
        .img-wrap:hover .remove-btn { opacity: 1; }
      `}</style>

      {/* Header */}
      {/* <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: `1px solid ${border}`,
        background: dark ? "rgba(10,10,15,0.9)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "#E8000D",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700, color: "#fff", letterSpacing: "-1px",
          }}>T↑</div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
            fontSize: 18, letterSpacing: "-0.5px", color: text,
          }}>TierForge</span>
        </div>
        <button
          className="toggle-btn"
          onClick={() => setDark(!dark)}
          style={{
            padding: "8px 16px", borderRadius: 99, border: `1px solid ${border}`,
            background: dark ? "#1C1C28" : "#E8E8F5",
            color: text, cursor: "pointer", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header> */}

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 61px)" }}>

        {/* Tier list area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 24px 28px" }}>
          <h2 style={{
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
            fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            color: subtext, marginBottom: 16,
          }}>TIER LIST</h2>

          <div style={{
            borderRadius: 16, overflow: "hidden",
            border: `1px solid ${border}`,
            background: surface,
            boxShadow: "none",
          }}>
            {TIERS.map((tier, i) => {
              const imgs = tierImages[tier.id];
              const isOver = dragOver === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`tier-row${isOver ? " drop-active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(tier.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => onDropTier(tier.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    minHeight: 80,
                    borderBottom: i < TIERS.length - 1 ? `1px solid ${border}` : "none",
                    background: isOver ? `${tier.bg}18` : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Label */}
                  <div style={{
                    width: 88,
                    minWidth: 88,
                    background: tier.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: `1px solid rgba(0,0,0,0.15)`,
                    position: "sticky",
                    left: 0,
                    alignSelf: "stretch",
                  }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
                      fontSize: tier.id === "poop" ? 20 : 14,
                      color: tier.labelColor,
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.5px",
                    }}>{tier.label}</span>
                  </div>

                  {/* Images */}
                  <div style={{
                    display: "flex", flexWrap: "wrap",
                    gap: 8, padding: "10px 12px",
                    flex: 1, minHeight: 80, alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}>
                    {imgs.map((img) => (
                      <div
                        key={img.id}
                        className="img-wrap"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="img-card"
                          draggable
                          onDragStart={() => onDragStartTier(img, tier.id)}
                          onDragEnd={() => setDragging(null)}
                          style={{
                            width: 60, height: 89,
                            borderRadius: 6, overflow: "hidden",
                            border: `2px solid ${tier.bg}`,
                          }}
                        >
                          <img src={img.src} alt={img.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromTier(tier.id, img.id)}
                          style={{
                            position: "absolute", top: -6, right: -6,
                            width: 18, height: 18, borderRadius: "50%",
                            background: "#FF2D55", border: "none",
                            color: "#fff", fontSize: 10, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, lineHeight: 1,
                          }}
                        >×</button>
                      </div>
                    ))}
                    {imgs.length === 0 && (
                      <div style={{
                        color: subtext, fontSize: 12, fontStyle: "italic",
                        alignSelf: "center", padding: "0 4px",
                        opacity: isOver ? 1 : 0.4,
                      }}>
                        {isOver ? `↓ Drop here` : `Drag images here`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: 220, minWidth: 220,
          display: "flex", flexDirection: "column",
          borderLeft: `1px solid ${border}`,
          background: dark ? "#0E0E18" : "#F8F8FC",
          height: "100%",
        }}>
          <div style={{
            padding: "16px 16px 10px",
            borderBottom: `1px solid ${border}`,
          }}>
            <h3 style={{
              fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
              fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              color: subtext,
            }}>IMAGES ({images.length})</h3>
          </div>

          {/* Scrollable images */}
          <div
            style={{
              flex: 1, overflowY: "auto", padding: "12px",
              display: "flex", flexWrap: "wrap", gap: 8,
              alignContent: "flex-start",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver("sidebar"); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={onDropSidebar}
          >
            {images.length === 0 && (
              <div style={{
                width: "100%", textAlign: "center",
                color: subtext, fontSize: 12, marginTop: 20,
                lineHeight: 1.6,
              }}>
                Add images below<br />then drag them<br />into the tiers
              </div>
            )}
            {images.map((img) => (
              <div
                key={img.id}
                className="img-card"
                draggable
                onDragStart={() => onDragStartSidebar(img)}
                onDragEnd={() => setDragging(null)}
                style={{
                  width: 80, height: 142,
                  borderRadius: 8, overflow: "hidden",
                  border: `1px solid ${border}`,
                  background: surfaceHover,
                }}
              >
                <img
                  src={img.src} alt={img.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>

          {/* Upload zone */}
          <div style={{ padding: "12px", borderTop: `1px solid ${border}` }}>
            <div
              className="upload-zone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              style={{
                border: `2px dashed ${border}`,
                borderRadius: 12, padding: "16px 8px",
                textAlign: "center", cursor: "pointer",
                background: "transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>↑</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 2, fontFamily: "'IBM Plex Sans', sans-serif" }}>Add Images</div>
              <div style={{ fontSize: 10, color: subtext, fontFamily: "'IBM Plex Sans', sans-serif" }}>Click or drag & drop</div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}