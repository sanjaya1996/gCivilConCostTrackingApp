class MiniPhaseLabor {
  constructor(
    id,
    miniPhaseId,
    phaseId,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    availability,
    hourlyRate,
    amountPaid,
    accountDetails,
    description,
    supervisorId
  ) {
    this.id = id;
    this.miniPhaseId = miniPhaseId;
    this.phaseId = phaseId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.availability = availability;
    this.hourlyRate = hourlyRate;
    this.amountPaid = amountPaid;
    this.accountDetails = accountDetails;
    this.description = description;
    this.supervisorId = supervisorId;
  }
}

export default MiniPhaseLabor;
