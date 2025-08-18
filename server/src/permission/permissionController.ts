import { NextFunction, Request, Response } from "express";
import permissionModel from "./permissionModel";
import componentModel from "../components/componentModel";
import extractUserIdFromRefreshToken from "../helpers/extractUserId";
import cartModel from "../cart/cartModel";
import { getUserByEmail, getUserById } from "../helpers/data";
import { RequestCount } from "../statistics/statisticsModel";
import { sendApprovalEmail, sendRejectedEmail } from "../helpers/sendEmail";
import createHttpError from "http-errors";

const addPermissionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { componentId, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return next(createHttpError(400, "Quantity must be greater than 0"));
  }

  try {
    // Check if the permission request already exists
    const existingPermission = await permissionModel.findOne({
      userId,
      componentId,
    });
    if (existingPermission) {
      return next(createHttpError(400, "Permission request already exists"));
    }

    // Fetch component details to validate that the component exists
    const component = await componentModel.findById(componentId);
    if (!component) {
      return next(createHttpError(404, "Component not found"));
    }

    // Create new permission request
    const newPermissionRequest = new permissionModel({
      userId,
      componentId,
      quantity,
      status: "pending",
    });

    // Save permission request to the database
    await newPermissionRequest.save();

    await cartModel.findOneAndDelete({ userId, componentId });

    // Return the response with the permission request and component details
    res.status(201).json({
      message: "Permission request added",
      permission: newPermissionRequest,
      component: {
        componentName: component.componentName,
        image_url: component.image_url,
        quantity: component.quantity,
      },
    });

    await RequestCount.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error adding permission request:", error);
    next(createHttpError(500, "Error adding permission request"));
  }
};

// Get All Permissions
const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await permissionModel
      .find()
      .populate("componentId", "componentName")
      .exec();

    // const componentName = await componentModel.findById({permissions.componentId})

    // const user = await getUserById(permissions[0].userId.toString());

    for (const permission of permissions) {
      // Await the asynchronous operation for getting the user
      const user = await getUserById(permission.userId.toString());

      // Log the userName

      permission.userName = user?.username || "Unknown User";
    }

    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching all permissions:", error);
    next(createHttpError(500, "Error fetching permissions"));
  }
};

// const getAllPermissions = async (req: Request, res: Response) => {
//   try {
//     // Fetch all permissions with populated component information
//     const permissions = await permissionModel
//       .find()
//       .populate("componentId", "componentName")
//       .exec();

//     // Prepare an array of user IDs from permissions to batch fetch users
//     const userIds = permissions.map((permission) =>
//       permission.userId.toString()
//     );

//     // Fetch all users in one go to avoid multiple await calls inside the loop
//     const users = await getUserById(userIds.toString()); // Assume this function fetches multiple users by their IDs

//     // Map users to a quick lookup object to find them by ID
//     const userMap = users.reduce((acc, user) => {
//       acc[user._id.toString()] = user; // Ensure the ID is a string for comparison
//       return acc;
//     }, {});

//     // Attach the username to each permission by using the userMap
//     permissions.forEach((permission) => {
//       const user = userMap[permission.userId.toString()];
//       permission.userName = user ? user.username : null; // Assign username if user exists
//     });

//     // Return the permissions with user names
//     res.status(200).json(permissions);
//   } catch (error) {
//     console.error("Error fetching all permissions:", error);
//     res.status(500).json({ message: "Error fetching permissions" });
//   }
// };

// const getAllPermissions = async (req: Request, res: Response) => {
//   try {
//     const permissions = await permissionModel.find();

//     const permissionsWithComponentDetails = await Promise.all(
//       permissions.map(async (permission) => {
//         const component = await componentModel.findById(permission.componentId);

//         return {
//           ...permission.toObject(),
//           componentName: component
//             ? component.componentName
//             : "Unknown Component",
//           componentType: component ? component.componentType : "Unknown Type",
//           imageUrl: component ? component.image_url : "",
//         };
//       })
//     );

//     res.status(200).json(permissionsWithComponentDetails);
//   } catch (error) {
//     console.error("Error fetching all permissions:", error);
//     res.status(500).json({ message: "Error fetching permissions" });
//   }
// };

// Get Permissions by UserId
const getAllPermissionsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const permissions = await permissionModel
      .find({ userId }) // Filter by userId
      .populate("componentId", "componentName image_url quantity")
      .exec();

    // if (!permissions.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No permissions found for this user" });
    // }

    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions by userId:", error);
    next(createHttpError(500, "Error fetching permissions"));
  }
};

