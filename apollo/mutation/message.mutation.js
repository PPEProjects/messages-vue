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
    }
  }
`

export const SEND_IMAGES = gql`
  mutation ImageMessageSend($input: CreateImageInput!, $roomId: String!) {
    imageMessageSend(input: $input, roomId: $roomId) {
      id
    }
  }
`

export const SEND_FILE = gql`
  mutation FileCreate($input: CreateFileInput!, $roomId: String!) {
    fileCreate(input: $input, roomId: $roomId) {
      id
    }
  }
`
