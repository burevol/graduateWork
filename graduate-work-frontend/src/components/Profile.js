import {useEffect, useState} from 'react';
import {Card, Button} from "flowbite-react";
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate, useParams} from 'react-router-dom';
import {fetchProfile} from "./store/userDataSlice";
import {fetchBanned, fetchSubscriptions} from "./store/auth";
import axios from "axios";

function Profile() {

    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const subscriptions = useSelector((state) => state.storageData.auth.subscriptions);
    const banned = useSelector((state) => state.storageData.auth.banned)
    const img = useSelector((state) => state.storageData.profileData.img)
    const username = useSelector((state) => state.storageData.profileData.username)
    const [avatarFile, setAvatarFile] = useState()
    const [avatarURL, setAvatarURL] = useState()
    const [avatarFileChanged, setAvatarFileChanged] = useState(false)


    const navigate = useNavigate();
    const dispatch = useDispatch();

    function showVideoByUser(user) {
        navigate({
            pathname: '/',
            search: `?author=${user}`
        })
    }

    const params = useParams();
    const profileId = params.user ? params.user : currentUser.user.pk;
    const isSubscribed = subscriptions.includes(Number(profileId))
    const isBanned = banned.includes(Number(profileId));

    useEffect(() => {
        dispatch(fetchProfile(profileId));
        dispatch(fetchSubscriptions(currentUser.access_token));
        dispatch(fetchBanned(currentUser.access_token));
    }, [dispatch, profileId]);


    function handleChangeAvatarFile(event) {
        setAvatarFile(event.target.files[0])
        setAvatarURL(URL.createObjectURL(event.target.files[0]))
        if (!avatarFileChanged) {
            setAvatarFileChanged(true)
        }
    }

    function uploadAvatar(event) {
        event.preventDefault()
        if (!avatarFileChanged) {
            navigate("/profile")
            return;
        }
        const formData = new FormData();
        if (avatarFileChanged) {
            formData.append('avatar', avatarFile);
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const url = `http://localhost:8000/api/user_update/${currentUser.user.pk}`

        axios.patch(url, formData, config).then((response) => {

        }).catch((err) => {
            console.log(err);
        });
        navigate("/profile")
    }

    function subscribe() {

        const url = `http://localhost:8000/api/subscribe/`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const data = {subscribe_to: profileId}
        axios.post(url, data, config).then((response) => {
            dispatch(fetchSubscriptions(currentUser.access_token))
        }).catch((err) => {
            console.log(err);
        });
    }

    function ignoreUser() {

        const url = `http://localhost:8000/api/ban/`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const data = {ban_to: profileId}
        axios.post(url, data, config).then((response) => {
            dispatch(fetchBanned(currentUser.access_token))
        }).catch((err) => {
            console.log(err);
        });
    }

    function unsubscribe() {

        const url = `http://localhost:8000/api/unsubscribe/`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const data = {subscribe_to: profileId}
        axios.post(url, data, config).then((response) => {
;           dispatch(fetchSubscriptions(currentUser.access_token))
        }).catch((err) => {
            console.log(err);
        });
    }

    function unIgnoreUser() {

        const url = `http://localhost:8000/api/unban/`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const data = {ban_to: profileId}
        axios.post(url, data, config).then((response) => {
;           dispatch(fetchBanned(currentUser.access_token))
        }).catch((err) => {
            console.log(err);
        });
    }

    const userVideoButton = <div>
        <Button className='w-48' onClick={() => {
            showVideoByUser(profileId)
        }}>
            ?????????? ????????????????????????
        </Button>
    </div>;

    const subscribeButton = <div>
        <Button className='w-48' onClick={subscribe}>
            ??????????????????????
        </Button>
    </div>

    const unSubscribeButton = <div>
        <Button className='w-48' onClick={unsubscribe}>
            ????????????????????
        </Button>
    </div>

    const banButton = <div>
        <Button className='w-48' onClick={ignoreUser}>
            ??????????????????????????
        </Button>
    </div>

     const unBanButton = <div>
        <Button className='w-48' onClick={unIgnoreUser}>
            ????????????????????????????
        </Button>
    </div>

    const ViewSubscribeButton = <div>
        <Link to={"/subscriptions"}>
            <Button className='w-48'>
                ?????? ????????????????
            </Button>
        </Link>
    </div>

    const uploadVideoButton = <div>
        <Link to='/profile/upload'>
            <Button className='w-48'>
                ?????????????????? ??????????
            </Button>
        </Link>
    </div>

    const chatButton = <div>
        <Link to={`/chat/${profileId}`}>
            <Button className='w-48'>
                ?????? ?? ??????????????????????????
            </Button>
        </Link>
    </div>

    const logoutButton = <div>
        <Link to='/logout'>
            <Button className='w-48'>
                ??????????
            </Button>
        </Link>
    </div>

    const editProfile =
        <div><label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="pict_input">???????????????? ????????????</label>
            <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="pict_input" type="file" onChange={handleChangeAvatarFile}></input>
            <button type="button" onClick={uploadAvatar}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-10 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">??????????????????
            </button>
        </div>

    return (
        <div>
            <div className="flex gap-2 p-2">
                <div className="w-48">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {username}
                    </h5>
                    {(avatarFileChanged) ?
                        <img className="rounded-t-lg" src={avatarURL} alt=""/>
                        :
                        <img className="rounded-t-lg" src={img} alt=""/>
                    }
                    {currentUser.user.pk === profileId ? editProfile : ""}

                </div>
                <div>
                    <div className="flex flex-col gap-2 btn-group">
                        {userVideoButton}
                        {currentUser.user.pk === profileId ? uploadVideoButton : ""}
                        {!isSubscribed && currentUser.user.pk !== profileId ? subscribeButton : ""}
                        {isSubscribed && currentUser.user.pk !== profileId ? unSubscribeButton : ""}
                        {!isBanned && currentUser.user.pk !== profileId ? banButton : ""}
                        {isBanned && currentUser.user.pk !== profileId ? unBanButton : ""}
                        {currentUser.user.pk !== profileId ? chatButton : ""}
                        {currentUser.user.pk === profileId ? ViewSubscribeButton : ""}
                        {currentUser.user.pk === profileId ? logoutButton : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;