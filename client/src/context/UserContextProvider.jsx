import React, { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";


const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate()

  const value = {
    user,
    setUser,
    navigate
  };

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
export { UserContext };
