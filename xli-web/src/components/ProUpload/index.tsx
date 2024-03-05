import {message, UploadFile} from "antd";
import React, {useEffect, useState} from "react";
import {chunkFinish, chunkInit, fetchAttachList, removeAttach} from "@/components/ProUpload/service";
import {ProFormUploadButton} from "@ant-design/pro-form";
import {RcFile} from "antd/es/upload";
import {request} from "@umijs/max";
import SparkMD5 from "spark-md5";
import {FrameAttachInfoDTO} from "@/components/ProUpload/data";
import {UploadListType} from "antd/es/upload/interface";

interface ChunkUploadProps {
  label?: string;
  name: string;
  groupId: string;
  title?: string;
  max?: number;
  accept?: string;
  listType?: UploadListType;
  onFinish: (groupId: string) => void;
}

const ProUpload: React.FC<ChunkUploadProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const CHUNK_SIZE = 128 * 1024; // 128KB

  const handleSearch = async () => {
    if (props.groupId) {
      const attachInfoList = await fetchAttachList({groupId: props.groupId});
      setFileList(attachInfoList);
    }
  }

  const handleRemove = async (file: FrameAttachInfoDTO) => {
    const resultVO = await removeAttach({id: file.id});
    if (resultVO.code === '1') {
      handleSearch();
      message.success(resultVO.msg);
    } else {
      message.error(resultVO.msg);
    }
  }

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(
        (resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as RcFile);
          reader.onload = () => resolve(reader.result as string);
        }
      );
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleUpload = (options: any) => {
    const {file, onSuccess, onError} = options;
    const spark = new SparkMD5.ArrayBuffer();
    const uploadPromises: Promise<any>[] = [];

    const uploadChunk = async () => {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      try {
        const resultVO = await chunkInit(
          {
            fileName: file.name,
            fileSize: file.size,
            groupId: props.groupId
          });
        if (resultVO.code === '1') {
          const attachId = resultVO.data.id;
          for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const chunkBuffer = await chunk.arrayBuffer();
            spark.append(chunkBuffer);

            const formData = new FormData();
            formData.append('fileName', resultVO.data.fileName);
            formData.append('fileSize', resultVO.data.fileSize);
            formData.append('fileMD5', spark.end());
            formData.append('fileBlockSqNo', chunkIndex.toString());
            formData.append('attachId', attachId);
            formData.append('chunk', chunk);
            //循环分片，把每个分片都上传
            //await chunkUpload(formData);
            uploadPromises.push(
              request('/rest/attach/chunkUpload', {method: 'POST', data: formData})
            );
          }
          await Promise.all(uploadPromises);

          const result = await chunkFinish({
            id: attachId,
            fileName: file.name,
            fileSize: file.size,
            groupId: resultVO.data.groupId
          });
          if (result.code === '1') {
            onSuccess(); // 分片上传成功后，调用 onSuccess 通知 ProFormUploadButton
            props.onFinish(result.data.groupId);//把附件组件的groupId回传给父组件
            message.success(result.msg);
          } else {
            onError(); // 分片上传失败后，调用 onError 通知 ProFormUploadButton
            message.error(result.msg);
          }
        } else {
          onError(); // 分片上传失败后，调用 onError 通知 ProFormUploadButton
          message.error(resultVO.msg);
        }
      } catch (error) {
        onError();
        message.error('文件上传失败');
      }

    }

    uploadChunk().then();

    return {
      abort: () => {
        // 取消上传时的操作
      }
    };
  };

  const handleChange = ({fileList: files}: { fileList: UploadFile[] }) => {
    setFileList(files);
  };

  // 在组件挂载时调用 handleShow
  useEffect(() => {
    handleSearch().then();
  }, [props.groupId]); // 仅在 groupId 改变时重新获取附件

  return (
    <ProFormUploadButton
      label={props.label}
      name={props.name}
      title={props.title}
      max={props.max}
      fileList={fileList}
      onChange={handleChange}
      fieldProps={{
        accept: props.accept,
        listType: props.listType,
        headers: {'Content-Type': 'multipart/form-data'},
        customRequest: handleUpload,
        onRemove: handleRemove,
        onPreview: handlePreview
      }}
      initialValue={[]}
    />
  );
}

export default ProUpload;
