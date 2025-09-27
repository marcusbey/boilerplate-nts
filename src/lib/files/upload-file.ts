type UploadFileParams = {
  file: File;
  path: string;
};

export type UploadFileAdapter = {
  uploadFile: (params: UploadFileParams) => Promise<
    | {
        error: null;
        data: {
          url: string;
        };
      }
    | {
        error: Error;
        data: null;
      }
  >;
  uploadFiles: (params: UploadFileParams[]) => Promise<
    {
      error: Error | null;
      data: {
        url: string;
      } | null;
    }[]
  >;
};
