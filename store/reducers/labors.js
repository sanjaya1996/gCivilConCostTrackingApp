import { MINIPHASELABORS, LABORS } from "../../data/stakeholders";
import {
  DELETE_MPHASE_LABOR,
  CREATE_MPHASE_LABOR,
  UPDATE_MPHASE_LABOR,
  SET_LABORS,
} from "../actions/labors";
import { DELETE_MINIPHASE } from "../actions/miniPhases";
import MiniPhaseLabor from "../../models/miniPhaseLabor";

const initialState = {
  miniPhaseLabors: [],
  availableLabors: [],
  projectTotalLaborCost: 0,
};

const laborsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LABORS:
      return {
        ...state,
        miniPhaseLabors: action.labors,
      };
    case CREATE_MPHASE_LABOR:
      const newLabor = new MiniPhaseLabor(
        action.laborData.id,
        action.laborData.mPhaseId,
        action.laborData.projectPhaseId,
        action.laborData.fName,
        action.laborData.lName,
        action.laborData.email,
        action.laborData.phone,
        action.laborData.role,
        action.laborData.availability,
        action.laborData.payRate,
        action.laborData.amountPaid,
        action.laborData.accountDetails,
        action.laborData.description,
        action.laborData.supervisorId
      );
      return {
        ...state,
        miniPhaseLabors: state.miniPhaseLabors.concat(newLabor),
      };
    case UPDATE_MPHASE_LABOR:
      const laborIndex = state.miniPhaseLabors.findIndex(
        (labor) => labor.id === action.lid
      );

      const updatedLabor = new MiniPhaseLabor(
        action.lid,
        state.miniPhaseLabors[laborIndex].miniPhaseId,
        state.miniPhaseLabors[laborIndex].phaseId,
        action.laborData.fName,
        action.laborData.lName,
        action.laborData.email,
        action.laborData.phone,
        action.laborData.role,
        action.laborData.availability,
        action.laborData.payRate,
        action.laborData.amountPaid,
        action.laborData.accountDetails,
        action.laborData.description,
        action.laborData.supervisorId
      );

      const updatedMphaseLabors = [...state.miniPhaseLabors];
      updatedMphaseLabors[laborIndex] = updatedLabor;

      return {
        ...state,
        miniPhaseLabors: updatedMphaseLabors,
      };
    case DELETE_MPHASE_LABOR:
      return {
        ...state,
        miniPhaseLabors: state.miniPhaseLabors.filter(
          (labor) => labor.id !== action.laborId
        ),
      };
    case DELETE_MINIPHASE:
      return {
        ...state,
        miniPhaseLabors: state.miniPhaseLabors.filter(
          (labor) => labor.miniPhaseId !== action.mPhaseId
        ),
      };
    default:
      return state;
  }
};

export default laborsReducer;
