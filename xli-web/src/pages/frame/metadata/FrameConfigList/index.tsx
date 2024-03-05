import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, message, Modal, TreeProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {add, remove, search} from './service';
import type {FrameConfigDTO} from "./data";
import Pagination from 'antd/lib/pagination';
import {ProCard} from "@ant-design/pro-components";
import ProTree from "@/components/ProTree";
import {fetchTree} from "@/pages/frame/ui/menu/RouterList/service";

const FrameConfigList: React.FC<{ selectedKey: string }> = ({selectedKey}) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<FrameConfigDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [pid, setPid] = useState<string>('');
  const [treeRefreshFlag, setTreeRefreshFlag] = useState<boolean>(false);
  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys) {
      setPid(String(selectedKeys[0]));
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<FrameConfigDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '参数名称', dataIndex: 'configName',
      formItemProps: {
        rules: [{
          required: true,
          message: '此项为必填项',
        }]
      }
    },
    {
      title: '参数值', dataIndex: 'configValue',
      formItemProps: {
        rules: [{
          required: true,
          message: '此项为必填项',
        }]
      }
    },
    {
      title: '参数描述', dataIndex: 'description', search: false
    },
    {
      title: '排序', dataIndex: 'orderNum', search: false,
      valueType: 'digit',
      formItemProps: {
        rules: [{
          required: true,
          message: '排序值不能为空',
        }],
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="delete"
          style={{color: 'red'}}
          onClick={
            () => {
              Modal.confirm({
                title: '确认删除',
                content: '您确定要删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const resultVO = await remove([record]);
                  if (resultVO.code === '1') {
                    message.success(resultVO.msg);
                    actionRef.current?.reload();
                  } else {
                    message.error(resultVO.msg);
                  }
                },
                onCancel: () => {
                  // 用户点击取消按钮时触发的回调
                }
              })
            }
          }
        >
          删除
        </a>
      ],
    }
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [selectedKey]);

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="20%">
          <ProTree
            rootName={"参数分类"}
            switcherIcon={<DownOutlined/>}
            onSelect={handleTreeSelect}
            request={
              async () => {
                if (treeRefreshFlag) {
                  //打开新增页面时。不需要刷新左侧树。关闭时才刷新
                  setTreeRefreshFlag(false); // 重置 treeRefreshFlag
                  return await fetchTree({id: "", text: ""})
                }
              }
            }/>
        </ProCard>
        <ProCard>
          <EditableProTable<FrameConfigDTO, Pagination>
            headerTitle="参数列表"
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={
              async (params) => {
                const resultVO = await search({
                  ...params,
                  categoryId: selectedKey,
                  sort: 'descend',
                  filter: 'order_num'
                });
                if (resultVO.code === '1') {
                  return resultVO.data;
                } else {
                  message.error(resultVO.msg);
                }
              }}
            search={{
              labelWidth: 'auto',
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '1000'],
              onChange: (page) => setCurrentPage(page)
            }}
            toolBarRender={
              () => [
                <Button
                  type="primary"
                  key="id"
                  onClick={
                    () => {
                      actionRef.current?.addEditRecord?.({
                        id: (Math.random() * 1000000).toFixed(0),
                        orderNum: 0
                      });
                    }
                  }>
                  <PlusOutlined/> 新建
                </Button>,
              ]
            }
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
            editable={{
              form,
              editableKeys,
              onSave: async (_, newRow) => {
                const resultVO = await add(newRow);
                if (resultVO.code === '1') {
                  actionRef.current?.reload();
                } else {
                  message.error(resultVO.msg);
                }
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
            recordCreatorProps={false}/>
          {selectedRowsState?.length > 0 && (
            <FooterToolbar
              extra={<div> 已选择{' '}<a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}项</div>}>
              <Button
                danger
                onClick={
                  async () => {
                    const resultVO = await remove(selectedRowsState);
                    if (resultVO.code === '1') {
                      message.success(resultVO.msg);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    } else {
                      message.error(resultVO.msg);
                    }
                  }
                }>批量删除
              </Button>
            </FooterToolbar>)}
        </ProCard>
      </ProCard>
    </PageContainer>);
};
export default FrameConfigList;
