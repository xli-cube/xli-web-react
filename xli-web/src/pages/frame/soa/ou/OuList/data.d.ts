import {SearchDTO} from "@/services/data";

export interface OuDTO {
  id?: string;
  ouCode?: string;
  ouName?: string;
  ouShortname?: string;
  tel?: string;
  orderNum?: number;
  description?: string;
  pid?: string;
}

export interface OuSearchDTO extends SearchDTO{
  ouName?: string;
  pid?: string;
}
