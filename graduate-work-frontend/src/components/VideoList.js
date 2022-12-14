import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Video from './Video';
import { fetchVideo } from "./store/videoSlice";

function VideoList(props) {
    
    const videos = useSelector((state) => state.storageData.videos.videos);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVideo());
    }, [dispatch]);

    const videoFragment = (props.user === null ?
        videos.map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        )
        :
        videos.filter(video => video.author === props.user).map((videoCard) =>
            <Video key={videoCard.id} info={videoCard} />
        ));

    return (
        <div className="container mx-auto flex flex-wrap gap-2">
            {videoFragment}
        </div>
    )
}

export default VideoList;