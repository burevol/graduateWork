import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar } from "flowbite-react";
import { api } from './api/user_api'

function AvatarField({ user }) {

    const currentUser = useSelector((state) => state.storageData.users.username)
    const [img, setImg] = useState('');

    useEffect(() => {
        try {
            api.get(`/users?username=${user}`)
                .then((response) => {
                    if (user === '') {
                        setImg("")
                    } else {
                        setImg(response.data[0].img)
                    }

                })
        }
        catch (e) {
            return console.error(e.message);
        }
    }, [currentUser, user]);

    return (<div className="flex flex-wrap gap-2">
        <Link to={`/user/${user}`}>
            <Avatar
                img={img}
                rounded={true}
            />
        </Link>
    </div>)
}

export default AvatarField;