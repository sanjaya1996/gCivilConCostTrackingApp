class Client {
  constructor(
    id,
    projectId,
    firstName,
    lastName,
    email,
    phoneNumber,
    supervisorId
  ) {
    this.id = id;
    this.projectId = projectId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.supervisorId = supervisorId;
  }
}

export default Client;
