// class Phase {
//   constructor(id, phaseName) {
//     this.id = id;
//     this.phaseName = phaseName;
//   }
// }

// export default Phase;

class Category {
  constructor(id, projectId, title, startDate, estimatedDate, estimatedBudget) {
    this.id = id;
    this.projectId = projectId;
    this.title = title;
    this.startDate = startDate;
    this.estimatedDate = estimatedDate;
    this.estimatedBudget = estimatedBudget;
  }
}

export default Category;
