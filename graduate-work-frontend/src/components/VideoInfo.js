import LikesCount from "./LikesCount";
import { useNavigate } from 'react-router-dom';

function VideoInfo(props) {
   
    const linkToVideo = "/video/" + props.info.id;
    const linkToUser = `/user/${props.info.author}`

    const navigate = useNavigate();

    function goToUser() {
        navigate({
            pathname: linkToUser,
        })
    }
    function goToVideo() {
        navigate({
            pathname: linkToVideo,
        })
    }

    return (
        <div className='px-5'>
            <LikesCount count={props.info.likes_count} id={props.info.id} />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer" onClick={goToVideo}>
                {props.info.header}
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400 cursor-pointer" onClick={goToUser}>
                {props.info.author_name}
            </p>
            <p className="font-light italic text-gray-700 dark:text-gray-400">
                {new Date(props.info.date_added).toLocaleString()}
            </p>
        </div >
    );
}

export default VideoInfo;