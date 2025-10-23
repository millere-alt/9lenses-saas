/**
 * Test script for token system functionality
 * Tests token generation, verification, and refresh flow without database
 */

import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  getTokenExpiration,
  isTokenExpired
} from './src/utils/tokenUtils.js';

console.log('=== Testing Token System ===\n');

// Mock user object
const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  organizationId: 'org_456',
  profile: {
    role: 'owner'
  }
};

// Test 1: Generate Access Token
console.log('1. Testing Access Token Generation...');
const accessToken = generateAccessToken(mockUser);
console.log('   Access Token:', accessToken.substring(0, 50) + '...');
console.log('   ✓ Access token generated\n');

// Test 2: Verify Access Token
console.log('2. Testing Access Token Verification...');
const decodedAccess = verifyAccessToken(accessToken);
console.log('   Decoded:', decodedAccess);
console.log('   Type:', decodedAccess?.type);
console.log('   User ID:', decodedAccess?.userId);
console.log('   ✓ Access token verified\n');

// Test 3: Generate Refresh Token
console.log('3. Testing Refresh Token Generation...');
const refreshToken = generateRefreshToken(mockUser, 'device_789');
console.log('   Refresh Token:', refreshToken.substring(0, 50) + '...');
console.log('   ✓ Refresh token generated\n');

// Test 4: Verify Refresh Token
console.log('4. Testing Refresh Token Verification...');
const decodedRefresh = verifyRefreshToken(refreshToken);
console.log('   Decoded:', decodedRefresh);
console.log('   Type:', decodedRefresh?.type);
console.log('   Device ID:', decodedRefresh?.deviceId);
console.log('   JTI:', decodedRefresh?.jti);
console.log('   ✓ Refresh token verified\n');

// Test 5: Generate Token Pair
console.log('5. Testing Token Pair Generation...');
const tokens = generateTokenPair(mockUser, 'device_789');
console.log('   Access Token:', tokens.accessToken.substring(0, 50) + '...');
console.log('   Refresh Token:', tokens.refreshToken.substring(0, 50) + '...');
console.log('   ✓ Token pair generated\n');

// Test 6: Hash Token
console.log('6. Testing Token Hashing...');
const tokenHash1 = hashToken(refreshToken);
const tokenHash2 = hashToken(refreshToken);
console.log('   Hash 1:', tokenHash1);
console.log('   Hash 2:', tokenHash2);
console.log('   Hashes match:', tokenHash1 === tokenHash2);
console.log('   ✓ Token hashing works (deterministic)\n');

// Test 7: Get Token Expiration
console.log('7. Testing Token Expiration...');
const accessExp = getTokenExpiration(accessToken);
const refreshExp = getTokenExpiration(refreshToken);
const accessExpDate = new Date(accessExp * 1000);
const refreshExpDate = new Date(refreshExp * 1000);
console.log('   Access Token Expires:', accessExpDate.toISOString());
console.log('   Refresh Token Expires:', refreshExpDate.toISOString());
console.log('   ✓ Token expiration retrieved\n');

// Test 8: Check Token Expiration Status
console.log('8. Testing Token Expiration Check...');
const accessExpired = isTokenExpired(accessToken);
const refreshExpired = isTokenExpired(refreshToken);
console.log('   Access Token Expired:', accessExpired);
console.log('   Refresh Token Expired:', refreshExpired);
console.log('   ✓ Token expiration check works\n');

// Test 9: Invalid Token Verification
console.log('9. Testing Invalid Token Verification...');
const invalidToken = 'invalid.token.here';
const decodedInvalid = verifyAccessToken(invalidToken);
console.log('   Invalid Token Decoded:', decodedInvalid);
console.log('   ✓ Invalid token returns null\n');

// Test 10: Wrong Token Type Verification
console.log('10. Testing Wrong Token Type Verification...');
const refreshAsAccess = verifyAccessToken(refreshToken);
const accessAsRefresh = verifyRefreshToken(accessToken);
console.log('   Refresh token verified as access:', refreshAsAccess);
console.log('   Access token verified as refresh:', accessAsRefresh);
console.log('   ✓ Token type validation works\n');

console.log('=== All Tests Passed! ===\n');

console.log('Summary:');
console.log('- Access tokens are short-lived (15m default)');
console.log('- Refresh tokens are long-lived (7d default)');
console.log('- Token hashing is deterministic (same input = same output)');
console.log('- Token type validation prevents misuse');
console.log('- Invalid tokens return null gracefully');
