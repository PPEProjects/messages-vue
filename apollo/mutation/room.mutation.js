import {gql} from "graphql-tag";

export const UPSERT_GROUP = gql`
  mutation RoomUpsert($input: UpserRoomInput!) {
    roomUpsert(input: $input) {
      id
      name
    }
  }
`
