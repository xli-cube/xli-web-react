/*
import {TreeNode, TreeNodeDTO} from "@/components/ProTree/data";

export function convertTreeNode(treeNodeList: TreeNodeDTO[]) {
  const convertNode = (node: TreeNodeDTO) => {
    const convertedNode: TreeNode = {
      key: node.id,
      title: node.text,
    };

    if (node.children && node.children.length > 0) {
      convertedNode.children = node.children.map((childNode) => convertNode(childNode));
    }
    return convertedNode;
  };

  return treeNodeList.map((treeNode) => convertNode(treeNode));
}

export function convertTreeNodeSelect(treeNodeList: TreeNodeDTO[]) {
  const convertNode = (node: TreeNodeDTO) => {
    const convertedNode: SelectTreeNode = {
      value: node.id,
      title: node.text
    };

    if (node.children && node.children.length > 0) {
      convertedNode.children = node.children.map((childNode) => convertNode(childNode));
    }
    return convertedNode;
  };

  return treeNodeList.map((treeNode) => convertNode(treeNode));
}
*/
