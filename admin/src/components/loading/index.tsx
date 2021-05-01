import * as React from 'react';
import { Component } from 'react';

import { Spin, Row, Col } from 'antd';

export interface LoadingProps {}

const Loading: React.FunctionComponent<LoadingProps> = () => {
    return (
        <Row justify="center" align="middle" className="h-full">
            <Col>
                <Spin size="large" />
            </Col>
        </Row>
    );
};

export default Loading;
