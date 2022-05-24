import {gql} from "graphql-tag";

export const UPSERT_GROUP = gql`
  mutation RoomUpsert($input: UpserRoomInput!) {
    roomUpsert(input: $input) {
      id
      name
    }
  }
`


export const ADD_USERS_TO_GROUP = gql `
  mutation RoomAdd($input: AddToRoomInput!) {
    roomAdd(input: $input) {
      id
      updatedAt
    }
  }
`


export const UPDATE_ROOM = gql`
  mutation RoomUpdateInfo($input: UpdateRoomInfoInput!) {
    roomUpdateInfo(input: $input) {
      id
    }
  }
`

export const READ_MESSAGE = gql`
  mutation MessageRead($input: ReadMessageInput!) {
    messageRead(input: $input) {
      id
    }
  }
`
