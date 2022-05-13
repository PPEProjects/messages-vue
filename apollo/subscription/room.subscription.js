import {gql} from "graphql-tag";

export const SUB_NEW_MESSAGE = gql`
  subscription RoomSubMessage($roomId: String!, $userId: String!) {
    roomSubMessage(roomID: $roomId, userID: $userId) {
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

export const SUB_USER_ONLINE = gql`
  subscription RoomOnlines($roomId: String!, $userId: String!) {
    roomOnlines(roomID: $roomId, userID: $userId) {
      room {
        id
      }
      onlines
    }
  }
`

export const SUB_MY_ROOMS = gql`
  subscription SubMyRooms($userId: String!) {
    subMyRooms(userID: $userId) {
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
        updatedAt
      }
      messages {
        id
        from {
          id
          name
          userID
          avatar
          createdAt
        }
        content
        readAt {
          user {
            id
            name
            userID
            avatar
          }
          time
        }
      }
    }
  }
`
