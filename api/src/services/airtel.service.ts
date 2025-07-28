
// api/src/services/airtel.service.ts
import fetch from 'node-fetch';

const BASE_URL = process.env.AIRTEL_API_BASE_URL;
const CLIENT_ID = process.env.AIRTEL_API_CLIENT_ID;
const CLIENT_SECRET = process.env.AIRTEL_API_CLIENT_SECRET;
const COUNTRY = process.env.AIRTEL_API_COUNTRY || 'GA';
const CURRENCY = process.env.AIRTEL_API_CURRENCY || 'XAF';

let authToken: { token: string; expiresAt: number } | null = null;

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

interface UssdPushPayload {
    msisdn: string;
    amount: number;
    transactionId: string;
}

/**
 * Initiates a USSD Push Payment request using Airtel Money Collection API.
 */
export async function initiateUssdPushPayment({ msisdn, amount, transactionId }: UssdPushPayload) {
    if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
        throw new Error("Airtel API environment variables are not configured.");
    }
    const token = await getAuthToken();

    const body = {
        "reference": `Donation ${transactionId}`,
        "subscriber": {
            "country": COUNTRY,
            "currency": CURRENCY,
            "msisdn": msisdn
        },
        "transaction": {
            "amount": amount,
            "country": COUNTRY,
            "currency": CURRENCY,
            "id": transactionId
        }
    };

    const response = await fetch(`${BASE_URL}/merchant/v2/payments/`, {
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
        console.error("Airtel USSD Push Error:", responseData);
        throw new Error(responseData.status.message || "Airtel USSD Push failed");
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
    if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
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
