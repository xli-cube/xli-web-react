import {PlusOutlined} from '@ant-design/icons';
import {Button, Form, message, Modal} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {add, remove, search} from './service';
import type {CodeMainDTO} from "./data";
import Pagination from "rc-pagination";
import CodeItemsList from "@/pages/frame/metadata/CodeItemsList";

const CodeMainList: React.FC<{ selectedKey: string }> = ({selectedKey}) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<CodeMainDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [showCodeItemsModal, setShowCodeItemsModal] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<string>('');

  const columns: ProColumns<CodeMainDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '代码名称', dataIndex: 'codeName',
      formItemProps: {
        rules: [{
          required: true,
          message: '此项为必填项',
        }]
      }
    },
    {
      title: '说明', dataIndex: 'description', search: false
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
        <a key="open" onClick={() => {
          setSelectedCodeId(record.id!);
          setShowCodeItemsModal(true);
        }}
        > 代码子项
        </a>,
        <a key="delete" style={{color: 'red'}} onClick={
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
        }>删除
        </a>
      ],
    }
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, []);

  return (
    <PageContainer>
      <EditableProTable<CodeMainDTO, Pagination>
        headerTitle="代码列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={
          async (params) => {
            const resultVO = await search({...params, categoryId: selectedKey, sort: 'descend', filter: 'order_num'});
            if (resultVO.code === '1') {
              return resultVO.data;
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
            <Button type="primary" key="id" onClick={
              () => {
                actionRef.current?.addEditRecord?.({
                  id: (Math.random() * 1000000).toFixed(0),
                  codeName: '',
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
          }
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (_, newRow) => {
            const resultVO = await add(newRow);
            if (resultVO.code === '1') {
              message.success(resultVO.msg);
              actionRef.current?.reload();
            } else {
              message.error(resultVO.msg);
            }
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        recordCreatorProps={false}
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
                } else {
                  message.error(resultVO.msg);
                }
              }
            }>批量删除
          </Button>
        </FooterToolbar>)}
      <Modal
        title="代码子项"
        width={'80vw'}
        open={showCodeItemsModal}
        onCancel={
          () => {
            setShowCodeItemsModal(false);
            setSelectedCodeId('');
          }
        }
        footer={null}>
        <CodeItemsList selectedCodeId={selectedCodeId}/>
      </Modal>
    </PageContainer>);
};
export default CodeMainList;
