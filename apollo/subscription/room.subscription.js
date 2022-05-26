import {gql} from "graphql-tag";

export const SUB_USER_ONLINE = gql`
  subscription RoomOnlines($roomId: String!, $userId: String!) {
    roomOnlines(roomID: $roomId, userID: $userId) {
      room {
        id
        name
        avatar
        users {
          id
          name
          userID
          avatar
        }
        createdAt
      }
      onlines
    }
  }
`

export const SUB_MY_ROOMS = gql`
  subscription SubMyRooms($userId: String!) {
    subMyRooms(userID: $userId) {
      id
      name
      avatar
      users {
        id
        name
        userID
        avatar
      }
      updatedAt
    }
  }
`

export const SUB_ROOM_CALLING = gql`
  subscription Subscription($roomId: String!) {
    subCallingRooms(roomID: $roomId)
  }
`


export const SUB_CALLING = gql`
  subscription Subscription($roomId: String!, $userId: String!) {
    subCalling(roomID: $roomId, userID: $userId)
  }
`

export const SUB_WAITING_CALLING = gql`
  subscription SubWaitingCall($userId: String!) {
    subWaitingCall(userID: $userId) {
      id
      name
      avatar
      users {
        id
        name
        userID
        avatar
      }
      createdAt
    }
  }
`
