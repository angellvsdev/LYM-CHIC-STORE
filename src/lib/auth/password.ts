import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12; // Número de rondas de hasheo (mayor = más seguro pero más lento)

/**
 * Hashea una contraseña usando bcrypt
 * @param plainPassword Contraseña en texto plano
 * @returns Promesa que resuelve al hash de la contraseña
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con un hash
 * @param plainPassword Contraseña en texto plano
 * @param hashedPassword Hash de la contraseña almacenado
 * @returns Promesa que resuelve a true si coinciden, false en caso contrario
 */
export async function verifyPassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}

/**
 * Genera una contraseña aleatoria segura
 * @param length Longitud de la contraseña (por defecto 12)
 * @returns Contraseña aleatoria segura
 */
export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  const values = new Uint32Array(length);
  
  // Usamos crypto.getRandomValues para generar valores aleatorios seguros
  crypto.getRandomValues(values);
  
  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }
  
  return password;
}
