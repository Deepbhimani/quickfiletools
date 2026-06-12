import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { toolsAPI } from "../services/api";

export function useFileProcessor(tool) {
  const [files, setFiles]       = useState([]);
  const [processing, setProc]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults]   = useState([]);
  const [error, setError]       = useState(null);

  const process = useCallback(async (options = {}) => {
    if (!files.length) return toast.error("Please upload at least one file");
    setProc(true);
    setProgress(15);
    setError(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("tool", tool);
      fd.append("options", JSON.stringify(options));
      setProgress(50);
      const { data } = await toolsAPI.processFile(fd);
      setProgress(100);
      setResults(data.downloadUrls || []);
      toast.success("Done! Your file is ready.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProc(false);
    }
  }, [files, tool]);

  const reset = () => { setFiles([]); setResults([]); setProgress(0); setError(null); };

  return { files, setFiles, processing, progress, results, error, process, reset };
}
