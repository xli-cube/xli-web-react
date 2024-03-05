import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message, Modal, TreeProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {fetchTree, remove, search} from './service';
import {RouterDTO} from "./data";
import {ProCard, ProTable} from '@ant-design/pro-components';
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import CreateForm from "@/pages/frame/ui/menu/RouterList/components/CreateForm";
import UpdateForm from './components/UpdateForm';
import ProTree from '@/components/ProTree';
import {Pagination} from "@/services/data";

const RouterList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [treeRefreshFlag, setTreeRefreshFlag] = useState<boolean>(false);


  const [currentRow, setCurrentRow] = useState<RouterDTO>();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<RouterDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pid, setPid] = useState<string>('');

  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys) {
      setPid(String(selectedKeys[0]));
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<RouterDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => {
        if (actionRef.current && actionRef.current.pageInfo) {
          return (currentPage - 1) * actionRef.current.pageInfo.pageSize + index + 1;
        }
      }
    },
    {
      title: '菜单名称', dataIndex: 'menuName', formItemProps: {
        rules: [{
          required: true, message: '菜单名称必填',
        }]
      }
    },
    {
      title: '路径', dataIndex: 'path', search: false, formItemProps: {
        rules: [{
          required: true, message: '路径必填',
        }]
      }
    },
    {
      title: '排序', dataIndex: 'orderNum', search: false, valueType: 'digit', formItemProps: {
        rules: [{
          required: true, message: '排序必填',
        }],
      }
    },
    {
      title: '操作', valueType: 'option', render: (_, record) => [
        <a key="edit"
           onClick={
             () => {
               setCurrentRow(record);
               handleUpdateModalVisible(true);
             }
           }> 编辑</a>,
        <a key="delete"
           style={{color: 'red'}}
           onClick={() => {
             Modal.confirm({
               title: '确认删除',
               content: '您确定要删除吗？',
               okText: '确认',
               cancelText: '取消',
               onOk: async () => {
                 await remove([record]).then(resultVO => {
                   if (resultVO.code === '1') {
                     message.success(resultVO.msg);
                     actionRef.current?.reload();
                     setTreeRefreshFlag(true); // 设置 treeRefreshFlag 为 true
                   }
                 });
               }, onCancel: () => {
                 // 用户点击取消按钮时触发的回调
               }
             })
           }}>删除</a>]
    }];

  useEffect(() => {
    actionRef.current?.reload();
  }, []);

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="20%">
          <ProTree
            rootName={"所有菜单"}
            switcherIcon={<DownOutlined/>}
            onSelect={handleTreeSelect}
            request={
              async () => {
                if (!createModalVisible || treeRefreshFlag) {
                  //打开新增页面时。不需要刷新左侧树。关闭时才刷新
                  setTreeRefreshFlag(false); // 重置 treeRefreshFlag
                  return await fetchTree({id: "", text: ""})
                }
              }
            }/>
        </ProCard>
        <ProCard>
          <ProTable<RouterDTO, Pagination>
            headerTitle="菜单列表"
            rowKey="id"
            columns={columns}
            search={{
              labelWidth: 'auto',
            }}
            actionRef={actionRef}
            pagination={{
              onChange: (page) => setCurrentPage(page)
            }}
            request={async (params) => {
              return await search({...params, pid: pid, sort: 'descend', filter: 'order_num'});
            }}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              }
            }}
            toolBarRender={
              () => [
                <Button type="primary" key="id" onClick={
                  () => {
                    handleModalVisible(true);
                  }}>
                  <PlusOutlined/> 新建
                </Button>
              ]
            }
          />
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
                    }
                  }
                }>批量删除
              </Button>
            </FooterToolbar>
          )}
          <CreateForm
            modalVisible={createModalVisible}
            params={{pid: pid}}
            onSubmit={
              async (resultVO) => {
                if (resultVO.code === '1') {
                  handleModalVisible(false);
                  message.success(resultVO.msg);
                  actionRef.current?.reload();
                }
              }
            }
            onCancel={
              () => {
                handleModalVisible(false);
              }
            }/>
          <UpdateForm
            modalVisible={updateModalVisible}
            params={{id: currentRow?.id || ''}}
            onSubmit={
              async (resultVO) => {
                if (resultVO.code === '1') {
                  handleUpdateModalVisible(false);
                  setCurrentRow(undefined);
                  message.success(resultVO.msg);
                  actionRef.current?.reload();
                }
              }
            }
            onCancel={
              () => {
                handleUpdateModalVisible(false);
                if (!showDetail) {
                  setCurrentRow(undefined);
                }
              }
            }/>
          <Drawer
            width={600}
            open={showDetail}
            closable={false}
            onClose={
              () => {
                setCurrentRow(undefined);
                setShowDetail(false);
              }
            }>
            {currentRow?.id && (
              <ProDescriptions<RouterDTO>
                column={2}
                title={currentRow?.menuName}
                request={
                  async () => ({
                    data: currentRow || {}
                  })
                }
                params={{
                  id: currentRow?.id,
                }}
                columns={columns as ProDescriptionsItemProps<RouterDTO>[]}
              />
            )}
          </Drawer>
        </ProCard>
      </ProCard>
    </PageContainer>);
};
export default RouterList;
