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
        isRecall
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
        isRecall
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
        isRecall
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

export const SUB_UPDATING_INBOX = gql`
  subscription SubUpdatingInbox($roomId: String!) {
    subUpdatingInbox(roomID: $roomId) {
      ... on Message {
        id
        isRecall
      }
      ... on Image {
        id
        isRecall
      }
      ... on File {
        id
        isRecall
      }
    }
  }
`
