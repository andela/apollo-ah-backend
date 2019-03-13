/**
 * @description This class represents a notification in the app
 * @class NotificationsController
 */
class NotificationsController {
  /**
   * This function creates a new notification
   * It checks if the user is ok with getting notifications
   * By default a user gets in-app notifications if the user wants to recieve them in general
   * It checks what type of notification a user wants to get and sends it
   * @param {String} message - The message to be sent
   * @param {Array} userIds - The users to send notifications to
   * @returns {Boolean} - returns boolean
   */
  static async create(message, userIds) {
    // loop through each user
    userIds = Array(userIds);
    let i;
    for (i = 0; i < userIds.length; i += 1) {
      // for a single id
      let id = userIds[i];
      // get the user settings

      // if the user can recieve settings...
    }
  }
}
export default NotificationsController;
