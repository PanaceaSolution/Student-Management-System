import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState({
      userName: 'John Doe',
      role: "Admin",

   });
   const [staff, setStaff] = useState({
      firstName: 'John',
      lastName: 'Doe',
      role: "Librarian"
   });


   return (
      <AuthContext.Provider value={{ user, staff }}>
         {children}
      </AuthContext.Provider>
   );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
   return useContext(AuthContext);
};
