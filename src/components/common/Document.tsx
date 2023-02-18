import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import { RoutingContent } from '@frontend/components/common/Routing';
import { Layout } from '@frontend/components/common/Layout';
import { Utils } from '@frontend/components/common/Utils';
import { ConfigProvider } from 'antd';

export type DocumentProps = {
  children?: React.ReactElement;
};
export const Document: React.FC<DocumentProps> = () => {
  return (
    <Router>
      <RecoilRoot>
        <Utils />
        <ConfigProvider
          theme={{
            token: {
              fontFamily: `'Barlow', 'Noto Sans JP', sans-serif`,
            },
          }}
        >
          <Layout>
            <RoutingContent />
          </Layout>
        </ConfigProvider>
      </RecoilRoot>
    </Router>
  );
};
