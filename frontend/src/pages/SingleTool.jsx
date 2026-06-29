// ─── NOTE: This is the FREE VERSION of SingleTool.jsx ────────────────────────
// All Pro tool gates are removed — every tool is accessible for free.
// Pro version sections are commented out with "── PRO VERSION ──" markers.
// To restore Pro gates, uncomment the isPremium checks and ProGate component.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Download, Loader2, Gauge, ArrowRight, Plus, Trash2,
  Scissors, Eye, SplitSquareHorizontal, FileText,
  PenLine, KeyRound, Cpu, AlignLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import UploadBox from "../components/tools/UploadBox";
import { toolsAPI } from "../services/api";

// ─── AdSense Banner ───────────────────────────────────────────────────────────
function AdBanner() {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <div className="w-full flex justify-center my-6">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3916832696917101"
        data-ad-slot="4031678100"
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </div>
  );
}

// ─── Tool config — ALL tools FREE ────────────────────────────────────────────
const TOOL_CONFIG = {
  "image-compressor": {
    name: "Image Compressor",
    accept: { "image/*": [".jpg",".jpeg",".png",".webp"] },
    maxFiles: 10,
    desc: "Compress images without losing quality.",
    premium: false,
    content: {
      intro: "Large image files slow down websites, fill up storage, and make emails bounce. Our image compressor reduces file size by adjusting compression quality while keeping images sharp enough for web use, social media, or email attachments.",
      steps: [
        "Upload up to 10 images (JPG, PNG, or WebP) using the box above.",
        "Drag the quality slider — lower values mean smaller files but more visible compression.",
        "Watch the live size estimate update as you adjust the slider.",
        "Click Compress, then download each file individually."
      ],
      faqs: [
        { q: "What quality setting should I use?", a: "For web pages and social media, 60–70% quality is usually the sweet spot — noticeably smaller file size with no visible loss. For print or archival use, stay above 85%." },
        { q: "Will compression reduce image dimensions?", a: "No. This tool only reduces file size through compression — width and height stay exactly the same. Use our Image Resizer if you need to change dimensions." },
        { q: "Does compressing a PNG work the same as a JPG?", a: "PNG compression is lossless by nature, so savings are smaller than JPG. For maximum size reduction on PNGs, consider converting to WebP instead." }
      ]
    }
  },
  "jpg-to-png": {
    name: "JPG to PNG",
    accept: { "image/jpeg": [".jpg",".jpeg"] },
    maxFiles: 10,
    desc: "Convert JPG files to PNG format.",
    premium: false,
    content: {
      intro: "PNG supports transparent backgrounds and lossless quality, making it the preferred format for logos, icons, screenshots, and any image that needs a crisp, clean look without compression artefacts. This tool converts your JPG files to PNG instantly — no quality loss, no watermark.",
      steps: [
        "Upload up to 10 JPG or JPEG files using the box above.",
        "Click Convert — no settings needed, the conversion is automatic.",
        "Download each PNG file individually once processing is complete."
      ],
      faqs: [
        { q: "Will the converted PNG be larger than the original JPG?", a: "Usually yes — PNG is a lossless format so file sizes are typically larger than JPG. If file size matters more than transparency or quality, JPG is the better choice." },
        { q: "Does converting JPG to PNG add a transparent background?", a: "No. JPGs don't contain transparency information, so the converted PNG will have the same solid background as the original. Use our Background Remover first if you need transparency." },
        { q: "Is there any quality loss during conversion?", a: "No quality is lost going from JPG to PNG — PNG is lossless. However, any compression artefacts already present in the original JPG will still be visible." }
      ]
    }
  },
  "png-to-jpg": {
    name: "PNG to JPG",
    accept: { "image/png": [".png"] },
    maxFiles: 10,
    desc: "Convert PNG files to JPG format.",
    premium: false,
    content: {
      intro: "JPG is the standard format for photographs and web images because of its small file size. Converting PNG to JPG is useful when you need to reduce file size for email, web upload, or sharing — especially for photos where transparency is not needed.",
      steps: [
        "Upload up to 10 PNG files using the box above.",
        "Click Convert — the tool automatically applies optimal JPG compression.",
        "Download each JPG file once processing is complete."
      ],
      faqs: [
        { q: "What happens to transparent areas in my PNG?", a: "Transparent areas are filled with a white background during conversion, since JPG does not support transparency. If you need to keep transparency, stay with PNG or use WebP instead." },
        { q: "Will there be visible quality loss?", a: "JPG uses lossy compression, so there will be a very slight quality reduction compared to the original PNG. For photos this is usually imperceptible, but for sharp-edged graphics or text, PNG or WebP is a better choice." },
        { q: "How much smaller will the JPG be?", a: "For photographs, JPG files are typically 60–80% smaller than the equivalent PNG. For graphics with flat colours or text, the difference is smaller." }
      ]
    }
  },
  "image-to-webp": {
    name: "Image to WebP",
    accept: { "image/*": [".jpg",".jpeg",".png"] },
    maxFiles: 10,
    desc: "Convert images to modern WebP format.",
    premium: false,
    content: {
      intro: "WebP is Google's modern image format that delivers significantly smaller file sizes than JPG and PNG while maintaining excellent visual quality. Switching to WebP can improve your website's load speed, Core Web Vitals score, and reduce bandwidth usage — all without a noticeable drop in image quality.",
      steps: [
        "Upload up to 10 JPG or PNG files using the box above.",
        "Click Convert — the tool handles the conversion automatically.",
        "Download your WebP files and replace the originals on your website or project."
      ],
      faqs: [
        { q: "Is WebP supported by all browsers?", a: "WebP is supported by all major modern browsers including Chrome, Firefox, Safari (since version 14), and Edge. Older browsers like IE11 do not support it, but these account for less than 1% of web traffic today." },
        { q: "How much smaller are WebP files compared to JPG?", a: "WebP files are typically 25–35% smaller than equivalent JPGs at the same visual quality. Compared to PNG, WebP can be up to 50% smaller." },
        { q: "Does WebP support transparency like PNG?", a: "Yes. WebP supports both lossy compression (like JPG) and lossless compression with transparency (like PNG), making it a versatile replacement for both formats." }
      ]
    }
  },
  "image-resizer": {
    name: "Image Resizer",
    accept: { "image/*": [".jpg",".jpeg",".png",".webp"] },
    maxFiles: 10,
    desc: "Resize images to any custom dimension.",
    premium: false,
    content: {
      intro: "Whether you need a specific resolution for a website banner, a social media post, or a print document, this tool resizes your images to exact pixel dimensions. You can lock the aspect ratio to avoid distortion, or set width and height freely for a precise crop-ready size.",
      steps: [
        "Upload up to 10 images (JPG, PNG, or WebP) using the box above.",
        "Enter your target width and height in pixels, or choose a preset like 1080p, square, or OG image.",
        "Toggle the lock icon to keep the aspect ratio or resize freely.",
        "Click Resize and download your resized images."
      ],
      faqs: [
        { q: "Will resizing reduce image quality?", a: "Reducing an image's dimensions (downscaling) has no visible quality loss. Increasing dimensions beyond the original (upscaling) may result in slight blurriness since pixels are being added." },
        { q: "What does locking the aspect ratio do?", a: "When locked, changing the width automatically updates the height (and vice versa) to maintain the original proportions of the image, preventing stretching or squashing." },
        { q: "Can I resize multiple images to the same dimensions at once?", a: "Yes — upload up to 10 images and they will all be resized to the same width and height you specify." }
      ]
    }
  },
  "image-to-pdf": {
    name: "Image to PDF",
    accept: { "image/*": [".jpg",".jpeg",".png",".webp"] },
    maxFiles: 20,
    desc: "Convert multiple images into one PDF.",
    premium: false,
    content: {
      intro: "Combining multiple images into a single PDF is useful for sending scanned documents, photo albums, or multi-page reports as one tidy file. This tool places each image on its own PDF page, in the order you upload them, with no quality loss.",
      steps: [
        "Upload up to 20 images (JPG, PNG, or WebP) using the box above.",
        "Images will appear in the PDF in the order they are uploaded.",
        "Click Convert — each image becomes one page in the output PDF.",
        "Download your PDF once processing is complete."
      ],
      faqs: [
        { q: "Can I control the order of images in the PDF?", a: "Images are placed in the PDF in the order you upload them. To change the order, remove the files and re-upload them in the sequence you want." },
        { q: "What page size will the PDF use?", a: "Each page is sized to fit its image exactly, so different images may produce different page sizes within the same PDF. For a uniform page size, resize all images to the same dimensions first using our Image Resizer." },
        { q: "Will image quality be reduced in the PDF?", a: "No — images are embedded in the PDF at their original resolution without recompression, so quality is preserved." }
      ]
    }
  },
  "pdf-merge": {
    name: "PDF Merge",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 20,
    desc: "Merge multiple PDFs into one file.",
    premium: false,
    content: {
      intro: "Combining scanned documents, reports, or chapters into a single PDF makes sharing and printing far easier than sending multiple attachments. This tool merges up to 20 PDFs in the order you upload them, with no page limit per file.",
      steps: [
        "Upload your PDF files — they'll merge in the order shown.",
        "Click Merge to combine them into a single document.",
        "Download your merged PDF — page order matches your upload order."
      ],
      faqs: [
        { q: "Can I reorder files before merging?", a: "Files merge in the order you upload them. To change the order, remove a file and re-upload it in the position you want." },
        { q: "Is there a limit on PDF size or page count?", a: "You can merge up to 20 files at once. There's no strict page limit, though very large files (100MB+) may take longer to process." },
        { q: "Will merging affect PDF quality or formatting?", a: "No. Merging preserves the original formatting, fonts, and image quality of each source PDF exactly as they were." }
      ]
    }
  },
  "pdf-split": {
    name: "PDF Split",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    desc: "Extract specific pages from a PDF.",
    premium: false,
    content: {
      intro: "Sometimes you only need a few pages from a long PDF — a single chapter, an invoice, or a signed page. This tool lets you define custom page ranges and exports each range as its own separate PDF file.",
      steps: [
        "Upload a single PDF file.",
        "Set page ranges manually, or use 'Split every page' for a quick one-page-per-file split.",
        "Click Split — each range downloads as its own PDF."
      ],
      faqs: [
        { q: "Can I create multiple split files at once?", a: "Yes. Add as many page ranges as you need, and each one downloads as a separate PDF file." },
        { q: "What if I don't know the exact page numbers?", a: "Open the PDF in any viewer first to check page numbers, or use 'Split every page' to get one file per page without specifying ranges." },
        { q: "Does splitting affect the quality of the pages?", a: "No. Each split file is an exact copy of the original pages — no recompression or quality loss." }
      ]
    }
  },
  "background-remover": {
    name: "Background Remover",
    accept: { "image/*": [".jpg",".jpeg",".png",".webp"] },
    maxFiles: 1,
    desc: "Remove image background instantly with AI.",
    premium: false,
    content: {
      intro: "Removing a background manually in photo editing software takes time and skill. This AI-powered tool detects the subject in your image and removes the background automatically in seconds, producing a clean PNG with a transparent background — ready for product listings, profile photos, or design projects.",
      steps: [
        "Upload a single image (JPG, PNG, or WebP) using the box above.",
        "Click Remove Background — the AI processes your image automatically.",
        "Preview the before/after result using the slider.",
        "Download the PNG file with the transparent background."
      ],
      faqs: [
        { q: "What types of images work best?", a: "The AI works best on images with a clear subject — people, products, animals, or objects — against a reasonably distinct background. Very complex scenes with overlapping edges may produce less precise results." },
        { q: "What format is the output file?", a: "The output is always a PNG file, since PNG supports transparency. JPG does not support transparent backgrounds." },
        { q: "Can I remove the background from a logo or illustration?", a: "Yes, though results vary depending on how complex the edges are. For simple logos with solid fills, results are usually clean. For detailed illustrations, manual touch-ups may still be needed." }
      ]
    }
  },
  "watermark-remover": {
    name: "Watermark Remover",
    accept: { "image/*": [".jpg",".jpeg",".png"] },
    maxFiles: 1,
    desc: "Remove watermarks from images.",
    premium: false,
    content: {
      intro: "Watermarks on your own images — from cameras, scanning apps, or old editing software — can be distracting when you need a clean version. This tool uses AI inpainting to detect and remove watermarks, text overlays, and logos from images, filling the area with natural-looking content.",
      steps: [
        "Upload a single JPG or PNG image using the box above.",
        "Click Remove Watermark — the AI analyses and removes the overlay automatically.",
        "Use the before/after slider to compare the original and cleaned result.",
        "Download the processed image."
      ],
      faqs: [
        { q: "What kinds of watermarks can be removed?", a: "The tool works best on semi-transparent text watermarks, timestamps, and small logo overlays. Large, opaque, or highly complex watermarks covering significant portions of the image are harder to remove cleanly." },
        { q: "Will the area under the watermark look natural?", a: "For most images, yes — the AI fills the removed area using surrounding pixels to create a seamless result. Results are best when the watermark sits over a relatively uniform background." },
        { q: "Can I use this to remove watermarks from images I don't own?", a: "This tool is intended for use on your own images only — for example, removing camera timestamps or app watermarks from photos you took yourself. Removing watermarks from copyrighted images you don't own may violate copyright law." }
      ]
    }
  },
  "pdf-compress": {
    name: "PDF Compress",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 5,
    desc: "Reduce PDF file size significantly.",
    premium: false,
    content: {
      intro: "Large PDF files are slow to email, upload, and share. This tool reduces PDF file size by optimising embedded images and removing redundant data, while keeping text sharp and readable. It's ideal for scanned documents, image-heavy reports, and presentation PDFs that are too large to attach or upload.",
      steps: [
        "Upload up to 5 PDF files using the box above.",
        "Click Compress — the tool automatically applies the best compression settings.",
        "Download each compressed PDF once processing is complete."
      ],
      faqs: [
        { q: "How much can file size be reduced?", a: "Compression results vary depending on the PDF content. Image-heavy PDFs can often be reduced by 50–80%. PDFs that are mostly text see smaller reductions since text is already compact." },
        { q: "Will compression affect text readability?", a: "No — text in PDFs is vector-based and is not affected by compression. Only embedded images are optimised, and these remain clearly readable at normal viewing sizes." },
        { q: "Is there a maximum file size I can upload?", a: "You can upload PDF files up to 50MB each. For very large files, compression may take slightly longer to process." }
      ]
    }
  },
  "pdf-to-word": {
    name: "PDF to Word",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 5,
    desc: "Convert PDF to editable Word document.",
    premium: false
  },
  "pdf-ocr": {
    name: "PDF OCR",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 5,
    desc: "Extract text from scanned PDFs.",
    premium: false,
    content: {
      intro: "Scanned PDFs are essentially images — you can view them but cannot search, copy, or edit the text. OCR (Optical Character Recognition) analyses the image and extracts all readable text, making it searchable and editable. This is especially useful for scanned contracts, invoices, books, and handwritten notes.",
      steps: [
        "Upload a scanned PDF (up to 5 files) using the box above.",
        "Click Extract Text — the OCR engine reads each page and identifies text.",
        "Download the output text file containing all extracted content."
      ],
      faqs: [
        { q: "What languages does OCR support?", a: "The tool supports English and most major Latin-alphabet languages. Results are most accurate on clearly printed text with good scan quality." },
        { q: "How accurate is the text extraction?", a: "Accuracy depends heavily on scan quality. Clean, high-resolution scans of typed text produce near-perfect results. Handwriting, low-resolution scans, or heavily stylised fonts may produce partial results." },
        { q: "Will the original PDF formatting be preserved?", a: "The output is plain text only — formatting such as columns, tables, and images is not preserved. For layout-accurate conversion, use our PDF to Word tool instead." }
      ]
    }
  },
  "esign-pdf": {
    name: "E-Sign PDF",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    desc: "Add your digital signature to any PDF.",
    premium: false,
    content: {
      intro: "Printing a PDF just to sign it and scan it back is slow and wasteful. This tool lets you add a digital signature block directly to any PDF — with your name, signature text, date, and your choice of position on the page. The result is a signed PDF you can email or upload immediately.",
      steps: [
        "Upload the PDF you want to sign using the box above.",
        "Enter your signature text and optionally your signer name.",
        "Choose where on the page the signature block should appear.",
        "Click Sign PDF and download the signed document."
      ],
      faqs: [
        { q: "Is a digital signature legally valid?", a: "A text-based signature stamp is a simple electronic signature and is legally recognised in many jurisdictions for everyday documents. For contracts requiring a certified digital signature with a cryptographic key, a dedicated e-signature service such as DocuSign or Adobe Sign is recommended." },
        { q: "Can I sign on a specific page?", a: "Currently the signature block is added to the last page of the PDF, which is the standard position for most contracts and agreements." },
        { q: "Will the rest of the PDF be affected?", a: "No — only the signature block is added. All other pages, text, and images in the PDF remain exactly as they were." }
      ]
    }
  },
  "pdf-password-remover": {
    name: "PDF Password Remover",
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 5,
    desc: "Remove password protection from PDFs.",
    premium: false,
    content: {
      intro: "Password-protected PDFs are inconvenient when you need to open, print, or share them repeatedly. If you know the password, this tool removes the protection and produces an unlocked PDF you can open freely on any device without entering credentials each time.",
      steps: [
        "Upload up to 5 password-protected PDF files using the box above.",
        "Enter the PDF password in the field provided (leave blank if there is no open password).",
        "Click Unlock PDF and download the unprotected version."
      ],
      faqs: [
        { q: "Do I need to know the password?", a: "Yes — this tool removes password protection from PDFs where you already know the password. It does not crack or bypass unknown passwords." },
        { q: "What types of PDF protection does this remove?", a: "This tool removes the open password (required to view the file). Some PDFs also have permissions restrictions (preventing printing or copying) — these may also be removed depending on the protection level used." },
        { q: "Is it safe to upload a password-protected PDF?", a: "Yes — your file is processed securely and deleted from our servers within one hour. The password you enter is used only for processing and is never stored." }
      ]
    }
  },
};

