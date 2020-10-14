class MiniPhaseMaterial {
  constructor(
    id,
    miniPhaseId,
    phaseId,
    materialName,
    quantityUsed,
    rate,
    totalCost,
    description
  ) {
    this.id = id;
    this.miniPhaseId = miniPhaseId;
    this.phaseId = phaseId;
    this.materialName = materialName;
    this.quantityUsed = quantityUsed;
    this.rate = rate;
    this.totalCost = totalCost;
    this.description = description;
  }
}

export default MiniPhaseMaterial;
