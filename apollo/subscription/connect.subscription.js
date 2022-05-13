import { gql } from "graphql-tag";

export const MESSAGE_CONNECT = gql`
  subscription Connect($input: CreateConnectInput!) {
    connect(input: $input) {
      id
      name
      avatar
    }
  }
`
