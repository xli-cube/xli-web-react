import type {CodeMainDTO} from './data';
import request from "@/utils/request";
import type {BaseParam, ResultVO} from "@/services/data";

export async function search(
  params: CodeMainDTO & BaseParam
) {
  return request<ResultVO>('/rest/codeMain/search', {
    method: 'POST',
    data: params
  });
}

export async function add(data: CodeMainDTO) {
  return request<ResultVO>('/rest/codeMain/add', {
    method: 'POST',
    data
  });
}

export async function remove(codeMainDTO: CodeMainDTO[]) {
  const ids = codeMainDTO.filter(row => row.id !== undefined).map(row => row.id!)
  return request<ResultVO>('/rest/codeMain/delete', {
    method: 'POST',
    data: ids
  });
}
