import {SelectItem, SelectItemEnum} from "@/components/ProSelectItem/data";


export function convertSelectItem(selectItemList: { value: string, text: string }[]) {
  const list: SelectItem[] = [];

  selectItemList.forEach(selectItem => {
    list.push({
      label: selectItem.text,
      value: selectItem.value,
    });
  });
  return list;
}

export function convertSelectItemToEnum(selectItemList: { value: string, text: string, status: string }[]) {
  const enumObject: SelectItemEnum = {};

  selectItemList.forEach(selectItem => {
    enumObject[selectItem.value] = {
      text: selectItem.text,
      status: selectItem.status
    };
  });
  return enumObject;
}
