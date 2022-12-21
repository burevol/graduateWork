import {useState} from "react";
import {Navbar} from "flowbite-react";
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import SearchField from "./search"
import AvatarField from "./Avatar";
import { logout } from "./store/auth";

export default function Navigation() {

    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const [isOpen, setStateOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function doLogout() {
        setStateOpen(false)
        dispatch(logout());
        navigate("/")
    }

    function toggleMenu() {
        setStateOpen(!isOpen);
    }

    return (
        <Navbar
            fluid={true}
            rounded={true}
            menuOpen={false}
        >
            <Navbar.Brand href="/">
                <img
                    src="/icon.png"
                    className="mr-3 h-6 sm:h-9"
                    alt="VideoSRV Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    VideoSRV
                </span>
            </Navbar.Brand>
            <SearchField></SearchField>
            <div className="relative">
                <button
                    onClick={toggleMenu}
                >
                    { currentUser ? <AvatarField userId={currentUser.user.pk}/> : <AvatarField userId={null}/> }
                </button>
                 <button
                        className={
                            isOpen ? (
                                ' cursor-default bg-black opacity-50 fixed inset-0 w-full h-full'
                            ) : (
                                'hidden'
                            )
                        }
                        onClick={() => {setStateOpen(false)}}
                        tabIndex="-1"
                    />
                <div
                    className={
                        isOpen ? (
                            'absolute right-0 mt-2 w-48 bg-white rounded-lg py-2 shadow-xl'
                        ) : (
                            'hidden'
                        )
                    }
                >

                    {currentUser ? <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                        Профиль
                    </a> : "" }
                    {!currentUser ? <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                        Вход
                    </a> : ""}
                    {!currentUser ? <a href="/register" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                        Регистрация
                    </a> : "" }
                    {currentUser ? <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white" onClick={doLogout}>
                        Выход
                    </a> : "" }
                </div>
            </div>
        </Navbar>

    )
}