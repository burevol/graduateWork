import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Video from './Video';
import { fetchVideo } from "./store/videoSlice";

function VideoList(props) {
    
    const videos = useSelector((state) => state.storageData.videos.videos);
    const {user: currentUser, isLoggedIn : isLoggedIn} = useSelector((state) => state.storageData.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchVideo(currentUser.access_token));
        } else {
            dispatch(fetchVideo(null));
        }
    }, [dispatch]);
    const videoFragment = (props.user === null ?
        videos.map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        )
        :
        videos.filter(video => video.author === parseInt(props.user)).map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        ));

    return (
        <div className="container mx-auto flex flex-wrap gap-2">
            {videoFragment}
        </div>
    )
}

export default VideoList;