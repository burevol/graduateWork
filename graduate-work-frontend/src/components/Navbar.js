import {Navbar, Button} from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import SearchField from "./search"
import AvatarField from "./Avatar";

export default function Navigation() {

    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const navigate = useNavigate();

    function doLogin() {
        navigate({
            pathname: '/login',
        })
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
            {
                (currentUser) ? <AvatarField user={currentUser}></AvatarField> :
                    <Button onClick={doLogin}>Login</Button>
            }
        </Navbar>

    )
}