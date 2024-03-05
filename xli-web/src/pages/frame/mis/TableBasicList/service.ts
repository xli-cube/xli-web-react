import type {TableBasicDTO} from './data';
import request from "@/utils/request";
import type {BaseParam, ResultVO} from "@/services/data";

export async function search(
  params: TableBasicDTO & BaseParam
) {
  return request<ResultVO>('/rest/tableBasic/search', {
    method: 'POST',
    data: params
  });
}

export async function add(data: TableBasicDTO) {
  return request<ResultVO>('/rest/tableBasic/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: TableBasicDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!)
  return request<ResultVO>('/rest/tableBasic/delete', {
    method: 'POST',
    data: ids
  });
}

export async function generateCode(dto: TableBasicDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!)
  return request<ResultVO>('/rest/tableBasic/generateCode', {
    method: 'POST',
    data: ids
  });
}
