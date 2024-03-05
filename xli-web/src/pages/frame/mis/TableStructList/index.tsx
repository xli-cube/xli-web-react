import {PlusOutlined} from '@ant-design/icons';
import {Button, Form, message, Modal} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {add, getCodeMainList, remove, search} from './service';
import type {TableStructDTO} from './data';
import {getCodeItemsByCodeName} from "@/pages/frame/metadata/CodeItemsList/service";
import {convertSelectItemToEnum} from "@/components/ProSelectItem/util";
import Pagination from "rc-pagination";

const TableStructList: React.FC<{ selectedTableId: string }> = ({selectedTableId}) => {
  const actionRef = useRef<ActionType>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [fieldType, setFieldType] = useState<Record<string, { text: string; status: string }>>({});
  const fetchFieldType = async () => {
    const selectItemList = await getCodeItemsByCodeName('字段类型');
    setFieldType(convertSelectItemToEnum(selectItemList));
  };

  const [showInTable, setShowInTable] = useState<Record<string, { text: string; status: string }>>({});
  const fetchShowInTable = async () => {
    const selectItemList = await getCodeItemsByCodeName('是否');
    setShowInTable(convertSelectItemToEnum(selectItemList));
  };

  const [notNull, setNotNull] = useState<Record<string, { text: string; status: string }>>({});
  const fetchNotNull = async () => {
    const selectItemList = await getCodeItemsByCodeName('是否');
    setNotNull(convertSelectItemToEnum(selectItemList));
  };

  const [showInSearch, setShowInSearch] = useState<Record<string, { text: string; status: string }>>({});
  const fetchShowInSearch = async () => {
    const selectItemList = await getCodeItemsByCodeName('是否');
    setShowInSearch(convertSelectItemToEnum(selectItemList));
  };

  const [showInDetail, setShowInDetail] = useState<Record<string, { text: string; status: string }>>({});
  const fetchShowInDetail = async () => {
    const selectItemList = await getCodeItemsByCodeName('是否');
    setShowInDetail(convertSelectItemToEnum(selectItemList));
  };

  const [codeId, setCodeId] = useState<Record<string, { text: string; status: string }>>({});
  const fetchCodeId = async () => {
    const selectItemList = await getCodeMainList();
    setCodeId(convertSelectItemToEnum(selectItemList));
  };

  const [controlType, setControlType] = useState<Record<string, { text: string; status: string }>>({});
  const fetchControlType = async () => {
    const selectItemList = await getCodeItemsByCodeName('控件类型');
    setControlType(convertSelectItemToEnum(selectItemList));
  };

  const columns: ProColumns<TableStructDTO>[] = [
    {
      title: '序', dataIndex: 'index', valueType: 'index',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '英文名称', dataIndex: 'fieldNameEn'
    },
    {
      title: '中文名称', dataIndex: 'fieldNameCn'
    },
    {
      title: '字段类型', dataIndex: 'fieldType',
      valueType: 'select',
      valueEnum: fieldType
    },
    {
      title: '控件类型', dataIndex: 'controlType', hideInSearch: true,
      valueType: 'select',
      valueEnum: controlType
    },
    {
      title: '数据代码', dataIndex: 'codeId', hideInSearch: true,
      valueType: 'select',
      valueEnum: codeId
    },
    {
      title: '必填项', dataIndex: 'notnull', hideInSearch: true,
      valueType: 'select',
      valueEnum: notNull
    },
    {
      title: '列表页', dataIndex: 'showInTable', hideInSearch: true,
      valueType: 'select',
      valueEnum: showInTable
    },
    {
      title: '详情页', dataIndex: 'showInDetail', hideInSearch: true,
      valueType: 'select',
      valueEnum: showInDetail
    },
    {
      title: '搜索', dataIndex: 'showInSearch', hideInSearch: true,
      valueType: 'select',
      valueEnum: showInSearch
    },
    {
      title: '排序', dataIndex: 'orderNum', hideInSearch: true,
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '排序值必填',
          },
        ],
      }
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
    fetchFieldType().then();
    fetchShowInTable().then();
    fetchShowInDetail().then();
    fetchShowInSearch().then();
    fetchNotNull().then();
    fetchCodeId().then();
    fetchControlType().then();
  }, [selectedTableId]);

  return (
    <PageContainer>
      <EditableProTable<TableStructDTO, Pagination>
        headerTitle="字段列表"
        actionRef={actionRef}
        rowKey="id"
        request={
          async (params) => {
            const resultVO = await search({
              ...params,
              tableId: selectedTableId,
              sort: 'descend',
              filter: 'order_num'
            });
            if (resultVO.code === '1') {
              return resultVO.data;
            } else {
              message.error(resultVO.msg);
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
                    tableId: selectedTableId,
                    orderNum: 0
                  });
                }
              }>
              <PlusOutlined/> 新建
            </Button>
          ]
        }
        editable={{
          form,
          editableKeys,
          onSave: async (_, newRow) => {
            await add({...newRow, tableId: selectedTableId});
            actionRef.current?.reload();
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        recordCreatorProps={false}
      />
    </PageContainer>);
};
export default TableStructList;
