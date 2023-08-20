import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useReducer,
} from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import {
  useFetchClassroomsQuery,
  setClassrooms,
  setStudents,
  store,
  setMessages,
  setVideoEnable,
  setMicEnable,
} from '../store';
import { useDispatch } from 'react-redux';
import { joinClassroomHandler } from '../realTimeCommunication/classroom/joinClassroomHandler';
import { classroomScheduleMessageHandle } from '../realTimeCommunication/classroom/classroom/classroomScheduleMessageHandle';
import { params } from '../utils/mediasoup/params';
import {
  mediasoupReducer,
  SET_VIDEO_AND_AUDIO_STREAM,
} from '../utils/realTimeContext/reducers';

const userDetails = JSON.parse(localStorage.getItem('user'));
let socket;

const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef();
  const { accountType } = store.getState().account;
  const { data, isSuccess } = useFetchClassroomsQuery(accountType);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [state, dispatchReducer] = useReducer(mediasoupReducer, {
    device: null,
    rtpCapabilities: null,
    producerTransport: null,
    consumerTransports: [],
    audioProducer: null,
    videoProducer: null,
    audioParams: { params },
    videoParams: { params },
  });

  const connectWithSocketServer = () => {
    const jwtToken = userDetails.token;
    socket = io('http://localhost:5001', {
      auth: {
        token: jwtToken,
      },
    });
    socket.on('connect', () => {
      console.log('successfully connected with socket.io server');
      console.log(socket.id);
    });
    socket.on('online-users', (value) => {
      console.log(value);
    });
    socket.on('connect_error', (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });
    socket.on('update-classroom-members', (value) => {
      joinClassroomHandler(value, navigate);
    });
    socket.on('send-classroom', (value) => {
      store.dispatch(setStudents(value.students));
      store.dispatch(setMessages(value.messages));
    });
    socket.on('classroom-schedule-message', (value) => {
      console.log('received classroom schedule message event');
      classroomScheduleMessageHandle(value, navigate);
    });
  };

  useEffect(() => {
    if (!userDetails) {
      logoutHandler();
    }
    if (isSuccess) {
      dispatch(setClassrooms(data.classrooms));
      connectWithSocketServer();
    }
  }, [data, isSuccess]);

  const setUpWebCam = (video, audio) => {
    if (video || audio) {
      navigator.mediaDevices
        .getUserMedia({
          audio,
          video: video
            ? {
                width: {
                  min: 560,
                  max: 1920,
                },
                height: {
                  min: 400,
                  max: 1080,
                },
              }
            : video,
        })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          setLocalStream(mediaStream);
          dispatchReducer({
            type: SET_VIDEO_AND_AUDIO_STREAM,
            payload: mediaStream,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const disableWebcam = () => {
    const { isMicEnable } = store.getState().session;
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    if (isMicEnable) {
      setUpWebCam(false, isMicEnable);
    } else {
      setLocalStream(null);
    }
  };

  const toggleCamera = () => {
    const { isMicEnable } = store.getState().session;
    localStream.getVideoTracks()[0].enabled = isMicEnable;
    // console.log(isVideoEnable);
    // if (isVideoEnable) {
    //   const tracks = videoRef.current.srcObject.getTracks();
    //   tracks.forEach((track) => {
    //     track.stop();
    //   });
    //   store.dispatch(setVideoEnable(false));
    // } else {
    //       videoRef.current.srcObject = mediaStream;

    // }

    // localStream.getVideoTracks()[0].enabled = !isVideoEnable;
    // const tracks = videoRef.current.srcObject.getTracks();
    // tracks.forEach((track) => {
    //   track.stop();
    // });

    // }
  };
  const enabledMic = (value) => {
    localStream.getAudioTracks()[0].enabled = true;
  };
  const disableMic = () => {
    localStream.getAudioTracks()[0].enabled = false;
  };

  const values = {
    socket,
    setUpWebCam,
    localStream,
    remoteStreams,
    videoRef,
    disableWebcam,
    toggleCamera,
    enabledMic,
    disableMic,
  };

  return (
    <RealtimeContext.Provider value={values}>
      {children}
    </RealtimeContext.Provider>
  );
};

export { RealtimeProvider };
export default RealtimeContext;