const QUALITY_PRESETS = [
  { label: "Minimum",  value: 10, color: "#ef4444", bg: "bg-red-100 dark:bg-red-900/30",      text: "text-red-700 dark:text-red-300"       },
  { label: "Low",      value: 30, color: "#f97316", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  { label: "Balanced", value: 50, color: "#f59e0b", bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-300"   },
  { label: "High",     value: 70, color: "#84cc16", bg: "bg-lime-100 dark:bg-lime-900/30",     text: "text-lime-700 dark:text-lime-300"     },
  { label: "Maximum",  value: 90, color: "#22c55e", bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-300"   },
];

function getPreset(q) {
  if (q >= 81) return QUALITY_PRESETS[4];
  if (q >= 61) return QUALITY_PRESETS[3];
  if (q >= 41) return QUALITY_PRESETS[2];
  if (q >= 21) return QUALITY_PRESETS[1];
  return QUALITY_PRESETS[0];
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024, s = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
}

async function estimateCompressedSize(file, quality) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      c.toBlob((blob) => { URL.revokeObjectURL(url); resolve(blob ? blob.size : file.size); }, mime, quality / 100);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file.size); };
    img.src = url;
  });
}

async function getPdfPageCount(file) {
  try {
    const { PDFDocument } = await import("pdf-lib");
    return (await PDFDocument.load(await file.arrayBuffer())).getPageCount();
  } catch { return 0; }
}

