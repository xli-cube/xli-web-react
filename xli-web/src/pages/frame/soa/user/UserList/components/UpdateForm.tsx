import React, {useEffect, useState} from 'react';
import {Col, Collapse, Divider, Form, Row} from 'antd';
import {
  ModalForm, ProFormDatePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from "@ant-design/pro-form";
import ProUpload from '@/components/ProUpload';
import {ResultVO} from "@/services/data";
import {detail, getGenderModel, update} from '../service';
import {SelectItem} from "@/components/ProSelectItem/data";
import {convertSelectItem} from "@/components/ProSelectItem/util";

export type UpdateFormProps = {
  modalVisible: boolean;
  id: string;
  extValues?: any[];
  onSubmit: (resultVO: ResultVO) => Promise<void>;
  onCancel: () => void;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, id, extValues, onSubmit, onCancel} = props;

  const [pictureValue, setPictureValue] = useState("");

  //定义一个空表单
  const [form] = Form.useForm();

  const handleForm = async () => {
    const formValues = await detail(id);
    //把list页面传来的表单数据渲染。这里不需要从数据库再查一遍
    form.setFieldsValue(formValues);

    //单独处理附件字段
    setPictureValue(form.getFieldValue("picture"));
  }

  const handleSubmit = async () => {
    try {
      //取出表单里的所有字段
      const formValues = await form.validateFields();
      formValues["id"] = id;
      // 将 extValues 中的键值对添加到 FormData
      if(extValues){
        for (const [key, value] of Object.entries(extValues)) {
          formValues[key] = value;
        }
      }
      //提交表单时，把附件字段置换成字符串标识
      formValues.picture = pictureValue;
      const resultVO = await update({...formValues});
      await onSubmit(resultVO);//把结果回调给父页面
    } catch (error) {
      console.error("表单提交出错:", error);
    }
  };

  //代码项相关
  const [genderCode, setGenderCode] = useState<SelectItem[]>([]);
  const fetchGenderCode = async () => {
    const selectItemList = await getGenderModel();
    //setGenderCode(convertSelectItem(selectItemList));
  };

  useEffect(() => {
    if (modalVisible) {
      handleForm().then();
      fetchGenderCode().then();
    }
  }, [modalVisible]);

  return (
    <ModalForm
      title="修改用户"
      width={'60vw'}
      form={form}
      open={modalVisible}
      onFinish={handleSubmit}
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
      }>
      <Collapse defaultActiveKey={['basicInfo']} style={{width: '100%'}} ghost={true} bordered={false} accordion={true}>
        <Collapse.Panel header="基本信息" key="basicInfo">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="displayName"
                label="姓名"
                placeholder="请输入姓名"
                rules={[{required: true, message: '姓名必填'}]}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="loginId"
                label="账号"
                tooltip="登录系统的账号"
                placeholder="请输入账号"
                rules={[{required: true, message: '账号必填'}]}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormRadio.Group
                name="gender"
                label="性别"
                options={genderCode}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="mobile"
                label="手机号"
                placeholder="请输入手机号"
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormTreeSelect
                name="ouId"
                label="所属部门"
                placeholder="请选择部门"
                allowClear={true}
                secondary
                request={
                  async () => {
                    //return await fetchSelectTree("/rest/frameOu/fetchTree");
                    return [];
                  }
                }/>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="post"
                label="职务"
                placeholder="请输入职务"
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProUpload label="头像"
                           name="picture"
                           groupId={pictureValue}
                           title="上传"
                           max={1}
                           accept={'.jpg,.png,.jpeg'}
                           listType={'picture-card'}
                           onFinish={
                             (groupId) => {
                               setPictureValue(groupId)
                             }
                           }/>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
      <Divider/>
      <Collapse defaultActiveKey={['extendInfo']}
                style={{width: '100%'}}
                ghost={true}
                bordered={false}
                accordion={true}>
        <Collapse.Panel header="扩展信息" key="extendInfo">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="idNum"
                label="身份证号"
                placeholder="请输入身份证号"
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormDatePicker
                name="birthday"
                label="出生日期"
                placeholder="请选择出生日期"
                fieldProps={{style: {width: '100%'}}}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="email"
                label="邮箱"
                placeholder="请输入邮箱"
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ProFormText
                name="carNum"
                label="车牌"
                placeholder="请输入车牌"
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <ProFormTextArea
                name="workSituation"
                label="工作情况"
                placeholder="请输入工作情况"
              />
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    </ModalForm>
  );
};

export default UpdateForm;
