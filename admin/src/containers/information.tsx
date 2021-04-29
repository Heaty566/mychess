import * as React from 'react';

import { Card, Row, Col, Image } from 'antd';

import { RootState } from '../store';
import { IAuthState } from '../store/auth/dto';
import { useSelector } from 'react-redux';

import RouterHOC from '../HOC/routerHOC';

export interface InformationProps {}

const Information: React.FunctionComponent<InformationProps> = () => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    return (
        <Row justify="center" align="middle" className="h-full">
            <Col>
                <Card hoverable style={{ width: 240 }} cover={<img alt="example" src={authState.avatarUrl} />}>
                    <p style={{ fontSize: 16, marginBottom: 0 }}>{`Username: ${authState.username}`}</p>
                    <p style={{ fontSize: 16, marginBottom: 0 }}>{`Name: ${authState.name}`}</p>
                    <p style={{ fontSize: 16, marginBottom: 0 }}>{`Role: ${authState.role}`}</p>
                    <p style={{ fontSize: 16, marginBottom: 0 }}>{`Email: ${authState.email ? authState.email : ''}`}</p>
                </Card>
            </Col>
        </Row>
    );
};

const InformationRouter = (props: any) => <RouterHOC Component={Information} props={props} />;

export default InformationRouter;