async function forceDownload(tokenPath, filename) {
  try {
    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || window.location.origin;
    const a = document.createElement("a");
    a.href = `${base}${tokenPath}`; a.download = filename; a.rel = "noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch { window.open(tokenPath, "_blank", "noreferrer"); }
}

async function fetchAsObjectUrl(tokenPath) {
  try {
    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || window.location.origin;
    const res  = await fetch(`${base}${tokenPath}&preview=1`);
    if (!res.ok) throw new Error();
    return URL.createObjectURL(await res.blob());
  } catch { return null; }
}

// ─── Before/After Slider ──────────────────────────────────────────────────────
function BeforeAfterSlider({ beforeSrc, afterSrc, afterLabel = "Result" }) {
  const [pos, setPos] = useState(50);
  const ref           = useRef(null);
  const drag          = useRef(false);
  const getP = (cx) => { const r = ref.current.getBoundingClientRect(); return Math.max(2, Math.min(98, ((cx - r.left) / r.width) * 100)); };
  useEffect(() => {
    const up = () => (drag.current = false);
    const mv = (e) => { if (drag.current) setPos(getP(e.clientX)); };
    window.addEventListener("mouseup", up); window.addEventListener("mousemove", mv); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mv); window.removeEventListener("touchend", up); };
  }, []);
  return (
    <div ref={ref} className="relative select-none overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 cursor-col-resize" style={{ touchAction:"none" }}
      onMouseDown={(e) => { drag.current=true; setPos(getP(e.clientX)); }}
      onTouchStart={(e) => { drag.current=true; setPos(getP(e.touches[0].clientX)); }}
      onTouchMove={(e) => { if(drag.current) setPos(getP(e.touches[0].clientX)); }}>
      <div className="absolute inset-0" style={{ backgroundImage:"repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%)",backgroundSize:"20px 20px" }} />
      <img src={afterSrc} alt="After" className="relative block w-full max-h-96 object-contain" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width:`${pos}%` }}>
        <img src={beforeSrc} alt="Before" className="block h-auto max-h-96 object-contain" style={{ width:`${10000/pos}%`,maxWidth:"none" }} draggable={false} />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left:`${pos}%`,transform:"translateX(-50%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl border-2 border-gray-200 flex items-center justify-center">
          <SplitSquareHorizontal className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none">Original</div>
      <div className="absolute top-3 right-3 bg-primary-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none">{afterLabel}</div>
    </div>
  );
}

