import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class PasswordHelper {
  /**
   * Hash a plain text password
   */
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Check if a password hash needs rehashing (useful for upgrading salt rounds)
   */
  static needsRehash(hashedPassword: string): boolean {
    return bcrypt.getRounds(hashedPassword) < SALT_ROUNDS;
  }

  /**
   * Generate a secure random password (useful for temporary passwords)
   */
  static generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}