import request from "@/utils/request";
import {ResultVO} from "@/services/data";
import {FrameAttachInfoDTO, FrameAttachInfoVO} from "@/components/ProUpload/data";

export async function chunkInit(frameAttachInfoDTO: FrameAttachInfoDTO
) {
  return request<ResultVO>("/rest/attach/chunkInit", {
    method: 'POST',
    data: frameAttachInfoDTO
  })
}

export async function chunkUpload(formData: FormData) {
  return request<ResultVO>("/rest/attach/chunkUpload", {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    data: formData
  })
}

export async function chunkFinish(frameAttachInfoDTO: FrameAttachInfoDTO) {
  return request<ResultVO>("/rest/attach/chunkFinish", {
    method: 'POST',
    data: frameAttachInfoDTO
  })
}

export async function fetchAttachList(frameAttachInfoDTO: FrameAttachInfoDTO) {
  return request<ResultVO>("/rest/attach/getAttachList", {
    method: 'POST',
    data: frameAttachInfoDTO
  }).then(resultVO => {
    if (resultVO.code === '1') {
      return resultVO.data.map(
        (vo: FrameAttachInfoVO) => ({
          uid: vo.id,
          attachId: vo.id,
          name: vo.fileName,
          url: vo.url,
          status: "done"
        })
      );
    }
    return [];
  })
}

export async function removeAttach(frameAttachInfoDTO: FrameAttachInfoDTO
) {
  return request<ResultVO>("/rest/attach/delete", {
    method: 'POST',
    data: frameAttachInfoDTO
  })
}
