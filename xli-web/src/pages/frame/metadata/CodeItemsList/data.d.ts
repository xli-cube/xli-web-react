export type CodeItemsModelDTO = {
  modelName: string;
  codeName: string;
  hasInitValue: boolean;
}

export type CodeItemsDTO = {
  id?: string;
  itemValue?: string;
  itemText?: string;
  codeId?: string;
  orderNum?: number;
  pid?: string;
};
