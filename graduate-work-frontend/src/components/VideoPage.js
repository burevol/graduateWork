import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from 'flowbite-react';
import CommentList from "./CommentList";
import VideoInfo from "./VideoInfo";

function VideoPage() {


    const params = useParams();
    const videos = useSelector((state) => state.storageData.videos.videos);
    const item = videos.find(video => video.id === parseInt(params.id));
    const {user: currentUser} = useSelector((state) => state.storageData.auth);

    const navigate = useNavigate()

    function handleEditButton() {
        navigate(`/edit/${params.id}`)
    }

    return (
        <div className="container mx-auto">
            {
                <div>
                    <video autoPlay controls>
                        <source src={item.upload} type="video/mp4"/>
                    </video>

                    {(Number(currentUser.profile_id) === item.author.id) ?
                        <div className="py-1">
                            <Button onClick={handleEditButton}>Редактировать</Button>
                        </div> : ""
                    }
                    <VideoInfo info={item}/>
                    <CommentList videoId={params.id}/>
                </div>
            }
        </div>
    )

}

export default VideoPage;