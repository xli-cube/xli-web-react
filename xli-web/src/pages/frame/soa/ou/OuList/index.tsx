import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message, Modal, TreeProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import {fetchOuTree, remove, search} from './service';
import CreateForm from "./components/CreateForm";
import {OuDTO} from "@/pages/frame/soa/ou/OuList/data";
import {Pagination} from "@/services/data";
import {ProCard, ProDescriptions} from "@ant-design/pro-components";
import ProTree from "@/components/ProTree";

const OuList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [treeRefreshFlag, setTreeRefreshFlag] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<OuDTO>();
  const [selectedRowsState, setSelectedRows] = useState<OuDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pid, setPid] = useState<string>('');

  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys) {
      setPid(String(selectedKeys[0]));
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<OuDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '部门名称', dataIndex: 'ouName',
      render: (dom, entity) => {
        return (
          <a onClick={
            () => {
              setCurrentRow(entity);
              setShowDetail(true);
            }
          }>
            {dom}
          </a>
        );
      }
    },
    {
      title: '部门编号', dataIndex: 'ouCode'
    },
    {
      title: '部门简称', dataIndex: 'ouShortname', hideInSearch: true
    },
    {
      title: '联系电话', dataIndex: 'tel', hideInTable: true, hideInSearch: true
    },
    {
      title: '简介', dataIndex: 'description', hideInTable: true, hideInSearch: true
    },
    {
      title: '排序', dataIndex: 'orderNum', hideInSearch: true
    },
    {
      title: '操作', valueType: 'option',
      render: (_, entity) => [
        <a key="edit"
           onClick={
             () => {
               setCurrentRow(entity);
               handleUpdateModalVisible(true);
             }
           }>编辑
        </a>,
        <a key="delete"
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
           }> 删除
        </a>
      ]
    }
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, []);

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="20%">
          <ProTree
            rootName={"所有部门"}
            switcherIcon={<DownOutlined/>}
            onSelect={handleTreeSelect}
            blockNode={true}
            showLine={true}
            request={
              async () => {
                if (!createModalVisible || treeRefreshFlag) {
                  //打开新增页面时。不需要刷新左侧树。关闭时才刷新
                  setTreeRefreshFlag(false); // 重置 treeRefreshFlag
                  return await fetchOuTree({id: "", text: ""})
                }
              }
            }/>
        </ProCard>
        <ProCard>
          <ProTable<OuDTO, Pagination>
            headerTitle="部门列表"
            rowKey="id"
            columns={columns}
            search={{
              labelWidth: 'auto',
            }}
            actionRef={actionRef}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '1000'],
            }}
            request={
              async (params) => {
                return await search({...params, pid: pid, sort: 'descend', filter: 'order_num'});
              }
            }
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              }
            }}
            onChange={(pagination) => setCurrentPage(pagination.current || 1)}
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
            params={[{pid: pid}]}
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
              <ProDescriptions<OuDTO>
                column={2}
                title={currentRow?.ouName}
                request={
                  async () => ({
                    data: currentRow || {}
                  })
                }
                params={{
                  id: currentRow?.id,
                }}
                columns={columns as ProDescriptionsItemProps<OuDTO>[]}
              />)
            }
          </Drawer>
        </ProCard>
      </ProCard>
    </PageContainer>);
};

export default OuList;
