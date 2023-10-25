import React, { useEffect, useState } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { User } from '../../../shared/chat.interface';
import { LoginForm } from '../components/login.form';
import { Rooms } from '../components/rooms';
import { LoginLayout } from '../layouts/login.layout';
import { useRoomsQuery } from '../lib/room';
import { generateUserId, getUser, setUser } from '../lib/user';
import { GoogleLogin } from 'react-google-login';

function Login() {

  const {
    data: { user, roomName },
  } = useMatch<LoginLocationGenerics>();

  const [joinRoomSelection, setJoinRoomSelection] = useState<string>('');
  
  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery();
  const navigate = useNavigate();

  const login = (e: React.FormEvent<HTMLFormElement>) => {
   let userFormValue = e.currentTarget.login.value;
   let roomFormValue = e.currentTarget.room.value;
    const newUser = {
      userId: generateUserId(userFormValue),
      userName: userFormValue,
    };
    setUser({ id: newUser.userId, name: newUser.userName });
    if (joinRoomSelection !== '') {
      sessionStorage.setItem('room', joinRoomSelection);
    } else {
      sessionStorage.setItem('room', roomFormValue);
    }
    navigate({ to: '/chat' });
  };
  const handleGoogleLoginSuccess = (response: any) => {
    const user = {
      id: response.profileObj.googleId,
      name: response.profileObj.name,
    };
    setUser(user);
    navigate({ to: '/chat' });
  };

  const handleGoogleLoginFailure = (error: any) => {
    console.log(error);
  };

  useEffect(() => {
    if (user?.userId && roomName) {
      navigate({ to: '/chat', replace: true });
    }
  }, [navigate, roomName, user?.userId]);

  return (
    <LoginLayout>
      <Rooms
        rooms={rooms ?? []}
        selectionHandler={setJoinRoomSelection}
        selectedRoom={joinRoomSelection}
        isLoading={roomsLoading}
      ></Rooms>  
     
      <LoginForm
        defaultUser={user?.userName}
        disableNewRoom={joinRoomSelection !== ''}
        login={login}
      ></LoginForm>
      <GoogleLogin
        clientId="787833986023-o9vq2gq2sepfco2ptktenuvi9epskci7.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={handleGoogleLoginSuccess}
        onFailure={handleGoogleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />

    </LoginLayout>
    
  );
}

export const loader = async () => {
  const user = getUser();
  return {
    user: user,
    roomName: sessionStorage.getItem('room'),
  };
};

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
    roomName: string;
  };
}>;

export default Login;