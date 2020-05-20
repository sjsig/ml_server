import { Router } from "express";
import * as UserController from "./controllers/user_controller";
import * as PropertyController from "./controllers/property_controller";
import * as UnitController from "./controllers/unit_controller";

import { isLoggedIn, isAuthorized, isAdmin } from "./middleware/auth";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "welcome to our landlord api!" });
});

// USER CONTROLLER
router.route("/users/:userId")
  .get(UserController.getUser)
  .delete(UserController.deleteUser);

router.post("/signin", UserController.signin);
router.post("/signup", UserController.signup);

// PROPERTY CONTROLLER
router.route("/property/:propertyId")
  .get(isLoggedIn, PropertyController.getProperty)
  .delete(isLoggedIn, PropertyController.deleteProperty)
  .put(isLoggedIn, PropertyController.updateProperty);

router.route("/property")
.get(isLoggedIn, PropertyController.getAllProperties)
.post(isLoggedIn, PropertyController.createProperty);

// UNIT CONTROLLER
router.route("/property/:propertyId/unit/:unitId").get(UnitController.deleteUnit).delete(UnitController.deleteUnit);

router.route("/property/:propertyId/unit").post(UnitController.createUnit);

export default router;
