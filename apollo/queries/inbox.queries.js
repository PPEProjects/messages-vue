import { gql } from 'graphql-tag'

export const GET_INBOXS = gql`
  query InboxsGet($filter: GetInboxsInput!) {
    inboxsGet(filter: $filter) {
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
