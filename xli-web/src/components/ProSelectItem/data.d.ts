export interface SelectItem {
  label: string;
  value: string;
}

export interface SelectItemEnum {
  [key: string]: {
    text: string;
    status: string;
  };
}
