import {FrameUserDTO} from './data';
import request from "@/utils/request";
import {ResultVO} from "@/services/data";
import {convertSelectItemToEnum} from "@/components/ProSelectItem/util";

export async function search(params?: FrameUserDTO) {
  return request<ResultVO>('/rest/frameUser/search', {
    method: 'POST',
    data: params
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function add(data: FrameUserDTO) {
  return request<ResultVO>('/rest/frameUser/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: FrameUserDTO[]) {
  const frameUserDTO = dto.filter(row => row.id !== undefined).map(row => ({id: row.id}));
  return request<ResultVO>('/rest/frameUser/delete', {
    method: 'POST',
    frameUserDTO
  });
}

export async function update(data: FrameUserDTO) {
  return request<ResultVO>('/rest/frameUser/update', {
    method: 'POST',
    data
  });
}

export async function detail(id: string) {
  return request<ResultVO>('/rest/frameUser/detail', {
    method: 'POST',
    data: {
      id: id
    }
  }).then(resultVO => {
    if (resultVO.code === '1') {
      return resultVO.data;
    }
    return {};
  });
}

export async function getGenderModel() {
  return request<ResultVO>('/rest/frameUser/getGenderModel', {
    method: 'POST'
  }).then(resultVO => {
      return resultVO.data;
  });
}

export async function getIsEnabledModel() {
  return request<ResultVO>('/rest/frameUser/getIsEnabledModel', {
    method: 'POST'
  }).then(resultVO => {
    if (resultVO.code === '1') {
      return convertSelectItemToEnum(resultVO.data);
    }
    return {};
  });
}
