import { gql } from 'graphql-tag'

export const GET_ROOMS = gql`
  query GetRooms($input: GetRoomsInput!) {
    getRooms(input: $input) {
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

export const GET_ROOM_MESSAGES = gql`
  query MessagesByRoom($filter: GetMessagesInput!) {
    messagesByRoom(filter: $filter) {
      id
      from {
        id
        name
        avatar
        userID
      }
      content
      readAt {
        user {
          id
          name
          avatar
          userID
        }
        time
      }
      createdAt
    }
  }
`

export const GET_ROOM = gql`
  query RoomGet($roomId: String!, $userId: String!) {
    roomGet(roomID: $roomId, userID: $userId) {
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

export const GET_ROOM_CALLING = gql`
  query Query($roomId: String!) {
    getRoomCalling(roomID: $roomId)
  }
`
