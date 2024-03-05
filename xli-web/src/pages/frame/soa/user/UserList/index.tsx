import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, message, Modal, TreeProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import {getGenderModel, getIsEnabledModel, remove, search} from './service';
import type {FrameUserDTO} from './data';
import {SelectItemEnum} from "@/components/ProSelectItem/data";
import CreateForm from './components/CreateForm';
import {Pagination} from "@/services/data";
import {ProCard} from "@ant-design/pro-components";
import ProTree from "@/components/ProTree";
import {fetchTree} from "@/pages/frame/ui/menu/RouterList/service";
import {fetchOuTree} from "@/pages/frame/soa/ou/OuList/service";


const UserList: React.FC<{ selectedKey: string }> = ({selectedKey}) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<FrameUserDTO>();
  const [selectedRowsState, setSelectedRows] = useState<FrameUserDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  //代码项
  const [genderCode, setGenderCode] = useState<SelectItemEnum>({});
  const fetchGenderCode = async () => {
    const selectItemList = await getGenderModel();
    setGenderCode(selectItemList);
  };

  const [isEnabledCode, setIsEnabledCode] = useState<SelectItemEnum>({});
  const fetchIsEnabledCode = async () => {
    const selectItemList = await getIsEnabledModel();
    setIsEnabledCode(selectItemList);
  };

  const [treeRefreshFlag, setTreeRefreshFlag] = useState<boolean>(false);

  const [ouId, setOuId] = useState<string>('');
  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys) {
      setOuId(String(selectedKeys[0]));
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<FrameUserDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '姓名', dataIndex: 'displayName',
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
      title: '账号', dataIndex: 'loginId'
    },
    {
      title: '性别', dataIndex: 'gender',
      hideInForm: true,
      hideInSearch:true
    },
    {
      title: '部门', dataIndex: 'ouName',
      hideInSearch: true
    },
    {
      title: '手机号', dataIndex: 'mobile',
      hideInSearch: true
    },
    {
      title: '账号状态', dataIndex: 'isEnabled',
      hideInSearch:true
    },
    {
      title: '操作', valueType: 'option',
      render: (_, entity) => [
        <a key="edit" onClick={
          () => {
            setCurrentRow(entity);
            handleUpdateModalVisible(true);
          }
        }>编辑
        </a>,
        <Divider key={"key"} type="vertical"/>,
        <a key="delete" style={{color: 'red'}} onClick={
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
                  actionRef.current?.reloadAndRest?.();
                } else {
                  message.error(resultVO.msg);
                }
              },
              onCancel: () => {
                // 用户点击取消按钮时触发的回调
              }
            })
          }
        }>
          删除
        </a>
      ]
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
            rootName={"所属部门"}
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
          <ProTable<FrameUserDTO, Pagination>
            headerTitle="用户列表"
            actionRef={actionRef}
            rowKey="id"
            request={
              async (params) => {
                return await search({...params, ouId: ouId, sort: 'descend', filter: 'order_num'});
              }
            }
            columns={columns}
            onChange={(pagination) => setCurrentPage(pagination.current || 1)}
            search={{
              labelWidth: 'auto',
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '1000'],
            }}
            toolBarRender={
              () => [
                <Button type="primary" key="id"
                        onClick={
                          () => {
                            handleModalVisible(true);
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
            }}/>
          {selectedRowsState?.length > 0 && (
            <FooterToolbar
              extra={<div> 已选择{' '}<a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}项</div>}
              portalDom={false}>
              <Button danger onClick={
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
          <CreateForm
            modalVisible={createModalVisible}
            params={[{ouId: ouId}]}
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
            id={currentRow?.id || ''}
            extValues={[]}
            onSubmit={
              async (resultVO) => {
                if (resultVO.code === '1') {
                  handleUpdateModalVisible(false);
                  setCurrentRow(undefined);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                } else {
                  message.error(resultVO.msg);
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
            onClose={() => {
              setCurrentRow(undefined);
              setShowDetail(false);
            }}
            closable={false}
          >
            {currentRow?.id && (
              <ProDescriptions<FrameUserDTO>
                column={2}
                title={currentRow?.displayName}
                request={
                  async () => (
                    {data: currentRow || {}}
                  )
                }
                params={{
                  id: currentRow?.id,
                }}
                columns={columns as ProDescriptionsItemProps<FrameUserDTO>[]}
              />)
            }
          </Drawer>
        </ProCard>
      </ProCard>
    </PageContainer>);
};

export default UserList;
