export interface FrameAttachInfoDTO extends UploadFile{
  id?: string;
  fileName?: string;
  fileSize?: number;
  groupId?: string;
}

export interface FrameAttachInfoVO {
  id: string;
  fileName: string;
  fileSize: number;
  groupId: string;
  url?: string;
}
