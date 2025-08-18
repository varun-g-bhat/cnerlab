import { NextFunction, Request, Response } from "express";
import extractUserIdFromRefreshToken from "../helpers/extractUserId";
import permissionModel, {
  IPermissionModel,
} from "../permission/permissionModel";
import PurchaseHistory from "./purchaseModel";
import componentModel, { IComponentModel } from "../components/componentModel";
import { getUserById } from "../helpers/data";
import createHttpError from "http-errors";

const createPurchaseHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { permissionId } = req.body;

  try {
    // Fetch the permission details to validate it exists
    const permission = await permissionModel.findById(permissionId);
    if (!permission) {
      return next(createHttpError(404, "Permission not found"));
    }

    // Set the due date to 14 days from the current date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Add 14 days to the current date

    // Create a new purchase history record
    const newPurchase = new PurchaseHistory({
      userId,
      permissionId,
      dueDate,
      returned: false,
    });

    await newPurchase.save();
    res
      .status(201)
      .json({ message: "Purchase history created", purchase: newPurchase });
  } catch (error) {
    console.error("Error creating purchase history:", error);
    next(createHttpError(500, "Error creating purchase history"));
  }
};

// const getAllPurchases = async (req: Request, res: Response) => {
//   try {
//     const purchases = await PurchaseHistory.find().populate({
//       path: "permissionId",
//       select: "userId componentId",
//       populate: {
//         path: "componentId",
//         select: "componentName",
//         model: "Component",
//       },
//     });

//     // purchases.forEach((purchase) => {
//     //   const permission =
//     //     purchase.permissionId as unknown as IPermissionModel & {
//     //       componentId: IComponentModel;
//     //     };

//     //   const userName = permission.userName || "Unknown User";
//     //   const componentName = permission.componentId?.componentName;

//     // purchases.forEach((purchase) =>
//     for (const purchase of purchases) {
//       if (!purchase.permissionId) {
//         console.warn(`Purchase ${purchase._id} has no permissionId`);
//         return;
//       }

//       const permission =
//         purchase.permissionId as unknown as IPermissionModel & {
//           componentId: IComponentModel;
//         };

//       const user = await getUserById(permission?.userId.toString());

//       // const userId = permission?.userId || "Unknown User";

//       const componentName =
//         permission?.componentId?.componentName || "Unknown Component";

//     res.status(200).json(purchases);
//   } catch (error) {
//     console.error("Error fetching all purchases:", error);
//     res.status(500).json({ message: "Error fetching purchases" });
//   }
// };

const getAllPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchases = await PurchaseHistory.find().populate({
      path: "permissionId",
      select: "userId componentId",
      populate: {
        path: "componentId",
        select: "componentName",
        model: "Component",
      },
    });

    const formattedPurchases = [];

    for (const purchase of purchases) {
      if (!purchase.permissionId) {
        console.warn(`Purchase ${purchase._id} has no permissionId`);
        continue; // Skip this purchase
      }

      const permission =
        purchase.permissionId as unknown as IPermissionModel & {
          componentId: IComponentModel;
        };

      const user = await getUserById(permission.userId.toString()); // Make sure this returns expected data
      const userName = user?.username || "Unknown User"; // Adjust field name based on your user schema
      const componentName =
        permission.componentId?.componentName || "Unknown Component";

      formattedPurchases.push({
        _id: purchase._id,
        userName,
        componentName,
        dueDate: purchase.dueDate,
        returned: purchase.returned,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      });
    }

    res.status(200).json(formattedPurchases);
  } catch (error) {
    console.error("Error fetching all purchases:", error);
    next(createHttpError(500, "Error fetching purchases"));
  }
};

const getPurchaseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  // const { purchaseId } = req.params;

  try {
    const purchases = await PurchaseHistory.find().populate({
      path: "permissionId",
      match: { userId },
      populate: {
        path: "componentId",
        select: "componentName",
        model: "Component",
      },
    });

    const formattedPurchases = [];

    for (const purchase of purchases) {
      if (!purchase.permissionId) {
        console.warn(`Purchase ${purchase._id} has no permissionId`);
        continue; // Skip this purchase
      }

      const permission =
        purchase.permissionId as unknown as IPermissionModel & {
          componentId: IComponentModel;
        };

      const user = await getUserById(permission.userId.toString()); // Make sure this returns expected data
      const userName = user?.username || "Unknown User"; // Adjust field name based on your user schema
      const componentName =
        permission.componentId?.componentName || "Unknown Component";

      formattedPurchases.push({
        _id: purchase._id,
        userName,
        componentName,
        dueDate: purchase.dueDate,
        returned: purchase.returned,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      });
    }

    res.status(200).json(formattedPurchases);
  } catch (error) {
    console.error("Error fetching purchase by ID:", error);
    next(createHttpError(500, "Error fetching purchase"));
  }
};

const renewalOfPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { purchaseId } = req.params;

  try {
    const purchase = await PurchaseHistory.findOne({ _id: purchaseId }); // Ensure that the purchase belongs to the user

    if (!purchase) {
      return next(createHttpError(404, "Purchase not found"));
    }

    // Set the new due date to 14 days from the current date
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 14); // Add 14 days to the current date

    purchase.dueDate = newDueDate; // Update the due date
    await purchase.save();

    res.status(200).json({ message: "Purchase renewed", purchase });
  } catch (error) {
    console.error("Error renewing purchase:", error);
    next(createHttpError(500, "Error renewing purchase"));
  }
};

const returnPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { purchaseId } = req.params;

  try {
    const purchase = await PurchaseHistory.findOne({ _id: purchaseId }); // Ensure that the purchase belongs to the user

    if (!purchase) {
      return next(createHttpError(404, "Purchase not found"));
    }

    // Mark the purchase as returned
    purchase.returned = true;
    await purchase.save();

    const permission = await permissionModel.findById(purchase.permissionId);

    if (!permission) {
      return next(createHttpError(404, "Permission not found"));
    }

    const component = await componentModel.findById(permission.componentId);

    if (!component) {
      return next(createHttpError(404, "Component not found"));
    }

    component.quantity += permission.quantity; // Return the quantity to the component
    await component.save(); // Save the updated component

    res.status(200).json({ message: "Purchase marked as returned", purchase });
  } catch (error) {
    console.error("Error marking purchase as returned:", error);
    next(createHttpError(500, "Error marking purchase as returned"));
  }
};

const editPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { purchaseId } = req.params;
  const { returned } = req.body;

  try {
    const purchase = await PurchaseHistory.findOne({ _id: purchaseId, userId }); // Ensure that the purchase belongs to the user

    if (!purchase) {
      return next(createHttpError(404, "Purchase not found"));
    }

    // Update the purchase
    if (returned !== undefined) {
      purchase.returned = returned;
    }

    await purchase.save();

    res.status(200).json({ message: "Purchase updated", purchase });
  } catch (error) {
    console.error("Error editing purchase:", error);
    next(createHttpError(500, "Error editing purchase"));
  }
};

const getNotReturnedPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Filter purchases where returned is false
    const purchases = await PurchaseHistory.find({ returned: false }).populate({
      path: "permissionId",
      select: "userId componentId",
      populate: {
        path: "componentId",
        select: "componentName",
        model: "Component",
      },
    });

    const formattedPurchases = [];

    for (const purchase of purchases) {
      if (!purchase.permissionId) {
        console.warn(`Purchase ${purchase._id} has no permissionId`);
        continue;
      }

      const permission =
        purchase.permissionId as unknown as IPermissionModel & {
          componentId: IComponentModel;
        };

      const user = await getUserById(permission.userId.toString());
      const userName = user?.username || "Unknown User";
      const componentName =
        permission.componentId?.componentName || "Unknown Component";

      formattedPurchases.push({
        _id: purchase._id,
        userName,
        componentName,
        dueDate: purchase.dueDate,
        returned: purchase.returned,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      });
    }

    res.status(200).json(formattedPurchases);
  } catch (error) {
    console.error("Error fetching not returned purchases:", error);
    next(createHttpError(500, "Error fetching not returned purchases"));
  }
};

export {
  createPurchaseHistory,
  getAllPurchases,
  getPurchaseById,
  renewalOfPurchase,
  returnPurchase,
  editPurchase,
  getNotReturnedPurchases,
};
