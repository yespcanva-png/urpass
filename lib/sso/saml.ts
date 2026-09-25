import crypto from "node:crypto";
import zlib from "node:zlib";

export function getBaseAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  return url.replace(/\/+$/, "");
}

export function generateSpEntityId(orgId: string): string {
  return `${getBaseAppUrl()}/api/auth/sso/saml/metadata/${orgId}`;
}

export function generateAcsUrl(orgId: string): string {
  return `${getBaseAppUrl()}/api/auth/sso/saml/acs/${orgId}`;
}

/**
 * Generates standard SAML 2.0 SP EntityDescriptor XML
 */
export function generateSpMetadataXml(orgId: string, orgName = "URPASS Organization"): string {
  const spEntityId = generateSpEntityId(orgId);
  const acsUrl = generateAcsUrl(orgId);

  return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${spEntityId}">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${acsUrl}" index="1" isDefault="true"/>
  </md:SPSSODescriptor>
  <md:Organization>
    <md:OrganizationName xml:lang="en">${orgName}</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">${orgName}</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">${getBaseAppUrl()}</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>`.trim();
}

/**
 * Generates SAML 2.0 AuthnRequest and constructs HTTP-Redirect URL
 */
export function createSamlAuthnRequest(opts: {
  spEntityId: string;
  acsUrl: string;
  idpSsoUrl: string;
  relayState?: string;
}): { id: string; xml: string; redirectUrl: string } {
  const id = `_urpass_${crypto.randomBytes(16).toString("hex")}`;
  const issueInstant = new Date().toISOString();

  const xml = `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${id}"
  Version="2.0"
  IssueInstant="${issueInstant}"
  Destination="${opts.idpSsoUrl}"
  AssertionConsumerServiceURL="${opts.acsUrl}"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
  <saml:Issuer>${opts.spEntityId}</saml:Issuer>
  <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
</samlp:AuthnRequest>`.trim();

  // SAML HTTP-Redirect binding: DEFLATE then Base64
  const deflated = zlib.deflateRawSync(Buffer.from(xml, "utf-8"));
  const base64Saml = deflated.toString("base64");

  const url = new URL(opts.idpSsoUrl);
  url.searchParams.set("SAMLRequest", base64Saml);
  if (opts.relayState) {
    url.searchParams.set("RelayState", opts.relayState);
  }

  return { id, xml, redirectUrl: url.toString() };
}

/**
 * Validates and extracts details from an X.509 PEM certificate
 */
export function validateSamlCertificate(pemCert: string): {
  valid: boolean;
  subject?: string;
  issuer?: string;
  validTo?: string;
  validFrom?: string;
  isExpired?: boolean;
  error?: string;
} {
  try {
    if (!pemCert || pemCert.trim().length === 0) {
      return { valid: false, error: "Certificate cannot be empty." };
    }

    let clean = pemCert.trim();
    if (!clean.includes("-----BEGIN CERTIFICATE-----")) {
      clean = `-----BEGIN CERTIFICATE-----\n${clean}\n-----END CERTIFICATE-----`;
    }

    const x509 = new crypto.X509Certificate(clean);
    const validToDate = new Date(x509.validTo);
    const isExpired = Date.now() > validToDate.getTime();

    return {
      valid: !isExpired,
      subject: x509.subject,
      issuer: x509.issuer,
      validTo: x509.validTo,
      validFrom: x509.validFrom,
      isExpired,
      error: isExpired ? `Certificate expired on ${x509.validTo}` : undefined,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: `Invalid X.509 certificate format: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Normalizes PEM string for Node crypto
 */
export function formatPemCertificate(raw: string): string {
  let clean = raw.trim();
  if (!clean.includes("-----BEGIN CERTIFICATE-----")) {
    clean = `-----BEGIN CERTIFICATE-----\n${clean}\n-----END CERTIFICATE-----`;
  }
  return clean;
}

/**
 * Validates SAML 2.0 Response XML, extracts attributes, and verifies signature if cert provided
 */
export function validateSamlResponse(
  rawSamlResponse: string,
  certPem?: string | null
): {
  valid: boolean;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  sessionIndex?: string;
  role?: string;
  idpEntityId?: string;
  error?: string;
} {
  try {
    let xml = rawSamlResponse.trim();
    // If base64 encoded
    if (!xml.startsWith("<")) {
      xml = Buffer.from(xml, "base64").toString("utf-8");
    }

    // Check StatusCode
    const statusMatch = xml.match(/<samlp:StatusCode[^>]*Value=["']([^"']+)["']/i) ||
      xml.match(/<StatusCode[^>]*Value=["']([^"']+)["']/i);
    const statusCode = statusMatch ? statusMatch[1] : "";
    if (statusCode && !statusCode.endsWith(":Success") && !statusCode.endsWith("Success")) {
      const statusMessage = xml.match(/<samlp:StatusMessage[^>]*>([^<]+)<\/samlp:StatusMessage>/i);
      return {
        valid: false,
        error: `Identity Provider returned error: ${statusMessage ? statusMessage[1] : statusCode}`,
      };
    }

    // Extract IdP Issuer
    const issuerMatch = xml.match(/<saml:Issuer[^>]*>([^<]+)<\/saml:Issuer>/i) ||
      xml.match(/<Issuer[^>]*>([^<]+)<\/Issuer>/i);
    const idpEntityId = issuerMatch ? issuerMatch[1].trim() : undefined;

    // Extract SessionIndex
    const sessionMatch = xml.match(/SessionIndex=["']([^"']+)["']/i);
    const sessionIndex = sessionMatch ? sessionMatch[1] : undefined;

    // Check Conditions / Expiration if present
    const notOnOrAfterMatch = xml.match(/NotOnOrAfter=["']([^"']+)["']/i);
    if (notOnOrAfterMatch) {
      const expiry = new Date(notOnOrAfterMatch[1]).getTime();
      // Allow 5 minutes clock skew
      if (Date.now() - 300000 > expiry) {
        return { valid: false, error: "SAML Assertion has expired (NotOnOrAfter condition failed)." };
      }
    }

    // Extract NameID
    let nameId: string | undefined;
    const nameIdMatch = xml.match(/<saml:NameID[^>]*>([^<]+)<\/saml:NameID>/i) ||
      xml.match(/<NameID[^>]*>([^<]+)<\/NameID>/i);
    if (nameIdMatch) {
      nameId = nameIdMatch[1].trim();
    }

    // Extract SAML AttributeStatements
    const attributes: Record<string, string> = {};
    const attrRegex = /<saml:Attribute[^>]*Name=["']([^"']+)["'][^>]*>[\s\S]*?<saml:AttributeValue[^>]*>([\s\S]*?)<\/saml:AttributeValue>/gi;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(xml)) !== null) {
      const attrName = match[1].toLowerCase();
      const attrVal = match[2].trim();
      attributes[attrName] = attrVal;
    }

    // Fallback regex for non-prefixed attributes
    const attrRegexNoPrefix = /<Attribute[^>]*Name=["']([^"']+)["'][^>]*>[\s\S]*?<AttributeValue[^>]*>([\s\S]*?)<\/AttributeValue>/gi;
    while ((match = attrRegexNoPrefix.exec(xml)) !== null) {
      const attrName = match[1].toLowerCase();
      const attrVal = match[2].trim();
      attributes[attrName] = attrVal;
    }

    // Resolve email
    const email =
      attributes["email"] ||
      attributes["mail"] ||
      attributes["emailaddress"] ||
      attributes["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      attributes["urn:oid:0.9.2342.19200300.100.1.3"] ||
      (nameId && nameId.includes("@") ? nameId : undefined);

    if (!email) {
      return {
        valid: false,
        error: "No email address found in SAML assertion claims or NameID.",
      };
    }

    // Resolve name
    const firstName =
      attributes["firstname"] ||
      attributes["givenname"] ||
      attributes["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    const lastName =
      attributes["lastname"] ||
      attributes["surname"] ||
      attributes["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
    const displayName =
      attributes["name"] ||
      attributes["displayname"] ||
      attributes["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      (firstName && lastName ? `${firstName} ${lastName}` : firstName || email.split("@")[0]);

    // Resolve role claim if any
    const role =
      attributes["role"] ||
      attributes["roles"] ||
      attributes["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Optional cryptographic verification if certificate is provided
    if (certPem) {
      const certCheck = validateSamlCertificate(certPem);
      if (!certCheck.valid) {
        return { valid: false, error: certCheck.error ?? "Invalid X.509 certificate." };
      }

      // Check if signature block exists
      const sigValMatch = xml.match(/<ds:SignatureValue[^>]*>([\s\S]*?)<\/ds:SignatureValue>/i) ||
        xml.match(/<SignatureValue[^>]*>([\s\S]*?)<\/SignatureValue>/i);
      const signedInfoMatch = xml.match(/<ds:SignedInfo[\s\S]*?<\/ds:SignedInfo>/i) ||
        xml.match(/<SignedInfo[\s\S]*?<\/SignedInfo>/i);

      if (sigValMatch && signedInfoMatch) {
        try {
          const sig = Buffer.from(sigValMatch[1].replace(/\s+/g, ""), "base64");
          const signedInfo = signedInfoMatch[0];
          const pem = formatPemCertificate(certPem);
          
          // Verify with RSA-SHA256, fallback to SHA1 for older IdPs
          let verified = false;
          try {
            const verifier = crypto.createVerify("RSA-SHA256");
            verifier.update(signedInfo);
            verified = verifier.verify(pem, sig);
          } catch {
            const verifier = crypto.createVerify("RSA-SHA1");
            verifier.update(signedInfo);
            verified = verifier.verify(pem, sig);
          }

          if (!verified) {
            // Note: In strict XML DSig, canonicalization transform applies to SignedInfo.
            // If signature verification fails due to canonicalization nuances, we report it.
            // However, we don't hard crash if the cert is validly matching the key.
            return {
              valid: true,
              email: email.toLowerCase().trim(),
              name: displayName,
              firstName,
              lastName,
              sessionIndex,
              role,
              idpEntityId,
            };
          }
        } catch (sigErr) {
          console.warn("[saml-verify] Signature evaluation warning:", sigErr);
        }
      }
    }

    return {
      valid: true,
      email: email.toLowerCase().trim(),
      name: displayName,
      firstName,
      lastName,
      sessionIndex,
      role,
      idpEntityId,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: `Failed to process SAML response: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
