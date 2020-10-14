import { not } from "react-native-reanimated";

class UserNote {
  constructor(
    id,
    title,
    description,
    images,
    reminderTime,
    notificationId,
    userId
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.images = images;
    this.reminderTime = reminderTime;
    this.notificationId = notificationId;
    this.userId = userId;
  }
}
export default UserNote;
