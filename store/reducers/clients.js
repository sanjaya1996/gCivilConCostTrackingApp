import { CLIENTS } from "../../data/stakeholders";
import {
  UPDATE_CLIENT,
  DELETE_CLIENT,
  CREATE_CLIENT,
  SET_CLIENT,
} from "../actions/clients";
import Client from "../../models/client";

const initialState = {
  clients: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return {
        clients: action.clients,
      };
    case CREATE_CLIENT:
      const newClient = new Client(
        action.clientData.id,
        action.clientData.projectId,
        action.clientData.fName,
        action.clientData.lName,
        action.clientData.email,
        action.clientData.phone,
        action.clientData.supervisorId
      );
      return {
        clients: state.clients.concat(newClient),
      };
    case UPDATE_CLIENT:
      const clientIndex = state.clients.findIndex(
        (client) => client.id === action.id
      );
      const updatedClient = new Client(
        action.id,
        state.clients[clientIndex].projectId,
        action.clientData.fName,
        action.clientData.lName,
        action.clientData.email,
        action.clientData.phone,
        state.clients[clientIndex].supervisorId
      );
      const updatedProjectClients = [...state.clients];
      updatedProjectClients[clientIndex] = updatedClient;
      return {
        clients: updatedProjectClients,
      };
    case DELETE_CLIENT:
      return {
        clients: state.clients.filter((client) => client.id != action.id),
      };
    default:
      return state;
  }
};
