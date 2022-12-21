import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Video from './Video';
import { fetchSubscriptions } from "./store/videoSlice";

function Subscriptions() {

    const videos = useSelector((state) => state.storageData.videos.videos);
    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSubscriptions(currentUser.access_token));
    }, [dispatch]);

    console.log(videos)
    const videoFragment =
        videos.map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
      );

    return (
        <div className="container mx-auto flex flex-wrap gap-2">
            {videoFragment}
        </div>
    )
}

export default Subscriptions;