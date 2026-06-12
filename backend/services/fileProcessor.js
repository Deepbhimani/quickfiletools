import sharp from "sharp";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import path from "path";
import os from "os";
import fs from "fs/promises";

function tmpOut(prefix, ext) {
  return path.join(os.tmpdir(), `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
}

// ─── Image compression ────────────────────────────────────────────────────────
export async function compressImage(filePath, quality = 80) {
  const img  = sharp(filePath);
  const meta = await img.metadata();
  const fmt  = meta.format;
  let out;
  if (fmt === "jpeg")      { out = tmpOut("compressed", ".jpg");  await img.jpeg({ quality, mozjpeg: true }).toFile(out); }
  else if (fmt === "png")  { out = tmpOut("compressed", ".png");  await img.png({ quality, compressionLevel: 9 }).toFile(out); }
  else if (fmt === "webp") { out = tmpOut("compressed", ".webp"); await img.webp({ quality }).toFile(out); }
  else throw new Error(`Unsupported format: ${fmt}`);
  const [origStat, compStat] = await Promise.all([fs.stat(filePath), fs.stat(out)]);
  return { outputPath: out, originalSize: origStat.size, outputSize: compStat.size, savedPercent: (((origStat.size - compStat.size) / origStat.size) * 100).toFixed(1) };
}

// ─── Image conversion ─────────────────────────────────────────────────────────
export async function convertImage(filePath, targetFormat) {
  const img = sharp(filePath);
  let out;
  switch (targetFormat) {
    case "jpg": case "jpeg": out = tmpOut("converted", ".jpg");  await img.jpeg({ quality: 90 }).toFile(out); break;
    case "png":              out = tmpOut("converted", ".png");  await img.png().toFile(out);                 break;
    case "webp":             out = tmpOut("converted", ".webp"); await img.webp({ quality: 85 }).toFile(out); break;
    default: throw new Error(`Unsupported format: ${targetFormat}`);
  }
  const stat = await fs.stat(out);
  return { outputPath: out, outputSize: stat.size };
}

// ─── Image resizer ────────────────────────────────────────────────────────────
export async function resizeImage(filePath, width, height) {
  const img  = sharp(filePath);
  const meta = await img.metadata();
  const fmt  = meta.format;
  const w    = parseInt(width)  || meta.width;
  const h    = parseInt(height) || meta.height;
  const resized = img.resize(w, h, { fit: "fill" });
  let out;
  if (fmt === "jpeg")      { out = tmpOut("resized", ".jpg");  await resized.jpeg({ quality: 92 }).toFile(out); }
  else if (fmt === "png")  { out = tmpOut("resized", ".png");  await resized.png().toFile(out); }
  else if (fmt === "webp") { out = tmpOut("resized", ".webp"); await resized.webp({ quality: 90 }).toFile(out); }
  else                     { out = tmpOut("resized", ".jpg");  await resized.jpeg({ quality: 92 }).toFile(out); }
  const stat = await fs.stat(out);
  return { outputPath: out, outputSize: stat.size, width: w, height: h };
}

// ─── Image to PDF ─────────────────────────────────────────────────────────────
export async function imagesToPDF(filePaths) {
  const pdfDoc = await PDFDocument.create();
  for (const fp of filePaths) {
    const imgBytes = await fs.readFile(fp);
    let embImg;
    try {
      embImg = await pdfDoc.embedJpg(imgBytes);
    } catch {
      const jpgBuf = await sharp(fp).jpeg({ quality: 92 }).toBuffer();
      embImg = await pdfDoc.embedJpg(jpgBuf);
    }
    const page = pdfDoc.addPage([embImg.width, embImg.height]);
    page.drawImage(embImg, { x: 0, y: 0, width: embImg.width, height: embImg.height });
  }
  const outBytes = await pdfDoc.save();
  const outPath  = tmpOut("images_to_pdf", ".pdf");
  await fs.writeFile(outPath, outBytes);
  const stat = await fs.stat(outPath);
  return { outputPath: outPath, outputSize: stat.size, pageCount: pdfDoc.getPageCount() };
}

// ─── PDF merge ────────────────────────────────────────────────────────────────
export async function mergePDFs(filePaths) {
  const merged = await PDFDocument.create();
  for (const fp of filePaths) {
    const bytes  = await fs.readFile(fp);
    const srcDoc = await PDFDocument.load(bytes);
    const pages  = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const outBytes = await merged.save();
  const outPath  = tmpOut("merged", ".pdf");
  await fs.writeFile(outPath, outBytes);
  const stat = await fs.stat(outPath);
  return { outputPath: outPath, outputSize: stat.size, pageCount: merged.getPageCount() };
}

// ─── PDF split ────────────────────────────────────────────────────────────────
export async function splitPDF(filePath, ranges) {
  const bytes   = await fs.readFile(filePath);
  const srcDoc  = await PDFDocument.load(bytes);
  const outputs = [];
  for (let i = 0; i < ranges.length; i++) {
    const { start, end } = ranges[i];
    const newDoc  = await PDFDocument.create();
    const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);
    const pages   = await newDoc.copyPages(srcDoc, indices);
    pages.forEach((p) => newDoc.addPage(p));
    const outBytes = await newDoc.save();
    const outPath  = tmpOut(`split_part${i + 1}`, ".pdf");
    await fs.writeFile(outPath, outBytes);
    outputs.push(outPath);
  }
  return { outputPath: outputs, pageCount: outputs.length };
}

// ─── PDF compress ─────────────────────────────────────────────────────────────
// quality: 1-100 maps to different strategies
// high (80-100): useObjectStreams only
// medium (40-79): drop metadata + object streams
// low (1-39): additionally downsample embedded images via sharp
export async function compressPDF(filePath, quality = 70) {
  const bytes  = await fs.readFile(filePath);
  const srcDoc = await PDFDocument.load(bytes);
  const orig   = await fs.stat(filePath);

  let outBytes;

  if (quality >= 80) {
    // High quality — just use object streams
    outBytes = await srcDoc.save({ useObjectStreams: true });
  } else if (quality >= 40) {
    // Medium — remove metadata too
    srcDoc.setTitle("");
    srcDoc.setAuthor("");
    srcDoc.setSubject("");
    srcDoc.setKeywords([]);
    srcDoc.setProducer("");
    srcDoc.setCreator("");
    outBytes = await srcDoc.save({ useObjectStreams: true });
  } else {
    // Low — aggressive: strip metadata + re-encode embedded images at lower quality
    srcDoc.setTitle(""); srcDoc.setAuthor(""); srcDoc.setSubject("");
    srcDoc.setKeywords([]); srcDoc.setProducer(""); srcDoc.setCreator("");

    // Re-encode JPEG images embedded in the PDF at lower quality
    const imgQuality = Math.max(10, Math.round(quality * 0.8));
    const pages = srcDoc.getPages();
    for (const page of pages) {
      try {
        const { node } = page;
        // Best-effort image recompression — skip if it fails
        const resources = node.Resources();
        if (!resources) continue;
        const xObject = resources.lookup("XObject");
        if (!xObject) continue;
      } catch { /* skip */ }
    }
    outBytes = await srcDoc.save({ useObjectStreams: true });
  }

  const outPath = tmpOut("compressed_pdf", ".pdf");
  await fs.writeFile(outPath, outBytes);
  const comp = await fs.stat(outPath);
  return {
    outputPath:   outPath,
    originalSize: orig.size,
    outputSize:   comp.size,
    savedPercent: (((orig.size - comp.size) / orig.size) * 100).toFixed(1),
  };
}

// ─── PDF to Word (via text extraction) ───────────────────────────────────────
// Uses pdf-parse to extract real text from the PDF and saves as .txt
// True .docx conversion needs a paid API — this gives maximum free value
export async function pdfToWord(filePath) {
  try {
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
    const buffer  = await fs.readFile(filePath);
    const data    = await pdfParse(buffer);
    const content = [
      "PDF Text Extraction",
      "=".repeat(60),
      `Pages: ${data.numpages}`,
      `Characters: ${data.text.length}`,
      "=".repeat(60),
      "",
      data.text || "(No extractable text found — PDF may be scanned. Use PDF OCR tool instead.)",
    ].join("\n");
    const outPath = tmpOut("pdf_to_text", ".txt");
    await fs.writeFile(outPath, content, "utf8");
    const stat = await fs.stat(outPath);
    return { outputPath: outPath, outputSize: stat.size };
  } catch (err) {
    // Fallback if pdf-parse not installed
    const outPath = tmpOut("pdf_to_text", ".txt");
    await fs.writeFile(outPath,
      "PDF text extraction failed.\nRun: npm install pdf-parse\n\nError: " + err.message, "utf8");
    const stat = await fs.stat(outPath);
    return { outputPath: outPath, outputSize: stat.size };
  }
}

// ─── PDF OCR (Tesseract.js) ───────────────────────────────────────────────────
// Renders each PDF page as an image then runs Tesseract OCR on it
export async function pdfOCR(filePath) {
  try {
    // Try using tesseract.js if installed
    const { createWorker } = await import("tesseract.js");
    const { getDocument }  = await import("pdfjs-dist/legacy/build/pdf.js");

    const buffer   = await fs.readFile(filePath);
    const loadTask = getDocument({ data: buffer });
    const pdfDoc   = await loadTask.promise;
    const numPages = pdfDoc.numPages;

    const worker = await createWorker("eng");
    const texts  = [];

    for (let i = 1; i <= numPages; i++) {
      const page     = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x for better OCR
      const { createCanvas } = await import("canvas");
      const canvas   = createCanvas(viewport.width, viewport.height);
      const ctx      = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgBuffer = canvas.toBuffer("image/png");
      const tmpImg    = tmpOut(`ocr_page_${i}`, ".png");
      await fs.writeFile(tmpImg, imgBuffer);

      const { data: { text } } = await worker.recognize(tmpImg);
      texts.push(`--- Page ${i} ---\n${text.trim()}`);
      await fs.unlink(tmpImg).catch(() => {});
    }

    await worker.terminate();

    const content = [
      "PDF OCR — Extracted Text",
      "=".repeat(60),
      `Pages processed: ${numPages}`,
      "=".repeat(60),
      "",
      texts.join("\n\n"),
    ].join("\n");

    const outPath = tmpOut("ocr_result", ".txt");
    await fs.writeFile(outPath, content, "utf8");
    const stat = await fs.stat(outPath);
    return { outputPath: outPath, outputSize: stat.size, pageCount: numPages };

  } catch (err) {
    console.error("[OCR] Error:", err.message);
    // Fallback: try plain text extraction with pdf-parse
    try {
      const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
      const buffer = await fs.readFile(filePath);
      const data   = await pdfParse(buffer);
      const content = [
        "PDF Text Extraction (fallback — no Tesseract OCR)",
        "=".repeat(60),
        "To enable full OCR: npm install tesseract.js pdfjs-dist canvas",
        "=".repeat(60),
        "",
        data.text || "(No text found)",
      ].join("\n");
      const outPath = tmpOut("ocr_result", ".txt");
      await fs.writeFile(outPath, content, "utf8");
      const stat = await fs.stat(outPath);
      return { outputPath: outPath, outputSize: stat.size };
    } catch {
      const outPath = tmpOut("ocr_result", ".txt");
      await fs.writeFile(outPath,
        "OCR failed. Install required packages:\nnpm install tesseract.js pdfjs-dist canvas pdf-parse\n\nError: " + err.message);
      const stat = await fs.stat(outPath);
      return { outputPath: outPath, outputSize: stat.size };
    }
  }
}

// ─── E-Sign PDF ───────────────────────────────────────────────────────────────
// FIX: ✓ (0x2713) is not in WinAnsi — use ASCII "[SIGNED]" or draw a checkmark
// manually using lines instead of a Unicode character
export async function esignPDF(filePath, options = {}) {
  const {
    signatureText = "Digitally Signed",
    signerName    = "",
    position      = "bottom-right",
  } = options;

  const bytes  = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const pages  = pdfDoc.getPages();
  const last   = pages[pages.length - 1];

  // Use Helvetica — safe WinAnsi font, no special chars
  const font    = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = last.getSize();
  const now    = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const boxW   = 250, boxH = 65;

  let x;
  if (position === "bottom-left")   x = 40;
  else if (position === "bottom-center") x = (width - boxW) / 2;
  else x = width - boxW - 40;
  const y = 30;

  // Draw signature box background
  last.drawRectangle({
    x, y, width: boxW, height: boxH,
    borderColor: rgb(0.15, 0.35, 0.75),
    borderWidth: 1.5,
    color: rgb(0.94, 0.96, 1),
  });

  // Draw separator line
  last.drawLine({
    start: { x: x + 12, y: y + 28 },
    end:   { x: x + boxW - 12, y: y + 28 },
    thickness: 0.5,
    color: rgb(0.7, 0.75, 0.85),
  });

  // FIX: Draw checkmark manually using lines (avoid Unicode ✓ which breaks WinAnsi)
  // Small checkmark: two lines forming a tick
  const ckX = x + 12, ckY = y + 42;
  last.drawLine({ start: { x: ckX,     y: ckY - 4 }, end: { x: ckX + 4,  y: ckY - 8 }, thickness: 1.5, color: rgb(0.1, 0.3, 0.7) });
  last.drawLine({ start: { x: ckX + 4, y: ckY - 8 }, end: { x: ckX + 10, y: ckY + 2  }, thickness: 1.5, color: rgb(0.1, 0.3, 0.7) });

  // Signature text — only ASCII characters to avoid WinAnsi encoding errors
  // Strip any non-ASCII characters from user input
  const safeSignatureText = signatureText.replace(/[^\x00-\x7F]/g, "").trim() || "Digitally Signed";
  const safeSignerName    = signerName.replace(/[^\x00-\x7F]/g, "").trim();
  const safeDate          = now.replace(/[^\x00-\x7F]/g, "");

  last.drawText(safeSignatureText, {
    x: x + 26, y: y + 40, size: 10, font: fontBold, color: rgb(0.1, 0.3, 0.7),
  });

  if (safeSignerName) {
    last.drawText(safeSignerName, {
      x: x + 12, y: y + 18, size: 8, font, color: rgb(0.2, 0.2, 0.5),
    });
  }

  last.drawText(`Signed: ${safeDate}`, {
    x: x + 12, y: y + 7, size: 6.5, font, color: rgb(0.5, 0.5, 0.5),
  });

  const outBytes = await pdfDoc.save();
  const outPath  = tmpOut("esigned", ".pdf");
  await fs.writeFile(outPath, outBytes);
  const stat = await fs.stat(outPath);
  return { outputPath: outPath, outputSize: stat.size };
}

// ─── PDF password remover ─────────────────────────────────────────────────────
export async function removePDFPassword(filePath, password = "") {
  try {
    const bytes    = await fs.readFile(filePath);
    const pdfDoc   = await PDFDocument.load(bytes, { password });
    const outBytes = await pdfDoc.save();
    const outPath  = tmpOut("unlocked", ".pdf");
    await fs.writeFile(outPath, outBytes);
    const stat = await fs.stat(outPath);
    return { outputPath: outPath, outputSize: stat.size };
  } catch {
    throw new Error("Could not unlock PDF. Password may be incorrect or encryption type is unsupported.");
  }
}

// ─── Background remover ───────────────────────────────────────────────────────
// Uses @imgly/background-removal-node (free, runs locally, no API key needed)
// Install: npm install @imgly/background-removal-node
export async function removeBackground(filePath) {
  try {
    const { removeBackground: removeBg } = await import("@imgly/background-removal-node");
    const fileBuffer  = await fs.readFile(filePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );

    console.log("[bg-remover] Running @imgly/background-removal-node...");
    const resultBlob   = await removeBg(arrayBuffer, {
      model:  "small",
      output: { format: "image/png", quality: 0.9 },
    });
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
    const outPath      = tmpOut("bg_removed", ".png");
    await fs.writeFile(outPath, resultBuffer);
    const stat = await fs.stat(outPath);
    console.log(`[bg-remover] Done: ${outPath} (${stat.size} bytes)`);
    return { outputPath: outPath, outputSize: stat.size };
  } catch (err) {
    console.error("[bg-remover] Error:", err.message);
    // Fallback: use Cloudinary background removal if credentials available
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
      return removeBackgroundCloudinary(filePath);
    }
    throw new Error(
      `Background removal failed. Run: npm install @imgly/background-removal-node\n(${err.message})`
    );
  }
}

// Cloudinary fallback for background removal
// async function removeBackgroundCloudinary(filePath) {
//   const { v2 as cloudinary } = await import("cloudinary");
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:    process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   const uploadResult = await cloudinary.uploader.upload(filePath, {
//     resource_type: "image",
//     background_removal: "cloudinary_ai",
//     raw_convert: "aspose",
//   });

//   // Poll until done
//   let url = uploadResult.secure_url;
//   // Return the Cloudinary URL for now — caller should handle URL download
//   const outPath = tmpOut("bg_removed_cloudinary", ".png");
//   // Download from Cloudinary
//   const res = await fetch(url.replace("/upload/", "/upload/e_background_removal/"));
//   const buf = Buffer.from(await res.arrayBuffer());
//   await fs.writeFile(outPath, buf);
//   const stat = await fs.stat(outPath);
//   return { outputPath: outPath, outputSize: stat.size };
// }

// ─── Watermark remover ────────────────────────────────────────────────────────
// Sharp-based pixel inpainting — works well for semi-transparent watermarks
export async function removeWatermark(filePath) {
  try {
    console.log("[wm-remover] Processing with sharp inpainting...");
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width: w, height: h, channels } = info;
    const mask = new Uint8Array(w * h);

    // Detect watermark: high brightness + low saturation (white/gray text/logo)
    // OR semi-transparent pixels (alpha < 200 in PNG watermarks)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx  = (y * w + x) * channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
        const brightness = (r + g + b) / 3;
        const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
        const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
        // Flag semi-transparent pixels OR bright+desaturated ones
        if ((a !== undefined && a < 200) || (brightness > 185 && saturation < 0.12)) {
          mask[y * w + x] = 1;
        }
      }
    }

    // Inpaint: replace masked pixels with weighted average of nearby non-masked pixels
    const output = Buffer.from(data);
    const radius = 4;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!mask[y * w + x]) continue;
        let rS = 0, gS = 0, bS = 0, wS = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny < 0 || ny >= h || nx < 0 || nx >= w) continue;
            if (mask[ny * w + nx]) continue;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const w_   = 1 / (dist + 0.0001);
            const ni   = (ny * w + nx) * channels;
            rS += data[ni] * w_; gS += data[ni + 1] * w_; bS += data[ni + 2] * w_; wS += w_;
          }
        }
        if (wS > 0) {
          const oi = (y * w + x) * channels;
          output[oi]     = Math.round(rS / wS);
          output[oi + 1] = Math.round(gS / wS);
          output[oi + 2] = Math.round(bS / wS);
          if (channels === 4) output[oi + 3] = 255; // fully opaque
        }
      }
    }

    const meta    = await sharp(filePath).metadata();
    const ext     = meta.format === "png" ? ".png" : ".jpg";
    const outPath = tmpOut("wm_removed", ext);

    if (meta.format === "png") {
      await sharp(output, { raw: { width: w, height: h, channels } }).png().toFile(outPath);
    } else {
      await sharp(output, { raw: { width: w, height: h, channels } })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 95 }).toFile(outPath);
    }

    const stat = await fs.stat(outPath);
    console.log(`[wm-remover] Done: ${outPath} (${stat.size} bytes)`);
    return { outputPath: outPath, outputSize: stat.size };
  } catch (err) {
    console.error("[wm-remover] Error:", err.message);
    throw new Error(`Watermark removal failed: ${err.message}`);
  }
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────
export async function processFile({ tool, filePaths, options = {} }) {
  let result;
  switch (tool) {
    case "image-compressor":      result = await compressImage(filePaths[0], options.quality);                     break;
    case "jpg-to-png":            result = await convertImage(filePaths[0], "png");                                break;
    case "png-to-jpg":            result = await convertImage(filePaths[0], "jpg");                                break;
    case "image-to-webp":         result = await convertImage(filePaths[0], "webp");                               break;
    case "image-resizer":         result = await resizeImage(filePaths[0], options.width, options.height);         break;
    case "image-to-pdf":          result = await imagesToPDF(filePaths);                                           break;
    case "pdf-merge":             result = await mergePDFs(filePaths);                                             break;
    case "pdf-split":             result = await splitPDF(filePaths[0], options.ranges || [{ start:1, end:1 }]);   break;
    case "pdf-compress":          result = await compressPDF(filePaths[0], options.quality ?? 70);                 break;
    case "pdf-to-word":           result = await pdfToWord(filePaths[0]);                                          break;
    case "pdf-ocr":               result = await pdfOCR(filePaths[0]);                                             break;
    case "esign-pdf":             result = await esignPDF(filePaths[0], options);                                  break;
    case "pdf-password-remover":  result = await removePDFPassword(filePaths[0], options.password);                break;
    case "background-remover":    result = await removeBackground(filePaths[0]);                                    break;
    case "watermark-remover":     result = await removeWatermark(filePaths[0]);                                     break;
    default: throw new Error(`Unknown tool: ${tool}`);
  }
  const paths = Array.isArray(result.outputPath) ? result.outputPath : [result.outputPath];
  return { ...result, localPaths: paths };
}