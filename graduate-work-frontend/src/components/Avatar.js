import {useEffect, useState} from 'react';
import {api} from './api/main_api'

function AvatarField({userId}) {

    const [img, setImg] = useState('');
    useEffect(() => {
        if (userId) {
            try {
                api.get(`/api/user/${userId}`)
                    .then((response) => {
                        setImg(response.data.avatar)
                        console.log(response.data.avatar)
                    })
            } catch (e) {
                return console.error(e.message);
            }
        } else {
            setImg("/empty.png")
        }
    }, [userId]);

    return (<div className="flex flex-wrap gap-2">

        <img className="w-10 h-10 rounded-full" src={img} alt="Rounded avatar"/>


    </div>)
}

export default AvatarField;