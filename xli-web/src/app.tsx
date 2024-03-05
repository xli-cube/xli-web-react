import Footer from './components/Footer';
import type { RunTimeLayoutConfig } from '@umijs/max';
import React from 'react';

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // 常用属性
    title: 'xli',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',

    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
  };
};
