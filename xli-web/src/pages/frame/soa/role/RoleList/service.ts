import type {FrameRoleDTO} from './data';
import request from "@/utils/request";
import type {ResultVO} from "@/services/data";

export async function search(
  params?: FrameRoleDTO
) {
  return request<ResultVO>('/rest/frameRole/search', {
    method: 'POST',
    data: params
  });
}

export async function add(data: FrameRoleDTO) {
  return request<ResultVO>('/rest/frameRole/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: FrameRoleDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!);
  return request<ResultVO>('/rest/frameRole/delete', {
    method: 'POST',
    data: ids
  });
}
