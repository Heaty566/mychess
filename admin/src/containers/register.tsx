import { Typography } from 'antd';
import { Form, Input, Button, Row, Col } from 'antd';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { UserRegisterDto } from '../store/auth/dto';
import useFormError from '../common/hooks/useFormError';
import { RootState, store } from '../store';
import { IApiState } from '../store/api/interface';
import { registerUser } from '../store/auth/action';
import { useEffect } from 'react';
export interface LoginProps {}

const { Title } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const defaultValues: UserRegisterDto = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
};

function Register() {
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserRegisterDto>(defaultValues);

    const [form] = Form.useForm();

    const onSubmit = (data: UserRegisterDto) => {
        store.dispatch(registerUser(data));
    };

    useEffect(() => {
        form.setFields([
            { name: 'name', errors: Boolean(errors.password) ? [`Password ${errors.password}`] : [] },
            { name: 'username', errors: Boolean(errors.username) ? [`Username ${errors.username}`] : [] },
            { name: 'password', errors: Boolean(errors.password) ? [`Password ${errors.password}`] : [] },
            { name: 'confirmPassword', errors: Boolean(errors.confirmPassword) ? [`confirmPassword ${errors.password}`] : [] },
        ]);
    }, [errors, form]);

    return (
        <Row justify="center" align="middle" className="h-full">
            <Col>
                <Form initialValues={defaultValues} {...layout} onFinish={onSubmit} form={form} className="w-96">
                    <Title type="secondary" level={2} className="text-center">
                        Register Form
                    </Title>

                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Confirm Password" name="confirmPassword">
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        {apiState.isLoading ? (
                            <Spin />
                        ) : (
                            <Button type="primary" htmlType="submit">
                                Sign up
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

export default Register;
