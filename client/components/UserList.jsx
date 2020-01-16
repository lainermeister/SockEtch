import React from 'react'

const UserList = ({ users }) => {
    return <>
        <h2>Currently Playing</h2>
        {
            Object.keys(users).map((id) => {
                return <p>{users[id].name}</p>
            })}
    </>
}
export default UserList;