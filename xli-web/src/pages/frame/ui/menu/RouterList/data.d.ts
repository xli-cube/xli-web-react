import {SearchDTO} from "@/services/data";

export interface RouterDTO {
  id: string;
  menuName?: string;
  path?: string;
  component?: string;
  pid?: string;
  icon?: string;
}

export interface RouterSearchDTO extends SearchDTO{
  menuName?: string;
  pid?:string;
}