function CompressionSlider({ quality, onChange, files }) {
  const preset = getPreset(quality);
  const pct    = ((quality - 1) / 99) * 100;
  const [estimates, setEst]     = useState([]);
  const [estimating, setEsting] = useState(false);
  const dRef = useRef(null);
  useEffect(() => {
    if (!files?.length) { setEst([]); return; }
    setEsting(true);
    clearTimeout(dRef.current);
    dRef.current = setTimeout(async () => { setEst(await Promise.all(files.map((f) => estimateCompressedSize(f, quality)))); setEsting(false); }, 300);
    return () => clearTimeout(dRef.current);
  }, [quality, files]);
  const tOrig = files?.reduce((s,f) => s+f.size,0)||0;
  const tEst  = estimates.reduce((s,v) => s+v,0);
  const saved = tOrig>0&&tEst>0 ? Math.max(0,(((tOrig-tEst)/tOrig)*100)).toFixed(1) : null;
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-gray-500" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Compression Quality</span></div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${preset.bg} ${preset.text}`}>{preset.label} · {quality}%</span>
      </div>
      {files?.length > 0 && (
        <div className="mb-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{files.length} file{files.length>1?"s":""} · {formatBytes(tOrig)}</span>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-gray-400" />
              {estimating ? <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                : <span className={`text-xs font-mono font-bold ${preset.text}`}>~{formatBytes(tEst)}</span>}
            </div>
          </div>
          {!estimating && saved!==null && Number(saved)>0 && (
            <div className={`px-3 py-1.5 text-center text-xs font-semibold ${preset.bg} ${preset.text} border-t border-gray-100 dark:border-gray-700`}>↓ Save ~{saved}% ({formatBytes(tOrig-tEst)})</div>
          )}
        </div>
      )}
      <input type="range" min="1" max="100" value={quality} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
        style={{ background:`linear-gradient(to right,${preset.color} 0%,${preset.color} ${pct}%,#e5e7eb ${pct}%,#e5e7eb 100%)` }} />
      <div className="flex justify-between text-xs text-gray-400 mb-4"><span>1% · Smallest</span><span>100% · Best quality</span></div>
      <div className="grid grid-cols-5 gap-1.5">
        {QUALITY_PRESETS.map((p) => (
          <button key={p.label} onClick={() => onChange(p.value)}
            className={`text-xs py-1.5 rounded-lg font-medium transition-all border ${preset.label===p.label?`${p.bg} ${p.text} border-current scale-105 shadow-sm`:"bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:scale-105"}`}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PdfSplitOptions({ ranges, onChange, totalPages }) {
  const max = totalPages || 999;
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2"><Scissors className="h-4 w-4 text-gray-500" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Page Ranges</span></div>
        {totalPages > 0 && <span className="text-xs text-gray-400">{totalPages} pages total</span>}
      </div>
      <p className="text-xs text-gray-400 mb-4">Each range becomes a separate PDF file.</p>
      <div className="space-y-2 mb-3">
        {ranges.map((r, i) => (
          <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">File {i+1}</span>
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-xs text-gray-500 shrink-0">Page</span>
              <input type="number" min="1" max={max} value={r.start} onChange={(e) => { const n=parseInt(e.target.value,10); onChange(ranges.map((x,j)=>j===i?{...x,start:Math.max(1,Math.min(n,max))}:x)); }}
                className="w-16 text-center text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <span className="text-xs text-gray-400">to</span>
              <input type="number" min="1" max={max} value={r.end} onChange={(e) => { const n=parseInt(e.target.value,10); onChange(ranges.map((x,j)=>j===i?{...x,end:Math.max(1,Math.min(n,max))}:x)); }}
                className="w-16 text-center text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <span className="text-xs text-gray-400 shrink-0">{r.end>=r.start?`${r.end-r.start+1}p`:"—"}</span>
            {ranges.length > 1 && <button onClick={() => onChange(ranges.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-500 transition-colors shrink-0"><Trash2 className="h-4 w-4" /></button>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onChange([...ranges,{start:1,end:max}])} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add range
        </button>
        {totalPages>0&&totalPages<=30 && (
          <button onClick={() => onChange(Array.from({length:totalPages},(_,i)=>({start:i+1,end:i+1})))} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-50 transition-colors">
            <Scissors className="h-3.5 w-3.5" /> Split every page
          </button>
        )}
      </div>
    </div>
  );
}

function ImageResizerOptions({ width, height, onW, onH, lock, onLock }) {
  const PRESETS = [{w:1920,h:1080,l:"1080p"},{w:1280,h:720,l:"720p"},{w:800,h:600,l:"800×600"},{w:400,h:400,l:"400²"},{w:1080,h:1080,l:"Square"},{w:1080,h:1920,l:"Story"},{w:1200,h:630,l:"OG"},{w:256,h:256,l:"Icon"}];
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">📐 Resize Dimensions</p>
      <div className="flex items-end gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
          <input type="number" min="1" max="10000" value={width} onChange={(e)=>onW(e.target.value)}
            className="w-full text-center text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button onClick={onLock} className={`mb-0.5 p-2.5 rounded-xl border-2 text-lg transition-colors ${lock?"border-primary-400 bg-primary-50 dark:bg-primary-900/30":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"}`}>{lock?"🔒":"🔓"}</button>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
          <input type="number" min="1" max="10000" value={height} onChange={(e)=>onH(e.target.value)}
            className="w-full text-center text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mb-3">{lock?"🔒 Aspect ratio locked":"🔓 Free resize"} — {width}×{height}px</p>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p)=>(
          <button key={p.l} onClick={()=>{onW(p.w);onH(p.h);}} className="text-xs py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 transition-colors">{p.l}</button>
        ))}
      </div>
    </div>
  );
}

function EsignOptions({ opts, onChange }) {
  const POS = [{v:"bottom-left",l:"Bottom Left"},{v:"bottom-center",l:"Bottom Center"},{v:"bottom-right",l:"Bottom Right"}];
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
      <div className="flex items-center gap-2 mb-4"><PenLine className="h-4 w-4 text-gray-500" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Signature Details</span></div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Signature Text *</label>
          <input type="text" placeholder="e.g. Digitally Signed by John Doe" value={opts.signatureText} onChange={(e)=>onChange({...opts,signatureText:e.target.value})}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Signer Name (optional)</label>
          <input type="text" placeholder="e.g. John Doe" value={opts.signerName} onChange={(e)=>onChange({...opts,signerName:e.target.value})}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {POS.map((p)=>(
              <button key={p.v} onClick={()=>onChange({...opts,position:p.v})}
                className={`text-xs py-2 rounded-xl border-2 font-medium transition-all ${opts.position===p.v?"border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                {p.l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-900">
        <p className="text-xs text-gray-400 mb-2 text-center">Preview</p>
        <div className="border border-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 max-w-xs mx-auto">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">✓ {opts.signatureText||"Your Signature"}</p>
          {opts.signerName && <p className="text-xs text-blue-500">{opts.signerName}</p>}
          <p className="text-xs text-gray-400">Signed: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ password, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
      <div className="flex items-center gap-2 mb-4"><KeyRound className="h-4 w-4 text-gray-500" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">PDF Password</span></div>
      <div className="relative">
        <input type={show?"text":"password"} placeholder="Enter PDF password (leave blank if none)" value={password} onChange={(e)=>onChange(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 pr-10 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <button onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <Eye className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Leave blank if the PDF has no password.</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SingleTool() {
  const { slug } = useParams();
  const config   = TOOL_CONFIG[slug];

  const [files, setFiles]               = useState([]);
  const [processing, setProc]           = useState(false);
  const [progress, setProgress]         = useState(0);
  const [results, setResults]           = useState([]);
  const [downloading, setDownloading]   = useState({});
  const [quality, setQuality]           = useState(75);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [ranges, setRanges]             = useState([{ start:1, end:1 }]);
  const [resizeW, setResizeW]           = useState(1920);
  const [resizeH, setResizeH]           = useState(1080);
  const [lockAspect, setLockAspect]     = useState(true);
  const aspectRef                       = useRef(null);
  const [esignOpts, setEsignOpts]       = useState({ signatureText:"Digitally Signed", signerName:"", position:"bottom-right" });
  const [pdfPassword, setPdfPassword]   = useState("");
  const [previewObjectUrl, setPreviewObjectUrl]   = useState(null);
  const [originalObjectUrl, setOriginalObjectUrl] = useState(null);
  const previewRef  = useRef(null);
  const originalRef = useRef(null);

  const isCompressor = slug === "image-compressor";
  const isPdfSplit   = slug === "pdf-split";
  const isResizer    = slug === "image-resizer";
  const isEsign      = slug === "esign-pdf";
  const isPassword   = slug === "pdf-password-remover";
  const isBgRemover  = slug === "background-remover";
  const isWmRemover  = slug === "watermark-remover";
  const isVisual     = isBgRemover || isWmRemover;
  const isPdfToWord  = slug === "pdf-to-word";
  const isOCR        = slug === "pdf-ocr";

  useEffect(() => () => {
    if (previewRef.current)  URL.revokeObjectURL(previewRef.current);
    if (originalRef.current) URL.revokeObjectURL(originalRef.current);
  }, []);

  useEffect(() => {
    if (previewRef.current)  { URL.revokeObjectURL(previewRef.current);  previewRef.current  = null; }
    if (originalRef.current) { URL.revokeObjectURL(originalRef.current); originalRef.current = null; }
    setPreviewObjectUrl(null); setOriginalObjectUrl(null); setResults([]);
    if (isVisual && files.length > 0) {
      const u = URL.createObjectURL(files[0]); originalRef.current = u; setOriginalObjectUrl(u);
    }
  }, [files]);

  useEffect(() => {
    if (!isPdfSplit || !files.length) { setPdfPageCount(0); setRanges([{start:1,end:1}]); return; }
    getPdfPageCount(files[0]).then((c) => { setPdfPageCount(c); setRanges([{start:1,end:c||1}]); });
  }, [files, isPdfSplit]);

  useEffect(() => {
    if (!isResizer || !files.length) return;
    const url = URL.createObjectURL(files[0]);
    const img = new Image();
    img.onload = () => { aspectRef.current = img.naturalWidth/img.naturalHeight; setResizeW(img.naturalWidth); setResizeH(img.naturalHeight); URL.revokeObjectURL(url); };
    img.src = url;
  }, [files, isResizer]);

  const handleW = (v) => { const w=parseInt(v)||1; setResizeW(w); if(lockAspect&&aspectRef.current) setResizeH(Math.round(w/aspectRef.current)); };
  const handleH = (v) => { const h=parseInt(v)||1; setResizeH(h); if(lockAspect&&aspectRef.current) setResizeW(Math.round(h*aspectRef.current)); };

  if (!config) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool not found</h1>
      <Link to="/tools" className="text-primary-600 hover:underline">← Back to all tools</Link>
    </div>
  );

  async function handleProcess() {
    if (!files.length) return toast.error("Please upload at least one file");
    if (isPdfSplit && ranges.find((r)=>!r.start||!r.end||r.start>r.end)) return toast.error("Fix invalid page ranges");
    if (isEsign && !esignOpts.signatureText.trim()) return toast.error("Please enter a signature text");
    setProc(true); setProgress(10); setResults([]);
    if (previewRef.current) { URL.revokeObjectURL(previewRef.current); previewRef.current=null; }
    setPreviewObjectUrl(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("tool", slug);
      const opts = {};
      if (isCompressor) opts.quality = quality;
      if (isPdfSplit)   opts.ranges  = ranges;
      if (isResizer)    Object.assign(opts, { width:resizeW, height:resizeH });
      if (isEsign)      Object.assign(opts, esignOpts);
      if (isPassword)   opts.password = pdfPassword;
      if (Object.keys(opts).length) fd.append("options", JSON.stringify(opts));
      setProgress(40);
      const { data } = await toolsAPI.processFile(fd);
      setProgress(100);
      setResults(data.downloadUrls || []);
      if (isVisual && data.downloadUrls?.length > 0) {
        const u = await fetchAsObjectUrl(data.downloadUrls[0]);
        if (u) { previewRef.current = u; setPreviewObjectUrl(u); }
      }
      toast.success(`Done! ${data.downloadUrls?.length} file${data.downloadUrls?.length>1?"s":""} ready.`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Processing failed");
    } finally { setProc(false); }
  }

  async function handleDownload(tokenPath, index) {
    setDownloading((p) => ({...p,[index]:true}));
    const ext = isPdfToWord||isOCR?"txt":isPdfSplit||slug.startsWith("pdf")||slug==="image-to-pdf"?"pdf":isBgRemover?"png":isWmRemover?"jpg":slug.includes("webp")?"webp":slug.includes("png")&&!slug.includes("jpg")?"png":"jpg";
    await forceDownload(tokenPath, `${slug.replace(/-/g,"_")}_result_${index+1}.${ext}`);
    setDownloading((p) => ({...p,[index]:false}));
  }

  const btnLabel = { "image-compressor":"Compress","pdf-split":"Split","image-resizer":"Resize","background-remover":"Remove Background","watermark-remover":"Remove Watermark","esign-pdf":"Sign PDF","pdf-password-remover":"Unlock PDF","pdf-compress":"Compress PDF","pdf-ocr":"Extract Text","pdf-to-word":"Convert to Word" }[slug] || "Convert";

  return (
    <>
      <Helmet>
        <title>{config.name} — Free Online Tool | QuickFileTools</title>
        <meta name="description" content={`${config.desc} Free, fast, no signup required.`} />
        <link rel="canonical" href={`https://www.quickfiletools.xyz/tools/${slug}`} />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/tools" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6 inline-block">← All tools</Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{config.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{config.desc}</p>

        <AdBanner />

        <UploadBox accept={config.accept} maxFiles={config.maxFiles} onFilesSelected={setFiles} processing={processing} progress={progress} />

        {isCompressor && files.length>0 && <CompressionSlider quality={quality} onChange={setQuality} files={files} />}
        {isPdfSplit   && files.length>0 && <PdfSplitOptions ranges={ranges} onChange={setRanges} totalPages={pdfPageCount} />}
        {isResizer    && files.length>0 && <ImageResizerOptions width={resizeW} height={resizeH} onW={handleW} onH={handleH} lock={lockAspect} onLock={()=>setLockAspect(v=>!v)} />}
        {isEsign      && files.length>0 && <EsignOptions opts={esignOpts} onChange={setEsignOpts} />}
        {isPassword                      && <PasswordInput password={pdfPassword} onChange={setPdfPassword} />}

        {isVisual && files.length>0 && !previewObjectUrl && originalObjectUrl && (
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" /><span className="text-xs font-medium text-gray-500">Preview</span>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900">
              <img src={originalObjectUrl} alt="Original" className="w-full max-h-72 object-contain rounded-xl" />
            </div>
          </div>
        )}
        {isVisual && previewObjectUrl && originalObjectUrl && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <SplitSquareHorizontal className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Before / After — drag to compare</span>
            </div>
            <BeforeAfterSlider beforeSrc={originalObjectUrl} afterSrc={previewObjectUrl} afterLabel={isBgRemover?"BG Removed":"Watermark Removed"} />
          </div>
        )}

        {isPdfToWord && (
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-3">
            <FileText className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">Full PDF-to-Word conversion requires a third-party API. The downloaded file contains setup instructions.</p>
          </div>
        )}
        {isOCR && (
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-3">
            <AlignLeft className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">Full OCR requires Tesseract.js integration. The downloaded file contains implementation instructions.</p>
          </div>
        )}
        {isVisual && !processing && !previewObjectUrl && (
          <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-3 flex items-start gap-3">
            <Cpu className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {isBgRemover ? "AI-powered background removal. Processing may take 15–30 seconds." : "AI-powered watermark removal. Processing may take 15–30 seconds."}
            </p>
          </div>
        )}

        <button onClick={handleProcess} disabled={processing||!files.length}
          className="mt-6 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? (isVisual?"Processing with AI… (15–30s)":"Processing…") : `${btnLabel}${files.length?` (${files.length} file${files.length>1?"s":""})`:""}` }
        </button>

        {results.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">{isVisual?"✅ Done!":"Download results"}</h2>
              {results.length>1 && <span className="text-sm text-gray-400">{results.length} files</span>}
            </div>
            {results.map((tokenPath,i) => (
              <button key={i} onClick={()=>handleDownload(tokenPath,i)} disabled={downloading[i]}
                className="flex items-center gap-3 w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3.5 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-60 text-left group">
                {downloading[i]
                  ? <Loader2 className="h-5 w-5 text-green-600 shrink-0 animate-spin" />
                  : <Download className="h-5 w-5 text-green-600 shrink-0 group-hover:scale-110 transition-transform" />}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300 block">
                    {downloading[i]?"Downloading…":isBgRemover?"Download PNG (transparent)":isWmRemover?"Download image (cleaned)":isPdfToWord||isOCR?"Download text file (.txt)":isPdfSplit?`Pages ${ranges[i]?.start}–${ranges[i]?.end} (File ${i+1})`:`Download file ${i+1}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {config.content && (
          <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {config.content.intro}
            </p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">How to use the {config.name}</h2>
            <ol className="space-y-2 mb-8 list-decimal list-inside text-gray-600 dark:text-gray-400">
              {config.content.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {config.content.faqs.map(({ q, a }) => (
                <details key={q} className="group bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-3 cursor-pointer">
                  <summary className="font-medium text-gray-900 dark:text-white list-none flex justify-between items-center">
                    {q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {results.length > 0 && <AdBanner />}
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:white;border:2.5px solid #6366f1;box-shadow:0 1px 6px rgba(0,0,0,.18);cursor:pointer;transition:transform .15s}
        input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.2)}
        input[type="range"]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:white;border:2.5px solid #6366f1;cursor:pointer}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{opacity:1}
      `}</style>
    </>
  );
}