import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { postScheduleClassSessionQuery } from './classroomApi/postScheduleClassSession';
import { fetchClassroomsQuery } from './classroomApi/fetchClassrooms';
import { createClassroomQuery } from './classroomApi/createClassroomQuery';
import { fetchClassroomQuery } from './classroomApi/fetchClassroomQuery';
import { postJoinClassroomQuery } from './classroomApi/postJoinClassroomQuery';
import { verifyClassroomCodeQuery } from './classroomApi/verifyClassroomCodeQuery';
import { prepareHeaders } from './classroomApi/prepareHeaders';
const classroomApi = createApi({
  reducerPath: 'classroomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001',
    prepareHeaders,
  }),
  endpoints(builder) {
    return {
      createClassroom: builder.mutation({
        invalidatesTags: ['classroom'],
        query: createClassroomQuery,
      }),
      fetchClassrooms: builder.query({
        providesTags: ['classroom'],
        query: fetchClassroomsQuery,
      }),
      fetchClassroom: builder.query({
        query: fetchClassroomQuery,
      }),
      verifyClassroomCode: builder.mutation({
        query: verifyClassroomCodeQuery,
      }),
      postJoinClassroom: builder.mutation({
        query: postJoinClassroomQuery,
      }),
      postScheduleClassSession: builder.mutation({
        query: postScheduleClassSessionQuery,
      }),
    };
  },
});

export const {
  useCreateClassroomMutation,
  useFetchClassroomsQuery,
  useFetchClassroomQuery,
  useVerifyClassroomCodeMutation,
  usePostJoinClassroomMutation,
  usePostScheduleClassSessionMutation,
} = classroomApi;

export { classroomApi };
