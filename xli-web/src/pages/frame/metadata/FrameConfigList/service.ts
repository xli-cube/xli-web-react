import request from "@/utils/request";
import type {ResultVO} from "@/services/data";
import {FrameConfigDTO} from "./data";

export async function search(
  params: FrameConfigDTO
) {
  return request<ResultVO>('/rest/frameConfig/search', {
    method: 'POST',
    data: params
  });
}

export async function add(data: FrameConfigDTO) {
  return request<ResultVO>('/rest/frameConfig/add', {
    method: 'POST',
    data
  });
}

export async function remove(dto: FrameConfigDTO[]) {
  const ids = dto.filter(row => row.id !== undefined).map(row => row.id!);
  return request<ResultVO>('/rest/frameConfig/delete', {
    method: 'POST',
    data: ids
  });
}
