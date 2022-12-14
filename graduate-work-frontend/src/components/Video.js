import React from "react";
import VideoInfo from "./VideoInfo";
import { useNavigate } from 'react-router-dom';

function Video(props) {

    const linkToVideo = "/video/" + props.info.id;
    const navigate = useNavigate();

    function goToVideo() {
        navigate({
            pathname: linkToVideo,
        })
    }

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg" src={props.info.preview} alt="" onClick={goToVideo} />
            <div className="p-5">
                <VideoInfo info={props.info} />
            </div>
        </div>
    )
}

export default Video;