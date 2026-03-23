import { downloadFileApi } from "@/api/mesaagesApi";

export const downloadFile = async (
  url: string,
  onProgress: (percent: number) => void) => {
  const res =  await downloadFileApi(url, onProgress);
  return res;
};
