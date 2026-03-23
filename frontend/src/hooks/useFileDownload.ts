import { useState } from "react";
import { getPresignedUrlApi } from "@/services/messageServices";
import { downloadFile } from "@/services/downloadService";
import type { MessageInterface } from "@/interfaces/messageInterfaces";
import { toast } from "sonner";

export const useFileDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async (msg: MessageInterface) => {
    
    if (!msg.fileUrl || !msg.uploadId) return;

    try {
      setDownloading(true);
      setDownloadProgress(0);

      const res = await getPresignedUrlApi(msg.uploadId);
      const presignedUrl = res.url;
      
      

      const blob = await downloadFile(presignedUrl, (percent) => {
        setDownloadProgress(percent);
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = msg.fileUrl.split("/").pop()?.split("?")[0] || "file";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Download complete");
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Download failed");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  return { downloading, downloadProgress, handleDownload };
};
