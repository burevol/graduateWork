import {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {TextInput, Button} from 'flowbite-react';
import Comment from './Comment';
import {fetchComments, addComment} from "./store/commentSlice";
import VideoInfo from "./VideoInfo";

function VideoPage() {

    const inputRef = useRef(null);
    const params = useParams();
    const videos = useSelector((state) => state.storageData.videos.videos);
    const item = videos.find(video => video.id === parseInt(params.id));
    const {user: currentUser} = useSelector((state) => state.storageData.auth);

    const comments = useSelector((state) => state.storageData.comments.comments);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchComments(params.id));
    }, [dispatch, params.id]);

    const commentsFragment = comments.map((comment) =>
        <Comment key={comment.id} author={comment.author} body={comment.body}/>
    );

    function handleClick() {
        dispatch(addComment("User1", inputRef.current.value, params.id));
        inputRef.current.value = "";
    }

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
                    <div className="container mx-auto px-3">
                        {commentsFragment}
                    </div>
                    <div className='flex'>
                        <TextInput
                            className='px-3'
                            id="comment"
                            type="text"
                            placeholder="Оставьте комментарий"
                            ref={inputRef}
                        />
                        <Button onClick={handleClick}>
                            Ок
                        </Button>
                    </div>
                </div>
            }
        </div>
    )

}

export default VideoPage;