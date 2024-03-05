import React, {FC, useEffect, useState} from "react";
import {Tree} from "antd";
import {TreeProps} from "antd/lib/tree";


type ProTreeProps = {
  rootName?: string;
  request?: () => Promise<any>;
} & TreeProps;

const ProTree: FC<ProTreeProps> = (props) => {
  const {rootName, request, treeData} = props;
  const [proTreeData, setProTreeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (request) {
        try {
          setProTreeData(await request());
        } catch (error) {
          console.error("获取数据出错:", error);
        }
      } else if (Array.isArray(treeData)) {
        setProTreeData(treeData);
      }
    };
    fetchData();
  }, [request, rootName, treeData]);

  return (
    <Tree
      {...props}
      treeData={
        rootName ? [{id: "", text: rootName, children: proTreeData}]
          : proTreeData
      }
      fieldNames={{key: "id", title: "text", children: "children"}}
    />
  );
}
export default ProTree;
