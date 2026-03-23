import { uploadFileApi} from "@/api/mesaagesApi";

export const handleUpload = async (
  file: File,
  conversationId: string,
  senderId: string,
  onProgress: (percent: number) => void,
): Promise<{ key: string; uploadId: string , name: string}> => {
  return uploadFileApi(file, conversationId, senderId, onProgress)
};
