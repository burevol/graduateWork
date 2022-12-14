import { useNavigate } from 'react-router-dom';
import Navigation from './Navbar'

function UploadForm() {

    const navigate = useNavigate();

    function uploadFile() {
        navigate("/profile")
    }

    return (
        <div>
            <Navigation />
            <div className="container max-w-sm px-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Файл видео</label>
                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="pict_input">Файл превью</label>
                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="pict_input" type="file"></input>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="name_input">Название</label>
                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="name_input" type="text"></input>

                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 md-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Описание..."></textarea>
                <button type="button" onClick={uploadFile} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-10 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Отправить</button>
            </div>
        </div>
    )
}

export default UploadForm;