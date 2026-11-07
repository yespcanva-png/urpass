# PRODUCTHUNT50 rollout

The checkout accepts `PRODUCTHUNT50` for new organisers buying Pro monthly in INR. It uses a Razorpay recurring subscription. The checkout shows ₹499.50 plus 18% GST for billing cycles 1–3, then ₹999 plus 18% GST monthly from cycle 4. It does not stack with referrals or other coupons. An account may redeem it once. The promo has no application end date.

The code is unavailable until the external Razorpay subscription offer is configured and tested. Apply migration `135_product_hunt_subscription_offer.sql` first. In Razorpay test mode, create an offer linked to the ₹999/month Pro subscription plan that discounts exactly ₹499.50 on each of the first three charges and stops before the fourth. Confirm that Razorpay supports this schedule for the intended payment methods and that its authorization screen discloses the later ₹999 renewal. Test charges 1–4, cancellation, repeated checkout, and an existing paid organiser. Set `RAZORPAY_PRODUCTHUNT50_OFFER_ID` to the matching offer ID and `RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED=true` only after those checks pass in the target environment.

If the provider cannot apply a three-cycle offer and return the expected first charge of ₹589.41 including GST, leave the verification flag false. Do not publish the Product Hunt promotion until the provider setup and checkout are verified.
