import {gql} from "graphql-tag";

export const SEND_MESSAGE = gql`
  mutation MessageSend($input: CreateMessageInput!, $roomId: String!) {
    messageSend(input: $input, roomId: $roomId) {
      id
      from {
        id
        name
        userID
        avatar
      }
      createdAt
    }
  }
`

export const KICK_MEMBERS = gql`
  mutation RoomKick($input: KickRoomInput!) {
    roomKick(input: $input) {
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
