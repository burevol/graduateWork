function Comment(props) {
    return (
        <div>
            {props.author}: {props.body}
        </div>
    )
}

export default Comment;