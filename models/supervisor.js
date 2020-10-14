class Supervisor {
  constructor(
    id,
    userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    jobTitle,
    profilePic
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.jobTitle = jobTitle;
    this.profilePic = profilePic;
  }
}

export default Supervisor;
