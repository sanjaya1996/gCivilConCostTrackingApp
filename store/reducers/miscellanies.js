import {
  MINIPHASEMISCELLANIES,
  MPHASEOTHERCOST_TOTAL,
} from "../../data/dummy-data";
import {
  DELETE_MPHASE_MISCELLANY,
  CREATE_MPHASE_MISCELLANY,
  UPDATE_MPHASE_MISCELLANY,
  SET_MISCELLANIES,
} from "../actions/miscellanies";
import { DELETE_MINIPHASE } from "../actions/miniPhases";
import MiniPhaseMiscellaneous from "../../models/miniPhaseMiscellaneous";

const initialState = {
  miniPhaseMiscellanies: MINIPHASEMISCELLANIES,
  allMiscellanies: [],
  mPhaseTotalOtherCost: MPHASEOTHERCOST_TOTAL,
};

const miscellaniesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MISCELLANIES:
      return {
        ...state,
        miniPhaseMiscellanies: action.miscellanies,
      };
    case CREATE_MPHASE_MISCELLANY:
      const newMiscellany = new MiniPhaseMiscellaneous(
        action.miscellanyData.id,
        action.miscellanyData.mPhaseId,
        action.miscellanyData.projectPhaseId,
        action.miscellanyData.title,
        action.miscellanyData.description,
        action.miscellanyData.totalCost
      );
      return {
        ...state,
        miniPhaseMiscellanies: state.miniPhaseMiscellanies.concat(
          newMiscellany
        ),
      };

    case UPDATE_MPHASE_MISCELLANY:
      const miscellanyIndex = state.miniPhaseMiscellanies.findIndex(
        (miscellany) => miscellany.id === action.misId
      );
      const miscellanyMphaseId =
        state.miniPhaseMiscellanies[miscellanyIndex].miniPhaseId;
      const miscellanyPhaseId =
        state.miniPhaseMiscellanies[miscellanyIndex].phaseId;
      const updatedMiscellany = new MiniPhaseMiscellaneous(
        action.misId,
        miscellanyMphaseId,
        miscellanyPhaseId,
        action.miscellanyData.title,
        action.miscellanyData.description,
        action.miscellanyData.totalCost
      );
      const updatedMphaseMiscellanies = [...state.miniPhaseMiscellanies];
      updatedMphaseMiscellanies[miscellanyIndex] = updatedMiscellany;
      return {
        ...state,
        miniPhaseMiscellanies: updatedMphaseMiscellanies,
      };

    case DELETE_MPHASE_MISCELLANY:
      return {
        ...state,
        miniPhaseMiscellanies: state.miniPhaseMiscellanies.filter(
          (miscellany) => miscellany.id !== action.miscellanyId
        ),
      };
    case DELETE_MINIPHASE:
      return {
        ...state,
        miniPhaseMiscellanies: state.miniPhaseMiscellanies.filter(
          (miscellany) => miscellany.miniPhaseId !== action.mPhaseId
        ),
      };
    default:
      return state;
  }
};

export default miscellaniesReducer;
