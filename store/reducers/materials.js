import { MPHASEMATERIALCOST_TOTAL } from "../../data/dummy-data";
import {
  DELETE_MPHASE_MATERIAL,
  CREATE_MPHASE_MATERIAL,
  UPDATE_MPHASE_MATERIAL,
  SET_MATERIALS,
} from "../actions/materials";
import { DELETE_MINIPHASE } from "../actions/miniPhases";
import MiniPhaseMaterial from "../../models/miniPhaseMaterial";

const initialState = {
  miniPhaseMaterials: [],
  availableMaterials: [],
  mPhasetotalMaterialCost: MPHASEMATERIALCOST_TOTAL,
};

const materialsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MATERIALS:
      return {
        ...state,
        miniPhaseMaterials: action.materials,
      };
    case CREATE_MPHASE_MATERIAL:
      const newMaterial = new MiniPhaseMaterial(
        action.materialData.id,
        action.materialData.mPhaseId,
        action.materialData.projectPhaseId,
        action.materialData.materialName,
        action.materialData.quantityUsed,
        action.materialData.rate,
        action.materialData.totalCost,
        action.materialData.description
      );
      return {
        ...state,
        miniPhaseMaterials: state.miniPhaseMaterials.concat(newMaterial),
      };
    case UPDATE_MPHASE_MATERIAL:
      const materialIndex = state.miniPhaseMaterials.findIndex(
        (material) => material.id === action.matId
      );

      const updatedMaterial = new MiniPhaseMaterial(
        action.matId,
        state.miniPhaseMaterials[materialIndex].miniPhaseId,
        state.miniPhaseMaterials[materialIndex].phaseId,
        action.materialData.materialName,
        action.materialData.quantityUsed,
        action.materialData.rate,
        action.materialData.totalCost,
        action.materialData.description
      );
      const updatedMphaseMaterials = [...state.miniPhaseMaterials];
      updatedMphaseMaterials[materialIndex] = updatedMaterial;
      return {
        ...state,
        miniPhaseMaterials: updatedMphaseMaterials,
      };
    case DELETE_MPHASE_MATERIAL:
      return {
        ...state,
        miniPhaseMaterials: state.miniPhaseMaterials.filter(
          (material) => material.id !== action.materialId
        ),
      };
    case DELETE_MINIPHASE:
      return {
        ...state,
        miniPhaseMaterials: state.miniPhaseMaterials.filter(
          (material) => material.miniPhaseId !== action.mPhaseId
        ),
      };
    default:
      return state;
  }
};

export default materialsReducer;
