import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Room } from '../../../shared/chat.interface';


export const useRoomQuery = (roomName: any, isConnected: any) => {
  console.log(isConnected)
  axios.get(`http://localhost:3000/api/rooms/${roomName}`).then((response) => {
  console.log(response.data);
});
  const query = useQuery({
    
    queryKey: ['rooms', roomName],
    queryFn: (): Promise<Room> =>
      axios.get(`http://localhost:3000/api/rooms/${roomName}`).then((response) => response.data),
    refetchInterval: 10000,
    enabled: isConnected,
  });

  return query;
};

export const useRoomsQuery = () => {
  axios.get(`http://localhost:3000/api/rooms`).then((response) => {
    console.log(response.data);
  });
  const query = useQuery({
    queryKey: ['select_rooms'],
    queryFn: (): Promise<Room[]> =>
      axios.get(`http://localhost:3000/api/rooms`).then((response) => response.data),

  });

  return query;
};

export const unsetRoom = () => {
  sessionStorage.removeItem('room');
};