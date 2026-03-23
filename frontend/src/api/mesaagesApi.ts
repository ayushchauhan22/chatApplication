import api from "./axios";
import axios from "axios";

export const getMessagesApi = (conversationId: string, page = 1) => {
  return api.get(`/messages/${conversationId}?page=${page}`);
};

export const getUploadUrlApi = (filename: string, mimetype: string) => {
  return api.get(`/file/upload-url`, { params: { filename, mimetype } });
};

export const presignedUrlApi = (id: string) => {
  return api.get(`/file/download/${id}`);
};

export const saveFileMetadataApi = (data: {
  filename: string;
  key: string;
  mimetype: string;
  size: number;
  conversationId: string;
  senderId: string;
}) => {
  return api.post(`/file/save`, data);
};

export const downloadFileApi = async (
  url: string,
  onProgress: (percent: number) => void,
): Promise<Blob> => {
  const res = await axios.get(url, {
    responseType: "blob",
    onDownloadProgress: (e) => {
      if (e.total) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    },
  });
  return res.data;
};

export const uploadFileApi = async (
  file: File,
  conversationId: string,
  senderId: string,
  onProgress: (percent: number) => void,
): Promise<{ key: string; uploadId: string; name: string }> => {
  const { data } = await getUploadUrlApi(file.name, file.type);
  console.log(data);
  
  const { key, uploadUrl } = data;

  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (e) => {
      if (e.total) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    },
  });

  
  const saved = await saveFileMetadataApi({
    filename: file.name,
    key,
    mimetype: file.type,
    size: file.size,
    conversationId,
    senderId,
  });

  return { key, uploadId: saved.data._id, name: saved.data.filename };
};

export const deleteMessageApi = (messageId: string) =>
  api.delete(`/messages/${messageId}`);