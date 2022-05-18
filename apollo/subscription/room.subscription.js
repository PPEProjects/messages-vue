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
