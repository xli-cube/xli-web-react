export interface TreeNodeDTO {
  id: string;
  text: string;
  children?:TreeNodeDTO[]
}

