import request from "@/utils/request";
import {ResultVO} from "@/services/data";
import {OuDTO, OuSearchDTO} from "@/pages/frame/soa/ou/OuList/data";
import {TreeNodeDTO} from "@/components/ProTree/data";

export async function search(params: OuSearchDTO) {
  return request<ResultVO>('/rest/frameOu/search', {
    method: 'POST',
    data: params
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function add(data: OuDTO) {
  return request<ResultVO>('/rest/frameOu/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: OuDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!)
  return request<ResultVO>('/rest/frameOu/delete', {
    method: 'POST',
    data: ids
  });
}

export async function update(data: OuDTO) {
  return request<ResultVO>('/rest/frameOu/update', {
    method: 'POST',
    data
  });
}

export async function detail(id: string) {
  return request<ResultVO>('/rest/frameOu/detail/' + id, {
    method: 'POST',
    data: {}
  }).then(resultVO => {
    return resultVO.data;
  });
}

export async function fetchOuTree(treeNodeDTO?: TreeNodeDTO) {
  return request<ResultVO>('/rest/frameOu/fetchOuTree', {
    method: 'POST',
    data: treeNodeDTO
  }).then(resultVO => {
    return resultVO.data;
  });
}