// Get All Pending Permissions
const getAllPendingComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const pendingPermissions = await permissionModel
      .find({ status: "pending" }) // Filter by userId and pending status
      .populate("componentId", "componentName image_url quantity")
      .exec();

    // if (!pendingPermissions.length) {
    //   return res.status(404).json({ message: "No pending components found" });
    // }

    res.status(200).json(pendingPermissions);
  } catch (error) {
    console.error("Error fetching pending components:", error);
    next(createHttpError(500, "Error fetching pending components"));
  }
};

// Get All Approved Permissions
// const getAllApprovedComponents = async (req: Request, res: Response) => {
//   const userId = extractUserIdFromRefreshToken(req);
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const approvedPermissions = await permissionModel
//       .find({ userId, status: "approved" }) // Filter by userId and approved status
//       .populate("componentId", "componentName image_url quantity")
//       .exec();

//     if (!approvedPermissions.length) {
//       return res.status(404).json({ message: "No approved components found" });
//     }

//     res.status(200).json(approvedPermissions);
//   } catch (error) {
//     console.error("Error fetching approved components:", error);
//     res.status(500).json({ message: "Error fetching approved components" });
//   }
// };

const getAllApprovedComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const approvedPermissions = await permissionModel
      .find({ status: "approved" })
      .populate("componentId", "componentName image_url quantity")
      .exec();

    // Always return an array, even if empty
    return res.status(200).json(approvedPermissions);
  } catch (error) {
    console.error("Error fetching approved components:", error);
    next(createHttpError(500, "Error fetching approved components"));
  }
};

// Get All Rejected Permissions
const getAllRejectedComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const rejectedPermissions = await permissionModel
      .find({ status: "rejected" }) // Filter by userId and rejected status
      .populate("componentId", "componentName image_url quantity")
      .exec();

    // if (!rejectedPermissions.length) {
    //   return res.status(404).json({ message: "No rejected components found" });
    // }

    res.status(200).json(rejectedPermissions);
  } catch (error) {
    console.error("Error fetching rejected components:", error);
    next(createHttpError(500, "Error fetching rejected components"));
  }
};

// Approve Permission Request
const approveComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = extractUserIdFromRefreshToken(req);
  // if (!userId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const { permissionId } = req.params;

  try {
    const permission = await permissionModel.findOne({
      _id: permissionId,
    });

    if (!permission) {
      return next(createHttpError(404, "Permission request not found"));
    }

    // Update the status to "approved"
    permission.status = "approved";
    permission.updatedAt = new Date();
    await permission.save();

    const component = await componentModel.findById(permission.componentId);
    if (!component) {
      return next(createHttpError(404, "Component not found"));
    }

    const user = await getUserById(permission.userId.toString());
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Set due date to 14 days from now

    await sendApprovalEmail(
      user.email,
      component.componentName,
      dueDate.toISOString(),
      permission.status
    );

    // Ensure there's enough quantity
    if (component.quantity < permission.quantity) {
      return next(createHttpError(400, "Insufficient component quantity"));
    }

    // Deduct the quantity
    component.quantity -= permission.quantity;
    await component.save();

    res.status(200).json({ message: "Component approved", permission });
  } catch (error) {
    console.error("Error approving component:", error);
    next(createHttpError(500, "Error approving component"));
  }
};

// Reject Permission Request
const rejectComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { permissionId } = req.params;

  try {
    const permission = await permissionModel.findOne({
      _id: permissionId,
    }); // Ensure permission belongs to user

    if (!permission) {
      return next(createHttpError(404, "Permission request not found"));
    }

    // Update the status to "rejected"
    permission.status = "rejected";
    permission.updatedAt = new Date();
    await permission.save();

    const component = await componentModel.findById(permission.componentId);
    if (!component) {
      return next(createHttpError(404, "Component not found"));
    }

    const user = await getUserById(permission.userId.toString());

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    await sendRejectedEmail(user.email, component.componentName);

    res.status(200).json({ message: "Component rejected", permission });
  } catch (error) {
    console.error("Error rejecting component:", error);
    next(createHttpError(500, "Error rejecting component"));
  }
};

export {
  addPermissionRequest,
  getAllPermissions,
  getAllPermissionsByUserId,
  getAllPendingComponents,
  getAllApprovedComponents,
  getAllRejectedComponents,
  approveComponent,
  rejectComponent,
};
