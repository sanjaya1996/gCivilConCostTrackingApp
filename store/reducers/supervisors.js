import {
  CREATE_SUPERVISOR_PROFILE,
  UPDATE_SUPERVISOR_PROFILE,
  SET_SUPERVISOR_PROFILE,
} from "../actions/supervisors";
import Supervisor from "../../models/supervisor";

const initialState = {
  supervisors: [],
  user: {},
};

const supervisorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUPERVISOR_PROFILE:
      return {
        supervisors: action.supervisors,
        user: action.user,
      };
    case CREATE_SUPERVISOR_PROFILE:
      const newSupervisor = new Supervisor(
        action.profileData.id,
        action.profileData.userId,
        action.profileData.fName,
        action.profileData.lName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.jobTitle,
        action.profileData.profilePic
      );
      return {
        supervisors: state.supervisors.concat(newSupervisor),
        user: newSupervisor,
      };
    case UPDATE_SUPERVISOR_PROFILE:
      const supervisorIndex = state.supervisors.findIndex(
        (supervisor) => supervisor.id === action.id
      );
      const updatedSupervisorProf = new Supervisor(
        action.id,
        state.supervisors[supervisorIndex].userId,
        action.profileData.fName,
        action.profileData.lName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.jobTitle,
        action.profileData.profilePic
      );
      const updatedSupervisorsState = [...state.supervisors];
      updatedSupervisorsState[supervisorIndex] = updatedSupervisorProf;
      return {
        supervisors: updatedSupervisorsState,
        user: updatedSupervisorProf,
      };
    default:
      return { ...state };
  }
};

export default supervisorsReducer;
