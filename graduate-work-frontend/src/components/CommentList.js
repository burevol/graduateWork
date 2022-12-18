import {Button, TextInput} from "flowbite-react";
import {useEffect, useState} from "react";
import Comment from "./Comment";
import {useRef} from "react";
import axios from "axios";
import {useSelector} from "react-redux";

function CommentList({videoId}) {
    const inputRef = useRef(null);
    const [commentList, setCommentList] = useState([])
    const [updateCounter, setUpdateCounter] = useState(0)
    const {user: currentUser} = useSelector((state) => state.storageData.auth);

    useEffect(() => {
            axios.get(`http://localhost:8000/api/comments/?video_id=${videoId}`).then((response) => {
                setCommentList(response.data)
            })
        }
        , [videoId, updateCounter]);

    function handleClick() {
        const data = {
            author: currentUser.profile_id,
            video: videoId,
            text: inputRef.current.value
        }
        axios.post(`http://localhost:8000/api/comments/`, data).then((response) => {
           setUpdateCounter(updateCounter + 1)
        })

        inputRef.current.value = "";
    }

    return (
        <div>
            <div className="container mx-auto px-3">
                <p>Комментарии:</p>
                {
                    commentList.map((comment) =>
                        <div key={comment.id}>
                            <Comment author={comment.author_name} body={comment.text}/>
                        </div>
                    )
                }
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
    )
}

export default CommentList;