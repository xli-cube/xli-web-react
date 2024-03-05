import {ProFormTreeSelect} from "@ant-design/pro-components";
import React, {FC} from "react";
import {ProFormTreeSelectProps} from "@ant-design/pro-form/es/components/TreeSelect";

type ProTreeSelectProps = {
  rootName?: string;
} & ProFormTreeSelectProps;

const ProTreeSelect: FC<ProTreeSelectProps> = (props) => {
  const {rootName, request, params, ...rest} = props;

  const fetchData = async () => {
    let treeData = await request?.(params, props);

    if (rootName && rootName !== "") {
      return ([{id: "", text: rootName, children: treeData}]);
    }
    return [];
  };

  return (
    <ProFormTreeSelect
      request={fetchData}
      {...rest}/>
  );
};

export default ProTreeSelect;
