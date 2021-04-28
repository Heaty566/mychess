import * as React from 'react';

import { Card, Row, Col, Image } from 'antd';

import { RootState } from '../store';
import { IAuthState } from '../store/auth/dto';
import { useSelector } from 'react-redux';

export interface InformationProps {}

const Information: React.FunctionComponent<InformationProps> = () => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    return (
        <Row justify="center" align="middle" className="h-full">
            <Col>
                <Card title="Information" style={{ width: 300 }}>
                    <Image width={200} src={authState.avatarUrl} />
                    <p>{`Username: ${authState.username}`}</p>
                    <p>{`Name: ${authState.name}`}</p>
                    <p>{`Role: ${authState.role}`}</p>
                    <p>{`Email: ${authState.email ? authState.email : ''}`}</p>
                </Card>
            </Col>
        </Row>
    );
};

export default Information;
