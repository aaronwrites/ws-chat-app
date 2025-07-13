import { Room } from "./Room";
import { randomBytes } from 'crypto';

export class RoomManager {
    private rooms = new Map<string, Room>();

    createRoom() {
        const roomCode = randomBytes(3).toString('hex').toUpperCase();
        const room = new Room();
        this.rooms.set(roomCode, room);
        return roomCode;
    }

    getRoom(roomCode : string) {
        return this.rooms.get(roomCode);
    }

    deleteRoom(roomCode : string) {
        return this.rooms.delete(roomCode);
    }
}