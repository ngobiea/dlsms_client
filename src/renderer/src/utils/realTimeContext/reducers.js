
export const SET_VIDEO_AND_AUDIO_STREAM = 'SET_VIDEO_AND_AUDIO_STREAM';


export const mediasoupReducer = (state, action) => {
  if (action.type === SET_VIDEO_AND_AUDIO_STREAM) {
    return {
      ...state,
      audioParams: {
        track: action.payload.getAudioTracks()[0],
        ...state.audioParams,
      },
      videoParams: {
        track: action.payload.getVideoTracks()[0],
        ...state.videoParams,
      },
    };
  }
  return state;
};
