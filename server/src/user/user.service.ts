import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room, User} from '../../../shared/chat.interface';
import { authenticator } from 'otplib';


@Injectable()
export class UserService {
    private rooms: Room[] = [];
    
    async addRoom(roomName:string, host:User): Promise<void>{
        const room = await this.getRoomByName(roomName)
        if (room === -1){
            await this.rooms.push({name: roomName, host, users:[host]})
        }
    }
    async getRoomByName(roomName: string): Promise<number>{
        const roomIndex = this.rooms.findIndex((room) =>room?.name === roomName)
        return roomIndex        
    }
    async getRoomHost(hostName: string): Promise<User>{
        const roomIndex = await this.getRoomByName(hostName)
        return this.rooms[roomIndex].host
    }
    async removeRoom(roomName: string): Promise<void>{
        const findRoom = await this.getRoomByName(roomName)
        if (findRoom !== -1)
        {
            this.rooms = this.rooms.filter((room => room.name !== roomName))
        }
    }
    async addUserToRoom(roomName: string, user: User) : Promise<void>{
        const roomIndex = await this.getRoomByName(roomName)
        if (roomIndex !== -1){
            this.rooms[roomIndex].users.push(user)
            const host = await this.getRoomHost(roomName)
            if (host.userId === user.userId){
                this.rooms[roomIndex].host.socketId = user.socketId
            }
        }
        else
            await this.addRoom(roomName, user)
    }
    async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
        const filteredRooms = this.rooms.filter((room) => {
            const found = room.users.find((user) => user.socketId === socketId)
            if(found){
                return found
            }
        })
        return filteredRooms
    }
    async removeUserFromRoom(SocketId: string, roomName: string): Promise<void>{
        const room = await this.getRoomByName(roomName)
        this.rooms[room].users = this.rooms[room].users.filter((user) => user.socketId !== SocketId)
        if (this.rooms[room].users.length === 0) {
          await this.removeRoom(roomName)
        }
    }

    async getRooms(): Promise<Room[]> {
        return this.rooms
    }
    async removeUserFromAllRooms(socketId: string): Promise<void> {
        const rooms = await this.findRoomsByUserSocketId(socketId)
        for (const room of rooms) {
          await this.removeUserFromRoom(socketId, room.name)
        }
    }





    constructor(private prisma: PrismaService){}
    async activate2fa(user: any){
        const optauthUrl = authenticator.keyuri(
            user.id,
            process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
            user.two_factor_auth_key,
        );
        const updated = await this.prisma.user.update({
            where: {id: user.id},
            data: {two_factor_auth: true, two_factor_auth_uri : optauthUrl},
        });
        return {
            two_factor_auth_uri : optauthUrl,
            two_factor_auth: updated.two_factor_auth,
        };
    }
    async deactivate2fa(user: any) {
        const updated = await this.prisma.user.update({
          where: { id: user.id },
          data: { two_factor_auth: false, two_factor_auth_uri: null },
        });
        return { two_factor_auth: updated.two_factor_auth };
      }
    async verify2fa(user: any, code: string){
        const isValid = authenticator.verify({
            token: code,
            secret: user.two_factor_auth_key,
        });
        if (isValid){
            await this.prisma.user.update({
                where: { id :user.id,},
                    data:{ code_verified: true,},
            });
            return true;
        }
        return false;
    }



}
