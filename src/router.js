import { Router } from "express";
import * as UserController from "./controllers/user_controller";
import * as PropertyController from "./controllers/property_controller";
import * as UnitController from "./controllers/unit_controller";
import * as LeaseController from "./controllers/lease_controller";
import * as RatingController from "./controllers/rating_controller";
import * as TransactionController from "./controllers/transaction_controller";

import { isLoggedIn, isAuthorized, isAdmin } from "./middleware/auth";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "welcome to our landlord api!" });
});

// USER CONTROLLER
router.route("/users/:userId").get(UserController.getUser).delete(UserController.deleteUser);

router.post("/auth/signin", UserController.signin);
router.post("/auth/signup", UserController.signup);

// PROPERTY CONTROLLER
router
  .route("/property/:propertyId")
  .get(isLoggedIn, PropertyController.getProperty)
  .delete(isLoggedIn, PropertyController.deleteProperty)
  .put(isLoggedIn, PropertyController.updateProperty);

router
  .route("/property")
  .get(isLoggedIn, PropertyController.getAllProperties)
  .post(isLoggedIn, PropertyController.createProperty);

router.route("/property/landlord/:userId").get(isAuthorized, PropertyController.getLandlordProperties);

router.route("/listings").get(PropertyController.getVacantUnits);

// UNIT CONTROLLER
router
  .route("/unit/:unitId")
  .get(UnitController.getUnit)
  .delete(UnitController.deleteUnit)
  .put(UnitController.updateUnit);

router.route("/property/:propertyId/unit").get(UnitController.getAllUnitsByProperty).post(UnitController.createUnit);

// LEASE CONTROLLER
router
  .route("/unit/:unitId/lease/:leaseId")
  .get(LeaseController.getLease)
  .delete(LeaseController.deleteLease)
  .put(LeaseController.updateLease);

router.route("/unit/:unitId/lease").post(isLoggedIn, LeaseController.createLease);

router.route("/lease/:userId").get(isAuthorized, LeaseController.getSignedLease);

// RATING CONTROLLER

router
  .route("/rating/:landlord_id/rater/:userId")
  .get(isAuthorized, RatingController.getRating)
  .post(isLoggedIn, RatingController.createRating)
  .put(isAuthorized, RatingController.editRating)
  .delete(isAuthorized, RatingController.deleteRating);
router.route("/rating/:landlord_id/score").get(RatingController.getUserScore);
router.route("/rating/:landlord_id").get(RatingController.getAllRatings);

// TRANSACTION CONTROLLER

router.route("/user/:userId/transaction").get(isAuthorized, TransactionController.getUserTransactionHistory);
router
  .route("/user/:userId/balance")
  .get(isAuthorized, TransactionController.getUserBalance)
  .post(isAuthorized, TransactionController.addToBalance);

export default router;
