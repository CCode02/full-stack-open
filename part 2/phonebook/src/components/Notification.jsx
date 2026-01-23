const Notification = ({ message }) => {
    if(message === null){
        return null
    }

    return (
        <div className="notificationMessage">
            {message}
        </div>
    )
}

export default Notification