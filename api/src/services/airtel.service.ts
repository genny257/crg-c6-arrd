
// api/src/services/airtel.service.ts
import fetch from 'node-fetch';
import forge from 'node-forge';

const BASE_URL = process.env.AIRTEL_API_BASE_URL;
const CLIENT_ID = process.env.AIRTEL_API_CLIENT_ID;
const CLIENT_SECRET = process.env.AIRTEL_API_CLIENT_SECRET;
const COUNTRY = process.env.AIRTEL_API_COUNTRY;
const CURRENCY = process.env.AIRTEL_API_CURRENCY;
const PUBLIC_KEY = process.env.AIRTEL_API_PUBLIC_KEY;

let authToken: { token: string; expiresAt: number } | null = null;

/**
 * Encrypts the user PIN using Airtel's public key (RSA/OAEP).
 * @param {string} pin - The 4-digit user PIN.
 * @returns {string} The Base64 encoded encrypted PIN.
 */
function encryptPin(pin: string): string {
    if (!PUBLIC_KEY) {
        throw new Error("Airtel public key is not configured in environment variables.");
    }
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const encrypted = publicKey.encrypt(pin, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha1.create()
      }
    });

    return forge.util.encode64(encrypted);
}


/**
 * Gets a valid OAuth2 token from Airtel Money API, refreshing if necessary.
 */
async function getAuthToken(): Promise<string> {
    if (authToken && authToken.expiresAt > Date.now()) {
        return authToken.token;
    }

    const response = await fetch(`${BASE_URL}/auth/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials'
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Airtel Auth Error:", errorBody);
        throw new Error('Failed to authenticate with Airtel Money API');
    }

    const data: any = await response.json();
    authToken = {
        token: data.access_token,
        expiresAt: Date.now() + (parseInt(data.expires_in, 10) - 300) * 1000, // Refresh 5 minutes before expiry
    };

    return authToken.token;
}

interface CashInPayload {
    msisdn: string;
    amount: number;
    transactionId: string;
    pin: string;
}

/**
 * Initiates a Cash-In transaction using Airtel Money API.
 */
export async function initiateCashIn({ msisdn, amount, transactionId, pin }: CashInPayload) {
    if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !COUNTRY || !CURRENCY) {
        throw new Error("Airtel API environment variables are not configured.");
    }
    const token = await getAuthToken();

    const encryptedPin = encryptPin(pin); 

    const body = {
        "subscriber": {
            "msisdn": msisdn
        },
        "transaction": {
            "amount": amount.toString(),
            "id": transactionId
        },
        "reference": `Donation ${transactionId}`,
        "pin": encryptedPin
    };

    const response = await fetch(`${BASE_URL}/standard/v2/cashin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'X-Country': COUNTRY,
            'X-Currency': CURRENCY,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    
    const responseData = await response.json();

    if (!response.ok || !responseData.status.success) {
        console.error("Airtel Cash-In Error:", responseData);
        throw new Error(responseData.status.message || "Airtel Cash-In failed");
    }

    return responseData;
}

interface TransactionsSummaryPayload {
    from: number;
    to: number;
    limit: number;
    offset: number;
}
/**
 * Retrieves a summary of transactions for a defined period.
 */
export async function getTransactionsSummary({ from, to, limit, offset }: TransactionsSummaryPayload) {
    if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !COUNTRY || !CURRENCY) {
        throw new Error("Airtel API environment variables are not configured.");
    }
    const token = await getAuthToken();

    const queryParams = new URLSearchParams({
        from: from.toString(),
        to: to.toString(),
        limit: limit.toString(),
        offset: offset.toString()
    });

    const response = await fetch(`${BASE_URL}/merchant/v1/transactions?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'X-Country': COUNTRY,
            'X-Currency': CURRENCY,
            'Authorization': `Bearer ${token}`
        },
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.status.success) {
        console.error("Airtel Transaction Summary Error:", responseData);
        throw new Error(responseData.status.message || "Failed to fetch transaction summary");
    }

    return responseData;
}
