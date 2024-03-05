import React, {useEffect} from 'react';
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import {Form} from "antd";
import {FormProps} from "@/services/data";
import {ProFormDigit, ProFormRadio} from '@ant-design/pro-components';
import {
  detail,
  fetchTree,
  getEnabledModel,
  getRouterTypeModel,
  getVisibleModel,
  update
} from "@/pages/frame/ui/menu/RouterList/service";
import ProTreeSelect from "@/components/ProTreeSelect";


const UpdateForm: React.FC<FormProps> = (props) => {
  const {modalVisible, params, onSubmit, onCancel} = props;
  const [form] = Form.useForm();

  const handleDetail = async () => {
    const formValues = await detail(params?.['id']);
    //查询详情，渲染表单
    form.setFieldsValue(formValues);
  }

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      //把树控件的对象，转换成选中的value，而不是提交整个对象
      if (formValues.pid) {
        formValues.pid = formValues.pid.value;
      }
      formValues.id = params?.['id'];

      await onSubmit(await update({...formValues}));
    } catch (error) {
      console.error("表单提交出错:", error);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
      handleDetail();
    }
  }, [modalVisible]);

  return (
    <ModalForm
      title="修改菜单"
      width={'60vw'}
      form={form}
      open={modalVisible}
      layout={'horizontal'}
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
        rootName={"所有菜单"}
        name="pid"
        label="上级菜单"
        allowClear
        secondary
        request={
          async () => {
            return await fetchTree({id: "", text: ""});
          }
        }
        labelCol={{md: 3, xl: 3}}
        colProps={{md: 24, xl: 24}}
        fieldProps={{
          showArrow: true,
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
          }
        }}/>
      <ProFormText
        name="menuName"
        label="菜单名称"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormRadio.Group
        name="routerType"
        label="路由类型"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
        request={
          async () => {
            return await getRouterTypeModel();
          }
        }/>
      <ProFormText
        name="icon"
        label="菜单图标"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormText
        name="path"
        label="路由地址"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}/>
      <ProFormText
        name="component"
        label="组件路径"
        labelCol={{md: 3, xl: 3}}
        colProps={{md: 24, xl: 24}}/>
      <ProFormRadio.Group
        name="visible"
        label="是否显示"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
        required={true}
        request={
          async () => {
            return await getVisibleModel();
          }
        }/>
      <ProFormRadio.Group
        name="enabled"
        label="是否禁用"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
        required={true}
        request={
          async () => {
            return await getEnabledModel();
          }
        }/>
      <ProFormDigit
        name="orderNum"
        label="排序"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
        min={0}
        max={9999}
        initialValue={0}/>
    </ModalForm>);
};

export default UpdateForm;
