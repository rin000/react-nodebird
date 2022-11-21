import React, { useCallback } from "react";
import { Avatar, Button , Card} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";
import Link from "next/link";

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me, logOutLoading } = useSelector((state) => state.user);

    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);

    return(
        <Card
            actions={[
                <div key="twit"><Link href={`/user/${me.id}`}><a>게시글<br />{me.Posts.length}</a></Link></div>,
                <div key="followings"><Link href="/profile"><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
                <div key="followers"><Link href="/profile"><a>팔로워<br />{me.Followers.length}</a></Link></div>
            ]}
        >
            <Card.Meta
            avatar={(
                <Link href={`/user/${me.id}`}>
                    <a><Avatar>{me.nickname[0]}</Avatar></a>
                </Link>
            )}
            title={me.nickname}
            />
            <br />
            <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;