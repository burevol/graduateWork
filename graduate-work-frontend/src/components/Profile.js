import React, { useEffect } from 'react';
import { Card, Button } from "flowbite-react";
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navigation from './Navbar'
import { fetchProfile } from "./store/userDataSlice";

function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function showVideoByUser(user) {
        navigate({
            pathname: '/',
            search: `?author=${user}`
        })
    }
    const params = useParams();

    useEffect(() => {
        dispatch(fetchProfile(params.user));
    }, [dispatch, params.user]);

    const img = useSelector((state) => state.storageData.profileData.img)
    const username = useSelector((state) => state.storageData.profileData.username)
    const currentUser = useSelector((state) => state.storageData.users.username)

    const userVideoButton = <div>
        <Button className='w-48' onClick={() => { showVideoByUser(params.user) }}>
            Видео пользователя
        </Button>
    </div>;

    const SubscribeButton = <div>
        <Link to={`/subscribe/${username}`}>
            <Button className='w-48'>
                Подписаться
            </Button>
        </Link>
    </div>

    const ViewSubscribeButton = <div>
        <Link to={"/my_subscribes"}>
            <Button className='w-48'>
                Мои подписки
            </Button>
        </Link>
    </div>

    const uploadVideoButton = <div>
        <Link to='/profile/upload'>
            <Button className='w-48'>
                Загрузить видео
            </Button>
        </Link>
    </div>

    const chatButton = <div>
        <Link to={`/chat/${username}`}>
            <Button className='w-48'>
                Чат с пользователем
            </Button>
        </Link>
    </div>

    const logoutButton = <div>
        <Link to='/logout'>
            <Button className='w-48'>
                Выход
            </Button>
        </Link>
    </div>

    return (
        <div>
            <Navigation />
            <div className="flex gap-2 p-2">
                <div className="max-w-md">
                    <Card imgSrc={img}>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {username}
                        </h5>
                    </Card>
                </div>
                <div>
                    <div className="flex flex-col gap-2 btn-group">
                        {userVideoButton}
                        {currentUser === params.user ? uploadVideoButton : ""}
                        {currentUser === params.user ? ViewSubscribeButton : ""}
                        {currentUser !== params.user ? chatButton : ""}
                        {currentUser !== params.user ? SubscribeButton : ""}
                        {currentUser === params.user ? logoutButton : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;