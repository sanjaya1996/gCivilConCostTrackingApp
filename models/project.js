class Project {
  constructor(
    id,
    clientId,
    supervisorId,
    projectTitle,
    projectAddress,
    startDate,
    estimatedDate,
    estimatedBudget
  ) {
    this.id = id;
    this.clientId = clientId;
    this.supervisorId = supervisorId;
    this.projectTitle = projectTitle;
    this.projectAddress = projectAddress;
    this.startDate = startDate;
    this.estimatedDate = estimatedDate;
    this.estimatedBudget = estimatedBudget;
  }
}

export default Project;
