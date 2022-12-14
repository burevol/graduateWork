import AvatarField from "./Avatar";

function OtherMessage({  user, message  }) {
   
        return (
            <div className="flex justify-start mb-4 mt-auto">
                <AvatarField user={user} />
                <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                    {message}
                </div>
                
            </div>
        )
}

export default OtherMessage;

