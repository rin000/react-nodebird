import React, { useCallback, useEffect, useState } from "react";
import Router from 'next/router';
import AppLayout from "../components/AppLayout";
import Head from 'next/head';
import { Checkbox, Form, Input, Button} from "antd";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const dispatch = useDispatch();
    const {signUpLoading, signUpDone, signUpError, me} = useSelector((state) => state.user);

    useEffect(() => {
        if (me && me.id) {
            Router.replace('/');
        }
    }, [me && me.id]);

    useEffect(() => {
        if (signUpDone) {
            Router.replace('/');
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, []);

    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password]);
    
    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);

    const onSubmit = useCallback(() => {
        if(password !== passwordCheck) {
            return setPasswordError(true);
        }
        if(!term) {
            return setTermError(true);
        }
        console.log(email, nickname, password);
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {email, password, nickname}
        })
    }, [email, password, passwordCheck, term]);

    return (
        <AppLayout>
            <Head>
            <title>회원가입</title>
            </Head>
            <Form onFinish={onSubmit}>
            <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input name="user-email" type="email" value={email} placeholder="이메일 입력" required onChange={onChangeEmail} />
            </div>
            <div>
                <label htmlFor="user-nick">닉네임</label>
                <br />
                <Input name="user-nick" value={nickname} required onChange={onChangeNickname} placeholder="닉네임 입력" />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input name="user-password" type="password" value={password} required onChange={onChangePassword} placeholder="비밀번호 입력" />
            </div>
            <div>
                <label htmlFor="user-password-check">비밀번호 체크</label>
                <br />
                <Input 
                name="user-password-check"
                type="password"
                value={passwordCheck}
                placeholder="비밀번호 다시 입력"
                required
                onChange={onChangePasswordCheck} />
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다</ErrorMessage>}
            </div>
            <div>
                <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
                {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
            </div>
            <div style={{marginTop: 10}}>
                <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
            </div>
            </Form>
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 쿠키 초기화
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie; // 쿠키 넣기
    }
    console.log(context);
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Signup;