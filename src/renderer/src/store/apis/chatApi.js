import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001',
    prepareHeaders: (header) => {
      const cookie = localStorage.getItem('user');
      const token = JSON.parse(cookie).token;
      if (token) {
        header.set('authorization', `Bearer ${token}`);
      }
      return header;
    },
  }),
});
