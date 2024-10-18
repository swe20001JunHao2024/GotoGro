// src/utils/jwtUtils.js
export function jwtDecode(token, options) {
    if (typeof token !== "string") {
        throw new Error("Invalid token specified: must be a string");
    }
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") {
        throw new Error(`Invalid token specified: missing part #${pos + 1}`);
    }
    let decoded;
    try {
        decoded = base64UrlDecode(part);
    } catch (e) {
        throw new Error(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
        return JSON.parse(decoded);
    } catch (e) {
        throw new Error(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
}

// Add the base64UrlDecode function if you don't have it
function base64UrlDecode(str) {
    // Pad string to make it a multiple of 4
    const padding = '='.repeat((4 - str.length % 4) % 4);
    const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
}
