import React from 'react';
import type { RoomId } from '../../types';

/** Keep the floor clickable without drawing selection boundaries. */
export function RoomHitArea({ room, points }: { room: RoomId; points: string }) {
  return <polygon data-room-hit-area={room} points={points} fill="transparent" />;
}
