import { useRef, useState } from "react";
import { handleUpload } from "@/services/uploadService";
import { sendMessageSocket } from "@/sockets/events/chatEvents";
import { toast } from "sonner";

export const useFileUpload = (conversationId: string, userId: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadAndSend = async (text: string) => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const { key, uploadId, name } = await handleUpload(
        selectedFile,
        conversationId,
        userId,
        (percent) => setUploadProgress(percent),
      );

      sendMessageSocket({
        conversationId,
        content: text.trim() || null,
        senderId: userId,
        fileUrl: key,
        uploadId,
        filename: name,
      });

      clearFile();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Upload failed");
      } else {
        console.log("Something went wrong");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
   
  };

  return {
    fileInputRef,
    selectedFile,
    uploading,
    uploadProgress,
    handleFileSelect,
    clearFile,
    uploadAndSend,
  };
};
