import { useEffect } from 'react';

import { Typography } from 'antd';
import { Form, Input, Button, Row, Col } from 'antd';
import { Spin } from 'antd';

import useFormError from '../common/hooks/useFormError';

import { useSelector } from 'react-redux';
import { UserLoginDto } from '../store/auth/dto';
import { RootState, store } from '../store';
import { IApiState } from '../store/api/interface';
import { loginUser } from '../store/auth/action';

export interface LoginProps {}

const { Title } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const defaultValues: UserLoginDto = {
    password: '',
    username: '',
};

function Login() {
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserLoginDto>(defaultValues);

    const [form] = Form.useForm();

    const onSubmit = (data: UserLoginDto) => {
        store.dispatch(loginUser(data));
    };

    useEffect(() => {
        form.setFields([
            { name: 'username', errors: Boolean(errors.username) ? [`Username ${errors.username}`] : [] },
            { name: 'password', errors: Boolean(errors.password) ? [`Password ${errors.password}`] : [] },
        ]);
    }, [errors, form]);

    return (
        <Row justify="center" align="middle" className="h-full">
            <Col>
                <Form initialValues={defaultValues} {...layout} onFinish={onSubmit} form={form} className="w-96">
                    <Title type="secondary" level={2} className="text-center">
                        Login Form
                    </Title>
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password">
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        {apiState.isLoading ? (
                            <Spin />
                        ) : (
                            <Button type="primary" htmlType="submit">
                                Sign in
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

export default Login;
