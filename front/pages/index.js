import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import axios from 'axios';

const Home = () => {
    const dispatch = useDispatch();
    const {me} = useSelector((state) => state.user);
    const {mainPosts, hasMorePosts, loadPostsLoading, retweetError} = useSelector((state) => state.post);

    
    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError])

    useEffect(() => {
        function onScroll() {
            // scrollY: 얼마나 내렸는지, clientHeight: 화면에 보이는 길이, scrollHeight: 총 길이
            console.log(window.scrollY, 
                        document.documentElement.clientHeight, 
                        document.documentElement.scrollHeight);
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if(hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return() => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePosts, loadPostsLoading, mainPosts]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => ( 
                <PostCard key={post.id} post={post} />
                ))}
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
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Home;