import {CodeItemsDTO, CodeItemsModelDTO} from './data';
import request from "@/utils/request";
import {ResultVO} from "@/services/data";

export async function search(
  params: CodeItemsDTO
) {
  return request<ResultVO>('/rest/codeItems/search', {
    method: 'POST',
    data: params
  });
}

export async function add(data: CodeItemsDTO) {
  return request<ResultVO>('/rest/codeItems/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: CodeItemsDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!);
  return request<ResultVO>('/rest/codeItems/delete', {
    method: 'POST',
    data: ids
  });
}

export async function getCodeItemsByCodeName(
  codeName: string,
  initEmpty?: boolean
) {
  return request<ResultVO>('/rest/codeItems/getCodeItemsByCodeName', {
    method: 'POST',
    data: {
      codeName: codeName,
      hasInitValue: initEmpty
    }
  }).then(resultVO => {
    if (resultVO.code === '1') {
      return resultVO.data;
    }
    return [];
  });
}

export async function getCodeItemsOptionByCodeName(
  params: CodeItemsModelDTO
) {
  return request<ResultVO>('/rest/codeItems/getCodeItemsOptionByCodeName', {
    method: 'POST',
    data: params
  });
}
