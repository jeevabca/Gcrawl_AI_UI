import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { 
  FiCopy, 
  FiDownload, 
  FiEye, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiImage, 
  FiSearch, 
  FiExternalLink 
} from "react-icons/fi";
import "./image.css";

interface ImageGalleryProps {
  page: any;
}

export default function ImageGallery({ page }: ImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Extract list of images from page data
  const images = useMemo((): string[] => {
    const rawData = page.images_json || page.images;
    if (!rawData) return [];

    if (Array.isArray(rawData)) {
      return rawData
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") return item.url || item.src || "";
          return "";
        })
        .filter(Boolean);
    }

    if (typeof rawData === "string") {
      try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item: any) => {
              if (typeof item === "string") return item;
              if (item && typeof item === "object") return item.url || item.src || "";
              return "";
            })
            .filter(Boolean);
        }
        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.images)) {
            return parsed.images
              .map((item: any) => {
                if (typeof item === "string") return item;
                if (item && typeof item === "object") return item.url || item.src || "";
                return "";
              })
              .filter(Boolean);
          }
          if (Array.isArray(parsed.data)) {
            return parsed.data
              .map((item: any) => {
                if (typeof item === "string") return item;
                if (item && typeof item === "object") return item.url || item.src || "";
                return "";
              })
              .filter(Boolean);
          }
        }
      } catch (e) {
        // Ignore JSON parsing failure, use raw text fallback
      }

      // split by newlines/commas
      return rawData
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http") || s.startsWith("/"));
    }

    if (typeof rawData === "object") {
      const obj = rawData as any;
      if (Array.isArray(obj.images)) {
        return obj.images
          .map((item: any) => (typeof item === "string" ? item : item.url || item.src || ""))
          .filter(Boolean);
      }
      if (Array.isArray(obj.urls)) return obj.urls;
      if (Array.isArray(obj.data)) {
        return obj.data
          .map((item: any) => (typeof item === "string" ? item : item.url || item.src || ""))
          .filter(Boolean);
      }
    }

    return [];
  }, [page]);

  // Extract file extension helper
  const getFileExtension = (url: string): string => {
    try {
      const path = new URL(url).pathname;
      const parts = path.split(".");
      if (parts.length > 1) {
        const ext = parts[parts.length - 1].toLowerCase();
        if (ext.length <= 4) return ext;
      }
      return "image";
    } catch {
      return "image";
    }
  };

  // Get image name helper
  const getImageName = (url: string): string => {
    try {
      const path = new URL(url).pathname;
      const parts = path.split("/");
      return parts[parts.length - 1] || "image";
    } catch {
      return "image";
    }
  };

  // Filtered images list
  const filteredImages = useMemo(() => {
    return images.filter((url) => {
      const nameMatches = getImageName(url).toLowerCase().includes(searchTerm.toLowerCase()) || url.toLowerCase().includes(searchTerm.toLowerCase());
      const ext = getFileExtension(url);
      const formatMatches = selectedFormat === "all" || ext === selectedFormat;
      return nameMatches && formatMatches;
    });
  }, [images, searchTerm, selectedFormat]);

  // List of available unique formats for filtering
  const availableFormats = useMemo(() => {
    const formats = new Set<string>();
    images.forEach((url) => {
      formats.add(getFileExtension(url));
    });
    return Array.from(formats);
  }, [images]);

  // Lightbox handlers
  const openLightbox = (url: string) => {
    setSelectedImage(url);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const activeIndex = useMemo(() => {
    if (!selectedImage) return -1;
    return filteredImages.indexOf(selectedImage);
  }, [selectedImage, filteredImages]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex > 0) {
      setSelectedImage(filteredImages[activeIndex - 1]);
    } else {
      setSelectedImage(filteredImages[filteredImages.length - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[activeIndex + 1]);
    } else {
      setSelectedImage(filteredImages[0]);
    }
  };

  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };

  const handleDownload = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Route through server-side proxy to bypass CORS and force real download
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(url)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = getImageName(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="image-gallery-wrapper">
      {/* Header Info */}
      <div className="gallery-header">
        <span className="gallery-count">{images.length} Images Found</span>
        <div className="gallery-filters">
          {/* Format selection */}
          {availableFormats.length > 0 && (
            <select
              className="gallery-select"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="all">All Formats</option>
              {availableFormats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          {/* Search Input */}
          <div className="gallery-search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search images..."
              className="gallery-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid view */}
      {filteredImages.length > 0 ? (
        <div className="gallery-grid">
          {filteredImages.map((url, idx) => (
            <div 
              key={idx} 
              className="gallery-card"
              onClick={() => openLightbox(url)}
            >
              <ImageThumbnail url={url} name={getImageName(url)} ext={getFileExtension(url)} />
              
              {/* Card Action Hover Overlay */}
              <div className="gallery-overlay">
                <span className="gallery-overlay-ext">{getFileExtension(url).toUpperCase()}</span>
                <div className="gallery-overlay-actions">
                  <button 
                    className="gallery-icon-btn" 
                    onClick={(e) => handleCopyUrl(url, e)}
                    title="Copy URL"
                  >
                    <FiCopy />
                  </button>
                  <button
                    className="gallery-icon-btn"
                    onClick={(e) => handleDownload(url, e)}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                  <button 
                    className="gallery-icon-btn main" 
                    onClick={() => openLightbox(url)}
                    title="View Full Size"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <FiImage size={32} />
          <span>No images match your filters.</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          {/* Controls bar */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-filename">{getImageName(selectedImage)}</span>
            <div className="lightbox-actions">
              <button 
                className="lightbox-btn" 
                onClick={(e) => handleCopyUrl(selectedImage, e)}
                title="Copy URL"
              >
                <FiCopy /> Copy Link
              </button>
              <button 
                className="lightbox-btn" 
                onClick={(e) => handleDownload(selectedImage, e)}
                title="Download"
              >
                <FiDownload /> Download
              </button>
              <a 
                href={selectedImage} 
                target="_blank" 
                rel="noreferrer" 
                className="lightbox-btn link"
                title="Open in new tab"
              >
                <FiExternalLink /> Open
              </a>
              <button 
                className="lightbox-close-btn" 
                onClick={closeLightbox}
                title="Close"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="lightbox-arrow-btn left" onClick={handlePrev}>
            <FiChevronLeft />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Full view" 
              className="lightbox-main-img"
              onError={(e) => {
                // If it fails to load inside the lightbox, show a fallback
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const errorEl = document.createElement("div");
                  errorEl.className = "lightbox-error-msg";
                  errorEl.innerText = "This image failed to load or hotlinking is blocked.";
                  parent.appendChild(errorEl);
                }
              }}
            />
          </div>

          <button className="lightbox-arrow-btn right" onClick={handleNext}>
            <FiChevronRight />
          </button>

          {/* Image counter at bottom */}
          <div className="lightbox-counter">
            {activeIndex + 1} of {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component for handling individual image thumbnail and loading fallbacks
function ImageThumbnail({ url, name, ext }: { url: string; name: string; ext: string }) {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (loadError) {
    return (
      <div className="thumbnail-fallback">
        <FiImage className="fallback-icon" />
        <span className="fallback-ext">{ext.toUpperCase()}</span>
        <span className="fallback-filename" title={name}>{name}</span>
      </div>
    );
  }

  return (
    <div className={`thumbnail-container ${isLoaded ? "loaded" : "loading"}`}>
      <img 
        src={url} 
        alt={name} 
        className="thumbnail-img"
        onLoad={() => setIsLoaded(true)}
        onError={() => setLoadError(true)}
      />
      {!isLoaded && <div className="thumbnail-loader" />}
    </div>
  );
}
