import {TableStructDTO} from './data';
import request from "@/utils/request";
import {BaseParam, ResultVO} from "@/services/data";

export async function search(
  params: TableStructDTO & BaseParam
) {
  return request<ResultVO>('/rest/tableStruct/search', {
    method: 'POST',
    data: params
  });
}

export async function getCodeMainList(
) {
  return request<ResultVO>('/rest/tableStruct/getCodeMainList', {
    method: 'POST',
    data: {}
  }).then(resultVO => {
    if (resultVO.code === '1') {
      return resultVO.data;
    }
    return [];
  });
}

export async function add(data: TableStructDTO) {
  return request<ResultVO>('/rest/tableStruct/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: TableStructDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!);
  return request<ResultVO>('/rest/tableStruct/delete', {
    method: 'POST',
    data: ids
  });
}
