import React from "react";

const UserList = ({ users }) => {
  return (
    <div id="user-list">
      <h2>Currently Playing</h2>
      {Object.keys(users).map((id) => {
        return (
          <p className="username" key={id}>
            {users[id].drawer ? <> DRAWER -- </> : <></>}
            {users[id].name}
          </p>
        );
      })}
    </div>
  );
};
export default UserList;
