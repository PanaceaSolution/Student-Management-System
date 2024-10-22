import { create } from "zustand";

const useStudent=create((set)=>({
    students:[],
    setStudents:(students)=>set({students})
}))

export default useStudent