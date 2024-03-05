import {ResultVO} from "@/services/data";
import {ProTableResult} from "@/components/ProTable/data";

export function convertProTableVO(resultVO: ResultVO): ProTableResult {
  if (resultVO.code === '1') {
    return {
      success: true,
      total: resultVO.data.total,
      data: resultVO.data.list
    };
  }
  return {
    success: false,
    total: 0,
    data: []
  };
}

