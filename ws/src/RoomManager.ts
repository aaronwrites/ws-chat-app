import { Room } from "./Room";
import { randomBytes } from 'crypto';

export class RoomManager {
    private rooms = new Map<string, Room>();

    createRoom() {
        const roomId = randomBytes(3).toString('hex').toUpperCase();
        const room = new Room();
        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId : string) {
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId : string) {
        this.rooms.delete(roomId);
    }
}