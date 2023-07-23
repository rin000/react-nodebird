import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from "styled-components";
import { Menu, Input, Row, Col } from 'antd';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import {useSelector} from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import useInput from '../hooks/useInput';
import Router from 'next/router';

const SearchInput = styled(Input.Search)`
    vertical-Align: middle;
`;

const Global = createGlobalStyle`
    .ant-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .ant-col: first-child {
        padding-left: 0 !important;
    }

    .ant-col: last-child {
        padding-right: 0 !important;
    }
`;

const AppLayout = ({children}) => {
    const [searchInput, onChangeSearchInput] = useInput('');
    const {me} = useSelector((state) => state.user);

    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`);
    }, [searchInput]);

    return (
        <div>
        <Global />
            <Menu mode="horizontal" style={{display: 'flex', justifyContent: 'center', marginRight: '20%', gap: '10px'}}>
                <Menu.Item key="home">
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item key="profile">
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item key="mail">
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput 
                        enterButton 
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                        placeholder='검색어 입력'
                    />
                </Menu.Item>
            </Menu>
            {/* gutter: 컬럼 사이 간격 */}
            <Row gutter={8}> 
            {/* xs: 모바일, sm: 태블릿, md: 작은 데스크탑 */}
            {/* 비율 24 기준으로 나뉨 */}
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                {/* 보안상 적어놓기: rel= "noreferrer noopener", target: 새창에서 띄우기  */}
                    홈페이지 이동:<a href="http://www.naver.com" target="_blank" rel= "noreferrer noopener"> NAVER</a>
                </Col>
            </Row>
        </div>
    );
};

AppLayout.propTypes = {
    // children = 노드 타입 (react의 노드), 노드 = return안에 들어갈 수 있는 모든것
    children: PropTypes.node.isRequired, 
};

export default AppLayout;