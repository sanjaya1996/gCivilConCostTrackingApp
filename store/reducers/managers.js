import { MANAGERS } from "../../data/stakeholders";
import {
  CREATE_MANAGER,
  UPDATE_MANAGER,
  DELETE_MANAGER,
  SET_MANAGERS,
} from "../actions/managers";
import Manager from "../../models/manager";

const initialState = {
  managers: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MANAGERS:
      return {
        managers: action.managers,
      };
    case CREATE_MANAGER:
      const newManager = new Manager(
        action.managerData.id,
        action.managerData.fName,
        action.managerData.lName,
        action.managerData.email,
        action.managerData.phone,
        action.managerData.supervisorId
      );
      return {
        managers: state.managers.concat(newManager),
      };
    case UPDATE_MANAGER:
      const managerIndex = state.managers.findIndex(
        (manager) => manager.id === action.id
      );
      const updatedManager = new Manager(
        action.id,
        action.managerData.fName,
        action.managerData.lName,
        action.managerData.email,
        action.managerData.phone,
        state.managers[managerIndex].supervisorId
      );
      const updatedManagersArray = [...state.managers];
      updatedManagersArray[managerIndex] = updatedManager;

      return {
        managers: updatedManagersArray,
      };
    case DELETE_MANAGER:
      return {
        managers: state.managers.filter((manager) => manager.id != action.id),
      };
    default:
      return state;
  }
};
