import React, {useEffect, useState} from 'react';
import {ModalForm, ProFormDatePicker, ProFormRadio, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Form} from "antd";
import {FormProps} from "@/services/data";
import {add, getGenderModel} from '../service';
import ProUpload from '@/components/ProUpload';
import ProTreeSelect from "@/components/ProTreeSelect";
import {fetchOuTree} from "@/pages/frame/soa/ou/OuList/service";


const CreateForm: React.FC<FormProps> = (props) => {
  const {modalVisible, params, onSubmit, onCancel} = props;

  //定义一个空表单
  const [form] = Form.useForm();

  //附件相关
  const [pictureValue, setPictureValue] = useState("");

  const handleSubmit = async () => {
    try {
      //取出表单里的所有字段
      const formValues = await form.validateFields();
      //提交表单时，把附件字段置换成字符串标识
      formValues.picture = pictureValue;

      if (formValues.ouId) {
        formValues.ouId = formValues.ouId.value;
      }
      else{
        formValues.ouId = params?.ouId;
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
  }, [form, modalVisible]);

  return (
    <ModalForm
      title="添加用户"
      width={'80vw'}
      form={form}
      grid={true}
      rowProps={
        {
          gutter: [16, 0]
        }
      }
      open={modalVisible}
      onOpenChange={
        (visible) => {
          if (!visible) {
            onCancel();
          }
        }
      }
      onFinish={handleSubmit}>
      <ProFormText
        name="displayName"
        label="姓名"
        placeholder="请输入姓名"
        rules={[{required: true, message: '姓名必填'}]}
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormText
        name="loginId"
        label="账号"
        tooltip="登录系统的账号"
        placeholder="请输入账号"
        rules={[{required: true, message: '账号必填'}]}
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormRadio.Group
        name="gender"
        label="性别"
        required={true}
        rules={[{required: true, message: '性别必填'}]}
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
        request={
          async () => {
            return await getGenderModel();
          }

        }/>
      <ProFormText
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProTreeSelect
        rootName={"所属部门"}
        name="ouId"
        label="所属部门"
        allowClear
        secondary
        request={
          async () => {
            return await fetchOuTree({id: "", text: ""});
          }
        }
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
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
          },
          defaultValue: params?.pid
        }}/>
      <ProFormText
        name="post"
        label="职务"
        placeholder="请输入职务"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProUpload
        label="头像"
        name="picture"
        groupId={""}
        title="上传"
        max={1}
        accept={'.jpg,.png,.jpeg'}
        listType={'picture-card'}
        onFinish={
          (groupId) => {
            setPictureValue(groupId)
          }
        }/>
      <ProFormText
        name="idNum"
        label="身份证号"
        placeholder="请输入身份证号"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormDatePicker
        name="birthday"
        label="出生日期"
        placeholder="请选择出生日期"
        fieldProps={{style: {width: '100%'}}}
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormText
        name="carNum"
        label="车牌"
        placeholder="请输入车牌"
        labelCol={{md: 6, xl: 6}}
        colProps={{md: 12, xl: 12}}
      />
      <ProFormTextArea
        name="workSituation"
        label="工作情况"
        placeholder="请输入工作情况"
      />
    </ModalForm>);
};

export default CreateForm;
