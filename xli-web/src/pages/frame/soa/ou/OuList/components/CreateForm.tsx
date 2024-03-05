import React, {useEffect} from 'react';
import {ModalForm, ProFormDigit, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Form} from "antd";
import {FormProps} from "@/services/data";
import {add, fetchOuTree} from '../service';
import {fetchTree} from "@/pages/frame/ui/menu/RouterList/service";
import ProTreeSelect from "@/components/ProTreeSelect";


const CreateForm: React.FC<FormProps> = (props) => {
  const {modalVisible, params, onSubmit, onCancel} = props;

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      if (formValues.pid) {
        formValues.pid = formValues.pid.value;
      } else {
        formValues.pid = params?.pid;
      }

      await onSubmit(await add({...formValues}));//把结果回调给父页面
    } catch (error) {
      console.error("表单提交出错:", error);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);

  return (
    <ModalForm
      title="添加部门"
      width={'60vw'}
      form={form}
      open={modalVisible}
      grid={true}
      rowProps={{
        gutter: [16, 0]
      }}
      onOpenChange={
        (visible) => {
          if (!visible) {
            onCancel();
          }
        }
      }
      onFinish={handleSubmit}>
      <ProTreeSelect
        rootName={"所属部门"}
        name="pid"
        label="所属部门"
        allowClear
        secondary
        request={
          async () => {
            return await fetchOuTree({id: "", text: ""});
          }
        }
        labelCol={{md: 3, xl: 3}}
        colProps={{md: 24, xl: 24}}
        fieldProps={{
          filterTreeNode: true,
          showSearch: true,
          popupMatchSelectWidth: false,
          labelInValue: true,
          autoClearSearchValue: true,
          multiple: false,
          treeNodeFilterProp: 'title',
          fieldNames: {
            label: 'text',
            value: 'id'
          },
          defaultValue: params?.pid
        }}/>
      <ProFormText
        rules={[{required: true, message: '部门名称为必填项'}]}
        name="ouName"
        label="部门名称"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormText
        name="ouCode"
        label="部门编号"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormText
        name="ouShortname"
        label="部门简称"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormText
        name="tel"
        label="联系电话"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormTextArea
        label="简介"
        name="description"
        placeholder="请输入简介"/>
      <ProFormDigit
        label="排序值"
        name="orderNum"
        min={0}
        max={99999}
        initialValue={0}
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
    </ModalForm>);
};

export default CreateForm;
