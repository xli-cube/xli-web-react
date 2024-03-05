import {RouterDTO, RouterSearchDTO} from './data';
import request from "@/utils/request";
import type {ResultVO} from "@/services/data";
import {TreeNodeDTO} from "@/components/ProTree/data";

export async function search(params: RouterSearchDTO) {
  return request<ResultVO>('/rest/frameRouter/search', {
    method: 'POST',
    data: params
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function add(data: RouterDTO) {
  return request<ResultVO>('/rest/frameRouter/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: RouterDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!)
  return request<ResultVO>('/rest/frameRouter/delete', {
    method: 'POST',
    data: ids
  });
}

export async function update(data: RouterDTO) {
  return request<ResultVO>('/rest/frameRouter/update', {
    method: 'POST',
    data
  });
}

export async function detail(id: string) {
  return request<ResultVO>('/rest/frameRouter/detail/' + id, {
    method: 'POST',
    data: {}
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function fetchTree(treeNodeDTO?: TreeNodeDTO) {
  return request<ResultVO>('/rest/frameRouter/fetchRouterTree', {
    method: 'POST',
    data: treeNodeDTO
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function getVisibleModel() {
  return request<ResultVO>('/rest/frameRouter/getVisibleModel', {
    method: 'POST'
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function getEnabledModel() {
  return request<ResultVO>('/rest/frameRouter/getEnabledModel', {
    method: 'POST'
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function getRouterTypeModel() {
  return request<ResultVO>('/rest/frameRouter/getRouterTypeModel', {
    method: 'POST'
  }).then(resultVO => {
    return resultVO.data;
  });
}
