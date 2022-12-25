import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Video from './Video';
import { fetchVideo } from "./store/videoSlice";

function VideoList({user, search}) {
    
    const videos = useSelector((state) => state.storageData.videos.videos);
    const {user: currentUser, isLoggedIn : isLoggedIn} = useSelector((state) => state.storageData.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchVideo(currentUser.access_token, search));
        } else {
            dispatch(fetchVideo(null, search));
        }
    }, [dispatch, search]);
    const videoFragment = (user === null ?
        videos.map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        )
        :
        videos.filter(video => video.author === parseInt(user)).map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        ));

    return (
        <div className="container mx-auto flex flex-wrap gap-2">
            {videoFragment}
        </div>
    )
}

export default VideoList;