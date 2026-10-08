import crypto from "node:crypto";

export interface PayUPaymentRequest {
  merchantKey: string;
  merchantSalt: string;
  environment?: "production" | "sandbox";
  txnid: string;
  amount: number | string;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  surl: string; // Success callback URL
  furl: string; // Failure callback URL
  udf1?: string; // e.g. eventId
  udf2?: string; // e.g. ticketTypeId
  udf3?: string; // e.g. attendeeId or reservationId
  udf4?: string; // e.g. organizationId
  udf5?: string; // e.g. metadata
}

export interface PayUResponsePayload {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  status: string; // "success" | "failure" | "pending"
  hash: string;
  mihpayid?: string;
  bank_ref_num?: string;
  error?: string;
  error_Message?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  [key: string]: unknown;
}

/**
 * Returns PayU payment gateway endpoint URL based on environment
 */
export function getPayUEndpoint(environment: "production" | "sandbox" = "production"): string {
  return environment === "sandbox"
    ? "https://test.payu.in/_payment"
    : "https://secure.payu.in/_payment";
}

/**
 * Generates PayU SHA-512 Request Hash
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayUHash(params: {
  merchantKey: string;
  merchantSalt: string;
  txnid: string;
  amount: number | string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const formattedAmount =
    typeof params.amount === "number" ? params.amount.toFixed(2) : parseFloat(params.amount).toFixed(2);

  const hashString = [
    params.merchantKey,
    params.txnid,
    formattedAmount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    "", // udf6
    "", // udf7
    "", // udf8
    "", // udf9
    "", // udf10
    params.merchantSalt,
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex").toLowerCase();
}

/**
 * Verifies PayU SHA-512 Response / Webhook Hash
 * Formula: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Or with additional charges: sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  payload: PayUResponsePayload,
  merchantSalt: string
): boolean {
  if (!payload.hash || !payload.key || !payload.txnid || !payload.status) {
    return false;
  }

  const formattedAmount = parseFloat(payload.amount).toFixed(2);

  // Normal reverse hash sequence
  const hashString = [
    merchantSalt,
    payload.status,
    "", // udf10
    "", // udf9
    "", // udf8
    "", // udf7
    "", // udf6
    payload.udf5 || "",
    payload.udf4 || "",
    payload.udf3 || "",
    payload.udf2 || "",
    payload.udf1 || "",
    payload.email || "",
    payload.firstname || "",
    payload.productinfo || "",
    formattedAmount,
    payload.txnid,
    payload.key,
  ].join("|");

  const expectedHash = crypto.createHash("sha512").update(hashString).digest("hex").toLowerCase();
  const receivedHash = payload.hash.toLowerCase();

  if (expectedHash === receivedHash) {
    return true;
  }

  // Handle case where additionalCharges is present in response
  if (payload.additionalCharges) {
    const additionalHashString = `${payload.additionalCharges}|${hashString}`;
    const expectedAdditionalHash = crypto
      .createHash("sha512")
      .update(additionalHashString)
      .digest("hex")
      .toLowerCase();
    if (expectedAdditionalHash === receivedHash) {
      return true;
    }
  }

  return false;
}

/**
 * Builds complete parameters and form fields for PayU Checkout submission
 */
export function buildPayUPaymentParams(req: PayUPaymentRequest): {
  actionUrl: string;
  fields: Record<string, string>;
} {
  const formattedAmount =
    typeof req.amount === "number" ? req.amount.toFixed(2) : parseFloat(req.amount).toFixed(2);

  const hash = generatePayUHash({
    merchantKey: req.merchantKey,
    merchantSalt: req.merchantSalt,
    txnid: req.txnid,
    amount: formattedAmount,
    productinfo: req.productinfo,
    firstname: req.firstname,
    email: req.email,
    udf1: req.udf1,
    udf2: req.udf2,
    udf3: req.udf3,
    udf4: req.udf4,
    udf5: req.udf5,
  });

  const fields: Record<string, string> = {
    key: req.merchantKey,
    txnid: req.txnid,
    amount: formattedAmount,
    productinfo: req.productinfo,
    firstname: req.firstname,
    email: req.email,
    phone: req.phone || "",
    surl: req.surl,
    furl: req.furl,
    hash,
  };

  if (req.udf1) fields.udf1 = req.udf1;
  if (req.udf2) fields.udf2 = req.udf2;
  if (req.udf3) fields.udf3 = req.udf3;
  if (req.udf4) fields.udf4 = req.udf4;
  if (req.udf5) fields.udf5 = req.udf5;

  return {
    actionUrl: getPayUEndpoint(req.environment || "production"),
    fields,
  };
}
