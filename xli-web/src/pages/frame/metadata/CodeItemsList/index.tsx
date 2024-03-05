import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, message, Modal, TreeProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {add, remove, search} from './service';
import type {CodeItemsDTO} from './data';
import Pagination from "rc-pagination";
import {ProCard} from "@ant-design/pro-components";
import ProTree from "@/components/ProTree";
import {fetchTree} from "@/pages/frame/ui/menu/RouterList/service";

const CodeItemsList: React.FC<{ selectedKey: string, selectedCodeId: string }> = ({selectedKey, selectedCodeId}) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<CodeItemsDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [treeRefreshFlag, setTreeRefreshFlag] = useState<boolean>(false);

  const [pid, setPid] = useState<string>('');

  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys) {
      setPid(String(selectedKeys[0]));
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<CodeItemsDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '代码文本', dataIndex: 'itemText'
    },
    {
      title: '代码值', dataIndex: 'itemValue'
    },
    {
      title: '排序', dataIndex: 'orderNum', hideInSearch: true,
      valueType: 'digit'
    },
    {
      title: '操作', valueType: 'option',
      render: (_, entity) => [
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
                  const resultVO = await remove([entity]);
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
      ]
    }
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [selectedKey, selectedCodeId]);

  return (
    <PageContainer title={false} breadcrumb={{routes: []}}>
      <ProCard split="vertical">
        <ProCard colSpan="20%">
          <ProTree
            rootName={"所有菜单"}
            switcherIcon={<DownOutlined/>}
            onSelect={handleTreeSelect}
            request={
              async () => {
                if ( treeRefreshFlag) {
                  //打开新增页面时。不需要刷新左侧树。关闭时才刷新
                  setTreeRefreshFlag(false); // 重置 treeRefreshFlag
                  return await fetchTree({id: "", text: ""})
                }
              }
            }/>
        </ProCard>
        <ProCard>
          <EditableProTable<CodeItemsDTO, Pagination>
            headerTitle="代码子项"
            actionRef={actionRef}
            rowKey="id"
            request={
              async (params) => {
                const resultVO = await search({
                  ...params,
                  pid: selectedKey,
                  codeId: selectedCodeId,
                  sort: 'descend',
                  filter: 'order_num'
                });
                if (resultVO.code === '1') {
                  return resultVO.data;
                }
              }
            }
            columns={columns}
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
                        pid: selectedKey,
                        orderNum: 0
                      });
                    }
                  }>
                  <PlusOutlined/> 新建
                </Button>
              ]
            }
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              }
            }}
            editable={{
              form,
              editableKeys,
              onSave: async (_, newRow) => {
                await add({...newRow, codeId: selectedCodeId});
                actionRef.current?.reload();
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
                  }}>批量删除
              </Button>
            </FooterToolbar>)}
        </ProCard>
      </ProCard>
    </PageContainer>);
};
export default CodeItemsList;
