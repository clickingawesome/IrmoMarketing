import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants & Config ───
const ANIMATION_DURATION = 600;
const SWIPE_THRESHOLD = 50;

// ─── PDF Flipbook App ───
export default function PDFFlipbook() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [seoText, setSeoText] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viewMode, setViewMode] = useState("single"); // single | double
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const bookRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasPoolRef = useRef([]);

  // ─── Responsive view mode ───
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) {
        setViewMode("single");
      }
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // ─── Keyboard navigation ───
  useEffect(() => {
    const handleKey = (e) => {
      if (!pdfDoc) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
        setShowThumbnails(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pdfDoc, currentPage, isFlipping, pages.length, viewMode]);

  // ─── Load PDF.js from CDN ───
  const loadPdfJs = useCallback(async () => {
    if (window.pdfjsLib) return window.pdfjsLib;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  // ─── Render a single page to canvas ───
  const renderPage = useCallback(async (pdf, pageNum, scale = 2) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Extract text for SEO
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join(" ");

    return { imageUrl: canvas.toDataURL("image/jpeg", 0.92), text, pageNum };
  }, []);

  // ─── Handle PDF file upload ───
  const handleFileUpload = useCallback(
    async (file) => {
      if (!file || file.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }

      setError(null);
      setIsLoading(true);
      setLoadingProgress(0);
      setFileName(file.name.replace(".pdf", ""));
      setPages([]);
      setSeoText([]);
      setCurrentPage(0);

      try {
        const pdfjsLib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        setPdfDoc(pdf);
        const totalPages = pdf.numPages;
        const renderedPages = [];
        const textContent = [];

        for (let i = 1; i <= totalPages; i++) {
          const result = await renderPage(pdf, i);
          renderedPages.push(result);
          textContent.push({ page: i, text: result.text });
          setLoadingProgress(Math.round((i / totalPages) * 100));
        }

        setPages(renderedPages);
        setSeoText(textContent);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load PDF. Please try another file.");
        setIsLoading(false);
      }
    },
    [loadPdfJs, renderPage]
  );

  // ─── Drag & drop ───
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // ─── Navigation ───
  const getMaxPage = () => {
    if (viewMode === "double") {
      return Math.max(0, pages.length - 2);
    }
    return pages.length - 1;
  };

  const goNext = useCallback(() => {
    if (isFlipping) return;
    const step = viewMode === "double" ? 2 : 1;
    const max = getMaxPage();
    if (currentPage >= max) return;

    setIsFlipping(true);
    setFlipDirection("next");
    setTimeout(() => {
      setCurrentPage((p) => Math.min(p + step, max));
      setIsFlipping(false);
      setFlipDirection(null);
    }, ANIMATION_DURATION);
  }, [isFlipping, currentPage, viewMode, pages.length]);

  const goPrev = useCallback(() => {
    if (isFlipping || currentPage <= 0) return;
    const step = viewMode === "double" ? 2 : 1;

    setIsFlipping(true);
    setFlipDirection("prev");
    setTimeout(() => {
      setCurrentPage((p) => Math.max(p - step, 0));
      setIsFlipping(false);
      setFlipDirection(null);
    }, ANIMATION_DURATION);
  }, [isFlipping, currentPage, viewMode]);

  const goToPage = useCallback(
    (pageIndex) => {
      if (isFlipping) return;
      const adjusted = viewMode === "double" ? pageIndex - (pageIndex % 2) : pageIndex;
      setCurrentPage(Math.max(0, Math.min(adjusted, getMaxPage())));
      setShowThumbnails(false);
    },
    [isFlipping, viewMode, pages.length]
  );

  // ─── Touch handling ───
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  // ─── Generate SEO HTML ───
  const generateSeoEmbed = () => {
    const pagesMeta = seoText
      .map(
        (p) => `
    <section class="flipbook-page" data-page="${p.page}" id="page-${p.page}">
      <h2>Page ${p.page}</h2>
      <p>${p.text}</p>
    </section>`
      )
      .join("\n");

    return `<!-- SEO-Friendly Flipbook Content for: ${fileName} -->
<!-- Place this in your page HTML for search engine indexing -->

<article class="flipbook-seo-content" itemscope itemtype="https://schema.org/DigitalDocument">
  <meta itemprop="name" content="${fileName}" />
  <meta itemprop="encodingFormat" content="application/pdf" />

  <h1>${fileName}</h1>
  <p>Interactive flipbook guide — ${pages.length} pages</p>

  <nav class="flipbook-toc" aria-label="Table of Contents">
    <h2>Contents</h2>
    <ol>
      ${seoText.map((p) => `<li><a href="#page-${p.page}">Page ${p.page}</a></li>`).join("\n      ")}
    </ol>
  </nav>

  <div class="flipbook-pages">
    ${pagesMeta}
  </div>
</article>

<style>
  /* Hide SEO content visually but keep it crawlable */
  .flipbook-seo-content {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  "name": "${fileName}",
  "numberOfPages": ${pages.length},
  "encodingFormat": "application/pdf",
  "accessMode": "textual",
  "accessibilityFeature": ["alternativeText", "structuralNavigation"]
}
</script>`;
  };

  const copySeoCode = () => {
    navigator.clipboard.writeText(generateSeoEmbed());
  };

  // ─── Render ───
  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: isFullscreen ? "#0a0a0f" : "transparent",
        position: isFullscreen ? "fixed" : "relative",
        inset: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 9999 : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: pages.length > 0 ? "auto" : "100vh",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes flipNext {
          0% { transform: perspective(2000px) rotateY(0deg); }
          100% { transform: perspective(2000px) rotateY(-180deg); }
        }
        @keyframes flipPrev {
          0% { transform: perspective(2000px) rotateY(-180deg); }
          100% { transform: perspective(2000px) rotateY(0deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .flipbook-btn {
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .flipbook-btn:active {
          transform: scale(0.96);
        }
        .flipbook-nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: #e0e0e6;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 20px;
        }
        .flipbook-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.15);
          color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .flipbook-nav-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .thumb-item {
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          border: 2px solid transparent;
          position: relative;
        }
        .thumb-item:hover {
          border-color: rgba(120, 160, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .thumb-item.active {
          border-color: #78a0ff;
          box-shadow: 0 0 0 2px rgba(120, 160, 255, 0.25);
        }
        .seo-panel pre {
          font-size: 11px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-all;
          max-height: 400px;
          overflow-y: auto;
        }
        .drop-zone {
          transition: all 0.3s ease;
        }
        .drop-zone.dragging {
          border-color: #78a0ff !important;
          background: rgba(120, 160, 255, 0.06) !important;
        }
      `}</style>

      {/* ─── Upload Screen ─── */}
      {pages.length === 0 && !isLoading && (
        <div
          style={{
            animation: "fadeSlideUp 0.6s ease-out",
            textAlign: "center",
            padding: "40px 24px",
            maxWidth: 560,
            width: "100%",
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "#f0f0f5",
                marginBottom: 12,
                lineHeight: 1.15,
              }}
            >
              PDF Flipbook
            </div>
            <p style={{ color: "#8888a0", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Transform your PDF guides into interactive, SEO-friendly flipbooks.
              <br />
              Mobile responsive with smooth page-turn animations.
            </p>
          </div>

          <div
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "56px 32px",
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📄</div>
            <div style={{ color: "#c0c0d0", fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Drop your PDF here or click to browse
            </div>
            <div style={{ color: "#666680", fontSize: 13 }}>
              Supports any PDF • Text is extracted for SEO
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 20px",
                background: "rgba(255,80,80,0.1)",
                border: "1px solid rgba(255,80,80,0.2)",
                borderRadius: 12,
                color: "#ff8080",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: "🔍", label: "SEO Ready", desc: "Extracted text + Schema.org markup" },
              { icon: "📱", label: "Mobile First", desc: "Touch swipe & responsive layout" },
              { icon: "⚡", label: "Fast", desc: "Client-side rendering, no server needed" },
            ].map((f, i) => (
              <div key={i} style={{ textAlign: "center", maxWidth: 140 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ color: "#d0d0e0", fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                <div style={{ color: "#666680", fontSize: 11, marginTop: 2 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div style={{ textAlign: "center", animation: "fadeSlideUp 0.4s ease-out" }}>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28,
              color: "#f0f0f5",
              marginBottom: 24,
            }}
          >
            Preparing your flipbook
          </div>
          <div
            style={{
              width: 280,
              height: 4,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #5b7fff, #78a0ff)",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div style={{ color: "#8888a0", fontSize: 14, marginTop: 12 }}>
            Rendering pages... {loadingProgress}%
          </div>
        </div>
      )}

      {/* ─── Flipbook Viewer ─── */}
      {pages.length > 0 && !isLoading && (
        <div
          style={{
            width: "100%",
            maxWidth: isFullscreen ? "100%" : 1100,
            animation: "scaleIn 0.5s ease-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: isFullscreen ? "100vh" : "auto",
            padding: isFullscreen ? "16px" : "24px 16px",
            boxSizing: "border-box",
          }}
        >
          {/* ─── Top Bar ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 900,
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(16px, 3vw, 22px)",
                  color: "#e8e8f0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "40vw",
                }}
              >
                {fileName}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "#8888a0",
                  background: "rgba(255,255,255,0.06)",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontWeight: 500,
                }}
              >
                {pages.length} pages
              </span>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {/* View mode toggle (desktop only) */}
              {window.innerWidth >= 768 && (
                <button
                  className="flipbook-btn"
                  onClick={() => setViewMode(viewMode === "single" ? "double" : "single")}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#b0b0c0",
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  {viewMode === "single" ? "📖 Spread" : "📄 Single"}
                </button>
              )}

              <button
                className="flipbook-btn"
                onClick={() => setShowThumbnails(!showThumbnails)}
                style={{
                  background: showThumbnails ? "rgba(120,160,255,0.15)" : "rgba(255,255,255,0.06)",
                  color: showThumbnails ? "#78a0ff" : "#b0b0c0",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                ▦ Pages
              </button>

              <button
                className="flipbook-btn"
                onClick={() => setShowSeoPanel(!showSeoPanel)}
                style={{
                  background: showSeoPanel ? "rgba(120,160,255,0.15)" : "rgba(255,255,255,0.06)",
                  color: showSeoPanel ? "#78a0ff" : "#b0b0c0",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                {"</>"}  SEO
              </button>

              <button
                className="flipbook-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#b0b0c0",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                {isFullscreen ? "✕ Exit" : "⛶ Full"}
              </button>

              <button
                className="flipbook-btn"
                onClick={() => {
                  setPdfDoc(null);
                  setPages([]);
                  setSeoText([]);
                  setCurrentPage(0);
                  setFileName("");
                  setIsFullscreen(false);
                  setShowThumbnails(false);
                  setShowSeoPanel(false);
                }}
                style={{
                  background: "rgba(255,80,80,0.08)",
                  color: "#ff8888",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                ↻ New
              </button>
            </div>
          </div>

          {/* ─── Main Content Area ─── */}
          <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 900, flex: 1, minHeight: 0 }}>
            {/* ─── Thumbnails Panel ─── */}
            {showThumbnails && (
              <div
                style={{
                  width: 140,
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: isFullscreen ? "calc(100vh - 180px)" : 520,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingRight: 8,
                  animation: "fadeSlideUp 0.3s ease-out",
                }}
              >
                {pages.map((page, i) => (
                  <div
                    key={i}
                    className={`thumb-item ${i === currentPage || (viewMode === "double" && i === currentPage + 1) ? "active" : ""}`}
                    onClick={() => goToPage(i)}
                  >
                    <img
                      src={page.imageUrl}
                      alt={`Page ${i + 1}`}
                      style={{ width: "100%", display: "block" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 6,
                        background: "rgba(0,0,0,0.7)",
                        color: "#ddd",
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Book Area ─── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
              <div
                ref={bookRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: viewMode === "double" ? 2 : 0,
                  perspective: "2000px",
                  position: "relative",
                  width: "100%",
                  maxHeight: isFullscreen ? "calc(100vh - 200px)" : 520,
                  userSelect: "none",
                }}
              >
                {/* Left nav */}
                <button
                  className="flipbook-btn flipbook-nav-btn"
                  onClick={goPrev}
                  disabled={currentPage <= 0 || isFlipping}
                  style={{ position: "absolute", left: -8, zIndex: 10, flexShrink: 0 }}
                >
                  ‹
                </button>

                {/* Pages */}
                <div
                  style={{
                    display: "flex",
                    gap: viewMode === "double" ? 4 : 0,
                    maxWidth: viewMode === "double" ? "90%" : "70%",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {/* Current page */}
                  <div
                    style={{
                      position: "relative",
                      transformOrigin: viewMode === "double" ? "right center" : "center center",
                      animation: isFlipping
                        ? `${flipDirection === "next" ? "flipNext" : "flipPrev"} ${ANIMATION_DURATION}ms ease-in-out`
                        : "none",
                      borderRadius: 6,
                      overflow: "hidden",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
                      flex: viewMode === "double" ? "0 1 50%" : "0 1 100%",
                      maxWidth: viewMode === "double" ? "50%" : "100%",
                      transform: `scale(${zoom})`,
                      transition: "transform 0.2s ease",
                    }}
                  >
                    {pages[currentPage] && (
                      <img
                        src={pages[currentPage].imageUrl}
                        alt={`Page ${currentPage + 1} - ${fileName}`}
                        style={{
                          width: "100%",
                          display: "block",
                          maxHeight: isFullscreen ? "calc(100vh - 200px)" : 520,
                          objectFit: "contain",
                          background: "#fff",
                        }}
                        draggable={false}
                      />
                    )}
                    {/* Page number overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.6)",
                        color: "#ccc",
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontWeight: 500,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {currentPage + 1}
                    </div>
                  </div>

                  {/* Second page (double view) */}
                  {viewMode === "double" && pages[currentPage + 1] && (
                    <div
                      style={{
                        borderRadius: 6,
                        overflow: "hidden",
                        boxShadow: "0 4px 30px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
                        flex: "0 1 50%",
                        maxWidth: "50%",
                        transform: `scale(${zoom})`,
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <img
                        src={pages[currentPage + 1].imageUrl}
                        alt={`Page ${currentPage + 2} - ${fileName}`}
                        style={{
                          width: "100%",
                          display: "block",
                          maxHeight: isFullscreen ? "calc(100vh - 200px)" : 520,
                          objectFit: "contain",
                          background: "#fff",
                        }}
                        draggable={false}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(0,0,0,0.6)",
                          color: "#ccc",
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 12,
                          fontWeight: 500,
                        }}
                      >
                        {currentPage + 2}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right nav */}
                <button
                  className="flipbook-btn flipbook-nav-btn"
                  onClick={goNext}
                  disabled={currentPage >= getMaxPage() || isFlipping}
                  style={{ position: "absolute", right: -8, zIndex: 10, flexShrink: 0 }}
                >
                  ›
                </button>
              </div>

              {/* ─── Bottom Controls ─── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 20,
                  flexWrap: "wrap",
                }}
              >
                {/* Page slider */}
                <input
                  type="range"
                  min={0}
                  max={getMaxPage()}
                  step={viewMode === "double" ? 2 : 1}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  style={{
                    width: "clamp(150px, 30vw, 260px)",
                    accentColor: "#78a0ff",
                    cursor: "pointer",
                  }}
                />
                <span style={{ color: "#8888a0", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
                  {currentPage + 1}
                  {viewMode === "double" && pages[currentPage + 1] ? `–${currentPage + 2}` : ""} / {pages.length}
                </span>

                {/* Zoom */}
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button
                    className="flipbook-btn"
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      color: "#b0b0c0",
                      fontSize: 16,
                    }}
                  >
                    −
                  </button>
                  <span style={{ color: "#8888a0", fontSize: 12, width: 40, textAlign: "center" }}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    className="flipbook-btn"
                    onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      color: "#b0b0c0",
                      fontSize: 16,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SEO Panel ─── */}
          {showSeoPanel && (
            <div
              className="seo-panel"
              style={{
                width: "100%",
                maxWidth: 900,
                marginTop: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
                animation: "fadeSlideUp 0.3s ease-out",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ color: "#e0e0f0", fontSize: 18, fontWeight: 600, fontFamily: "'DM Serif Display', serif" }}>
                    SEO Embed Code
                  </div>
                  <div style={{ color: "#8888a0", fontSize: 13, marginTop: 4 }}>
                    Copy this code into your HTML page alongside the flipbook component.
                    <br />
                    Includes hidden semantic content, Schema.org markup, and structured navigation.
                  </div>
                </div>
                <button
                  className="flipbook-btn"
                  onClick={copySeoCode}
                  style={{
                    background: "linear-gradient(135deg, #5b7fff, #6b5bff)",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  📋 Copy Code
                </button>
              </div>

              <pre
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: 16,
                  color: "#a0a0c0",
                  overflowX: "auto",
                }}
              >
                {generateSeoEmbed()}
              </pre>

              <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: "rgba(120,160,255,0.06)",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ color: "#78a0ff", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    ✓ What's included
                  </div>
                  <div style={{ color: "#9090a8", fontSize: 12, lineHeight: 1.8 }}>
                    • Visually hidden but crawlable text content from every page<br />
                    • Schema.org DigitalDocument structured data (JSON-LD)<br />
                    • Semantic HTML with proper heading hierarchy<br />
                    • Internal anchor links for page navigation<br />
                    • Accessibility attributes (ARIA labels)
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: "rgba(255,180,80,0.06)",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ color: "#ffb050", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    💡 Integration tips
                  </div>
                  <div style={{ color: "#9090a8", fontSize: 12, lineHeight: 1.8 }}>
                    • Place the SEO block in your page's main content area<br />
                    • Customize the {"<h1>"} title and meta description<br />
                    • Add Open Graph tags for social sharing<br />
                    • Submit the page to Google Search Console<br />
                    • Use descriptive URL slugs like /guides/your-topic
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Hidden SEO Content (always rendered) ─── */}
          <article
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
            itemScope
            itemType="https://schema.org/DigitalDocument"
          >
            <meta itemProp="name" content={fileName} />
            <h1>{fileName}</h1>
            {seoText.map((p) => (
              <section key={p.page} id={`seo-page-${p.page}`}>
                <h2>Page {p.page}</h2>
                <p>{p.text}</p>
              </section>
            ))}
          </article>
        </div>
      )}
    </div>
  );
}
