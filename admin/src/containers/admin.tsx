import * as React from 'react';

import { List, Row, Col, Avatar } from 'antd';
import { http } from '../service/http';
export interface AdminProps {}

const Admin: React.FunctionComponent<AdminProps> = () => {
    const [users, setUsers] = React.useState();

    React.useEffect(() => {
        (async () => {
            const users = await http.get('/admin/users');
            console.log(users);
        })();
    }, []);

    return (
        <Row justify="start" align="top" className="h-full" style={{ margin: '64px' }}>
            <Col>
                <List.Item key={1}>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">Kaine</a>}
                        description={'kainesv@gmail.com'}
                    />
                    <div>Content</div>
                </List.Item>
                <List.Item key={2}>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">Kaine</a>}
                        description={'kainesv@gmail.com'}
                    />
                    <div>Content</div>
                </List.Item>
            </Col>
        </Row>
    );
};

export default Admin;
