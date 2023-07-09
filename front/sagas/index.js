import {all, fork} from 'redux-saga/effects';
import axios from 'axios';
import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

// all: 배열을 받으면 한번에 실행 , fork: 함수 실행
// 등록
export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}