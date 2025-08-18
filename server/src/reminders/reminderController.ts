import { IComponentModel } from "../components/componentModel";
import { getUserById } from "../helpers/data";
import { sendReminderEmail } from "../helpers/sendEmail";
import { IPermissionModel } from "../permission/permissionModel";
import purchaseModel from "../purchaseHistory/purchaseModel";

export const sendDueDateReminders = async () => {
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  const purchases = await purchaseModel
    .find({
      returned: false,
      reminderSent: false,
      dueDate: {
        $gte: today,
        $lte: threeDaysFromNow,
      },
    })
    .populate({
      path: "permissionId",
      select: "userId componentId",
      populate: {
        path: "componentId",
        select: "componentName",
        model: "Component",
      },
    });

  for (const purchase of purchases) {
    if (!purchase.permissionId) continue;

    const permission = purchase.permissionId as unknown as IPermissionModel & {
      componentId: IComponentModel;
    };

    const user = await getUserById(permission.userId.toString());
    const userEmail = user?.email;
    const componentName =
      permission.componentId?.componentName || "Unknown Component";

    if (userEmail) {
      await sendReminderEmail(
        userEmail,
        componentName,
        new Date(purchase.dueDate).toDateString()
      );

      purchase.reminderSent = true;
      await purchase.save();

      console.log(
        `Reminder sent to ${userEmail} for component "${componentName}".`
      );
    }
  }

  return { message: "Reminders processed." };
};
