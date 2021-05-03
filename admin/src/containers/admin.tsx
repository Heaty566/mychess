import * as React from 'react';

import { List, Row, Col, Avatar, Skeleton } from 'antd';
import { http } from '../service/http';
export interface AdminProps {}

interface UserProp {
    name: string;
    username: string;
    avatarUrl: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

const Admin: React.FunctionComponent<AdminProps> = () => {
    const [users, setUsers] = React.useState<Array<UserProp>>([]);

    React.useEffect(() => {
        (async () => {
            const data = await http.get('/admin/users');
            setUsers(data.data.data);
        })();
    }, [setUsers]);

    return (
        <Row justify="start" align="top" className="h-full m-48">
            <Col className="w-full">
                {users.map((item) => {
                    return (
                        <List.Item actions={[<a key="list-loadmore-edit">Edit</a>]}>
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta avatar={<Avatar src={item.avatarUrl} />} title={`${item.name}`} description={`${item.username}`} />
                                <div>{`Role: ${item.role}`}</div>
                            </Skeleton>
                        </List.Item>
                    );
                })}
            </Col>
        </Row>
    );
};

export default Admin;
