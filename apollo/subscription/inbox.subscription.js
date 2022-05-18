import { gql } from "graphql-tag";

export const SUB_INBOX_BY_ROOM = gql`
  subscription SubNewInboxByRoom($userId: String!, $roomId: String!) {
    subNewInboxByRoom(userID: $userId, roomID: $roomId) {
      ... on Message {
        id
        from {
          id
          name
          userID
          avatar
        }
        content
        createdAt
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
      ... on Image {
        id
        images
        createdAt
        from {
          id
          name
          userID
          avatar
        }
      }
      ... on File {
        id
        file
        createdAt
        from {
          id
          name
          userID
          avatar
        }
      }
    }
  }
`
