const Notification = ({ notification }) => {
  const { message, error } = notification

  if (message) {
    return <div className="message" >{message}</div>
  }
  if (error) {
    return <div className="errorMessage" >{error}</div>
  }
  return null
}

export default Notification