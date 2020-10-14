import MiniPhaseMaterial from "../../models/miniPhaseMaterial";

export const DELETE_MPHASE_MATERIAL = "DELETE_MPHASE_MATERIAL";
export const CREATE_MPHASE_MATERIAL = "CREATE_MPHASE_MATERIAL";
export const UPDATE_MPHASE_MATERIAL = "UPDATE_MPHASE_MATERIAL";
export const SET_MATERIALS = "SET_MATERIALS";
export const DELETE_MATERIALS_ONDLTMPHASE = "DELETE_MATERIALS_ONDLTMPHASE";

export const fetchMaterials = () => {
  return async (dispatch) => {
    //any async code you want!
    try {
      const response = await fetch(
        "https://costtracking-app.firebaseio.com/materials.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedMaterials = [];

      for (const key in resData) {
        loadedMaterials.push(
          new MiniPhaseMaterial(
            key,
            resData[key].mPhaseId,
            resData[key].projectPhaseId,
            resData[key].materialName,
            resData[key].quantityUsed,
            resData[key].rate,
            resData[key].totalCost,
            resData[key].description
          )
        );
      }
      dispatch({ type: SET_MATERIALS, materials: loadedMaterials });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteMphaseMaterial = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/materials/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_MPHASE_MATERIAL, materialId: id });
  };
};

export const createMphaseMaterial = (
  mPhaseId,
  projectPhaseId,
  materialName,
  quantityUsed,
  rate,
  totalCost,
  description
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    //any async code you want!
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/materials.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mPhaseId,
          projectPhaseId,
          materialName,
          quantityUsed,
          rate,
          totalCost,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_MPHASE_MATERIAL,
      materialData: {
        id: resData.name,
        mPhaseId,
        projectPhaseId,
        materialName,
        quantityUsed,
        rate,
        totalCost,
        description,
      },
    });
  };
};

export const updateMphaseMaterial = (
  id,
  materialName,
  quantityUsed,
  rate,
  totalCost,
  description
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://costtracking-app.firebaseio.com/materials/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialName,
          quantityUsed,
          rate,
          totalCost,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_MPHASE_MATERIAL,
      matId: id,
      materialData: {
        materialName,
        quantityUsed,
        rate,
        totalCost,
        description,
      },
    });
  };
};

export const deleteMaterialsOnDltMphase = (materialIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    materialIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/materials/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    });
  };
};

export const deleteMaterialsOnDltProject = (materialIds) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    materialIds.forEach(async (id) => {
      const response = await fetch(
        `https://costtracking-app.firebaseio.com/materials/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    });
  };
};
