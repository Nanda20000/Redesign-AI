import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const SESSION_DIR = path.join(process.cwd(), 'generated-pages', '.session');

/**
 * Ensure session directory exists
 */
function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }
}

/**
 * Get session file path
 */
function getSessionPath(): string {
  ensureSessionDir();
  return path.join(SESSION_DIR, 'unlock-tokens.json');
}

/**
 * Session data structure
 */
interface SessionData {
  unlockedSlugs: string[];
  createdAt: number;
  expiresAt: number;
}

/**
 * Load session from disk
 */
function loadSession(): SessionData | null {
  const sessionPath = getSessionPath();
  
  if (!fs.existsSync(sessionPath)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
    
    // Check if session has expired (7 days)
    if (Date.now() > data.expiresAt) {
      console.log('[SessionManager] Session expired, clearing');
      clearSession();
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('[SessionManager] Failed to load session:', err);
    return null;
  }
}

/**
 * Save session to disk
 */
function saveSession(data: SessionData) {
  const sessionPath = getSessionPath();
  fs.writeFileSync(sessionPath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Clear session
 */
export function clearSession() {
  const sessionPath = getSessionPath();
  if (fs.existsSync(sessionPath)) {
    fs.unlinkSync(sessionPath);
  }
}

/**
 * Initialize or get existing session
 */
function getOrCreateSession(): SessionData {
  let session = loadSession();
  
  if (!session) {
    // Create new session (7 days expiry)
    session = {
      unlockedSlugs: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };
    saveSession(session);
  }
  
  return session;
}

/**
 * Unlock a slug for viewing
 */
export function unlockSlug(slug: string) {
  const session = getOrCreateSession();
  
  if (!session.unlockedSlugs.includes(slug)) {
    session.unlockedSlugs.push(slug);
    saveSession(session);
    console.log('[SessionManager] Unlocked slug:', slug);
  }
}

/**
 * Check if a slug is unlocked
 */
export function isSlugUnlocked(slug: string): boolean {
  const session = getOrCreateSession();
  return session.unlockedSlugs.includes(slug);
}

/**
 * Get all unlocked slugs
 */
export function getUnlockedSlugs(): string[] {
  const session = getOrCreateSession();
  return [...session.unlockedSlugs];
}

/**
 * Lock a slug (remove from unlocked list)
 */
export function lockSlug(slug: string) {
  const session = getOrCreateSession();
  session.unlockedSlugs = session.unlockedSlugs.filter(s => s !== slug);
  saveSession(session);
  console.log('[SessionManager] Locked slug:', slug);
}

/**
 * Generate a session token for client-side verification
 */
export function generateSessionToken(): string {
  const session = getOrCreateSession();
  const tokenData = {
    unlockedSlugs: session.unlockedSlugs,
    expiresAt: session.expiresAt,
    timestamp: Date.now(),
  };
  
  // Create a simple hash-based token
  const tokenString = JSON.stringify(tokenData);
  return crypto.createHash('sha256').update(tokenString).digest('hex').substring(0, 32);
}

/**
 * Verify session token and return unlocked slugs
 */
export function verifySessionToken(token: string): { valid: boolean; unlockedSlugs?: string[] } {
  const session = getOrCreateSession();
  const expectedToken = generateSessionToken();
  
  if (token !== expectedToken) {
    return { valid: false };
  }
  
  return { valid: true, unlockedSlugs: session.unlockedSlugs };
}
