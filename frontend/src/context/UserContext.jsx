import React from 'react'
import { useState } from 'react'

export const UserDataContext = React.createContext() // Create a context for user data


const UserContext = ({children}) => {

    const [user, setUser] = useState({
        id: '',
        name: '',
        email:'',
        role: '',
        createdAt: '',
        quizCoins: 0
    });

    return (
        <div>
            <UserDataContext.Provider value={{user, setUser}}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext