import AvatarField from "./Avatar";

function MyMessage({ user, message}) {

    return (
        <div className="flex justify-end mb-4 mt-auto">
            <div className="mb-4 mr-2 py-3 px-4  bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-black">
                {message}
            </div>
            <AvatarField user={user} />
        </div>
    )
}

export default MyMessage;
