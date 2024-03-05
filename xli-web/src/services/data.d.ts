export interface PageDTO {
  current: number;
  pageSize: number;
}

export interface SearchDTO extends PageDTO {
  filter?: string;
  sort?: 'descend' | 'ascend';
}

export interface Pagination extends PageDTO {
  total: number;
}

export interface ResultVO {
  code: string;
  msg: string;
  data: any;
}


export type FormProps = {
  modalVisible: boolean;
  params?: Record<string, any>;
  onSubmit: (resultVO: ResultVO) => Promise<void>;
  onCancel: () => void;
};
