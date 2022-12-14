import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TextInput, Button } from 'flowbite-react';
import Comment from './Comment';
import { fetchComments, addComment } from "./store/commentSlice";
import VideoInfo from "./VideoInfo";

function VideoPage() {

    const inputRef = useRef(null);
    const params = useParams();
    const videos = useSelector((state) => state.storageData.videos.videos);
    console.log(videos)
    const item = videos.find(video => video.id === parseInt(params.id));
    console.log(item)

    const comments = useSelector((state) => state.storageData.comments.comments);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchComments(params.id));
    }, [dispatch, params.id]);

    const commentsFragment = comments.map((comment) =>
        <Comment key={comment.id} author={comment.author} body={comment.body} />
    );

    function handleClick() {
        dispatch(addComment("User1", inputRef.current.value, params.id));
        inputRef.current.value = "";
    }

    return (
        <div className="container mx-auto">
            {
                <div>
                    <video autoPlay controls>
                        <source src={item.link} type="video/mp4" />
                    </video>
                    <VideoInfo info={item} />
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