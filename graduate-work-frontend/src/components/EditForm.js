import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {useSelector} from "react-redux";

function EditForm() {

    const navigate = useNavigate();
    const params = useParams();
    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const videos = useSelector((state) => state.storageData.videos.videos);
    const item = videos.find(video => video.id === parseInt(params.id));
    const [videoFile, setVideoFile] = useState()
    const [previewFile, setPreviewFile] = useState()
    const [header, setHeader] = useState()
    const [description, setDescription] = useState()
    const [previewURL, setPreviewURL] = useState()
    const [videoURL, setVideoURL] = useState()

    const [videoFileChanged, setVideoFileChanged] = useState(false)
    const [previewFileChanged, setPreviewFileChanged] = useState(false)
    const [headerChanged, setHeaderChanged] = useState(false)
    const [descriptionChanged, setDescriptionChanged] = useState(false)

    function uploadFile(event) {
        event.preventDefault()
        if (!videoFileChanged && !previewFileChanged && !headerChanged && !descriptionChanged) {
            navigate("/profile")
            return;
        }
        const formData = new FormData();
        if (videoFileChanged) {
            formData.append('upload', videoFile);
        }
        if (previewFileChanged) {
            formData.append('preview', previewFile);
        }
        if (headerChanged) {
            formData.append('header', header);
        }
        if (descriptionChanged) {
            formData.append('description', description);
        }
        const config = {
            headers: {
                'Authorization': 'Bearer ' + currentUser.access_token
            }
        };
        const url = `http://localhost:8000/api/update/${params.id}`

        axios.patch(url, formData, config).then((response) => {
            console.log(response.data);
        }).catch((err) => {
            console.log(err);
        });
        navigate("/")
    }

    function handleChangeVideoFile(event) {
        setVideoFile(event.target.files[0])
        setVideoURL(URL.createObjectURL(event.target.files[0]))
        const video = document.getElementById('vidId');
        video.pause();
        video.currentTime = 0;
        video.load();
        if (!videoFileChanged) {
            setVideoFileChanged(true)
        }
    }

    function handleChangePreviewFile(event) {
        setPreviewFile(event.target.files[0])
        setPreviewURL(URL.createObjectURL(event.target.files[0]))
        if (!previewFileChanged) {
            setPreviewFileChanged(true)
        }
    }

    function handleChangeHeader(event) {
        setHeader(event.target.value)
        if (!headerChanged) {
            setHeaderChanged(true)
        }
    }

    function handleChangeDescription(event) {
        setDescription(event.target.value)
        if (!descriptionChanged) {
            setDescriptionChanged(true)
        }
    }

    return (
        <div>
            <div className="container max-w-sm px-4">
                {(videoFileChanged) ?
                    <video id={'vidId'}>
                        <source src={videoURL} type="video/mp4"/>
                    </video>
                    :
                    <video id={'vidId'}>
                        <source src={item.upload} type="video/mp4"/>
                    </video>
                }
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Файл
                    видео</label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input" type="file" onChange={handleChangeVideoFile}></input>
                {(previewFileChanged) ?
                    <img className="rounded-t-lg" src={previewURL} alt=""/>
                    :
                    <img className="rounded-t-lg" src={item.preview} alt=""/>
                }
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="pict_input">Файл
                    превью</label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="pict_input" type="file" onChange={handleChangePreviewFile}></input>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                       htmlFor="name_input">Название</label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="name_input" type="text" onChange={handleChangeHeader}></input>

                <label htmlFor="description"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                <textarea id="description" rows="4"
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 md-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Описание..." onChange={handleChangeDescription}></textarea>
                <button type="button" onClick={uploadFile}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-10 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Отправить
                </button>
            </div>
        </div>
    )
}

export default EditForm;