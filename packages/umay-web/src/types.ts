export type FileWithStatus = {
  file: File;
  loading: boolean;
  resultData: Uint8Array | null;
  error: string | null;
};
