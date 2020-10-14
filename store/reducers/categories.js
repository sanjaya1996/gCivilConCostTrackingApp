import {
  UPDATE_PROJECTPHASE,
  CREATE_PROJECTPHASE,
  SET_PROJECTPHASES,
} from "../actions/categories";
import Category from "../../models/category";

const inititalState = {
  projectCategories: [],
};

const categoriesReducer = (state = inititalState, action) => {
  switch (action.type) {
    case SET_PROJECTPHASES:
      return {
        projectCategories: action.projectPhases,
      };
    case CREATE_PROJECTPHASE:
      const newCategory = new Category(
        action.projectPhaseData.id,
        action.projectPhaseData.projectId,
        action.projectPhaseData.title,
        action.projectPhaseData.startedDate,
        action.projectPhaseData.estimatedDate,
        action.projectPhaseData.estimatedBudget
      );
      return {
        ...state,
        projectCategories: state.projectCategories.concat(newCategory),
      };
    case UPDATE_PROJECTPHASE:
      const categoryIndex = state.projectCategories.findIndex(
        (phase) => phase.id === action.phaseId
      );
      const updatedCategory = new Category(
        action.phaseId,
        state.projectCategories[categoryIndex].projectId,
        state.projectCategories[categoryIndex].title,
        action.projectPhaseData.startedDate,
        action.projectPhaseData.estimatedDate,
        action.projectPhaseData.estimatedBudget
      );
      const updatedProjectCategories = [...state.projectCategories];
      updatedProjectCategories[categoryIndex] = updatedCategory;
      return {
        ...state,
        projectCategories: updatedProjectCategories,
      };
    default:
      return state;
  }
};

export default categoriesReducer;
