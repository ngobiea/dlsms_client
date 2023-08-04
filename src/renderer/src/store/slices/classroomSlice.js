import { createSlice } from '@reduxjs/toolkit';

const classroomSlice = createSlice({
  name: 'classroom',
  initialState: {
    classrooms: [],
    classroomId: '',
    name: '',
    code: '',
    description: '',
    tutor: {
      id: '',
      firstName: '',
      lastName: '',
    },
    students: [],
  },
  reducers: {
    setClassRoomId(state, action) {
      state.classroomId = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setDescription(state, action) {
      state.description = action.payload;
    },
    setCode(state, action) {
      state.code = action.payload;
    },
    setTuTor(state, action) {
      state.tutor = action.payload;
    },
    setStudents(state, action) {
      state.students = action.payload;
    },
    addStudent(state, action) {
      state.students.push(action.payload);
    },
    setClassrooms(state, action) {
      state.classrooms = action.payload;
    },
  },
});

export const {
  setClassRoomId,
  setName,
  setDescription,
  setCode,
  setTuTor,
  setStudents,
  addStudent,
  setClassrooms,
} = classroomSlice.actions;
export const classroomReducer = classroomSlice.reducer;
