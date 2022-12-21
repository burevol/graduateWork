import {useEffect, useState} from 'react';
import {Avatar} from "flowbite-react";
import {api} from './api/main_api'

function AvatarField({userId}) {

    const [img, setImg] = useState('');
    useEffect(() => {
        if (userId) {
            try {
                api.get(`/api/user/${userId}`)
                    .then((response) => {
                        setImg(response.data.avatar)
                    })
            } catch (e) {
                return console.error(e.message);
            }
        } else {
            setImg("")
        }
    }, [userId]);

    return (<div className="flex flex-wrap gap-2">
        {/* <Link to={`/user/${user}`}> */}
        <Avatar
            img={img}
            rounded={true}
        />
        {/*</Link>*/}
    </div>)
}

export default AvatarField;