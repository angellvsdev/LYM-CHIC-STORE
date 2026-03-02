// Sistema de caché simple en memoria para optimizar consultas frecuentes
// Optimización para LYM ChicStore - Reducción de llamadas a base de datos

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milisegundos
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos por defecto

  // Generar key para caché basado en parámetros
  private generateKey(prefix: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  // Obtener datos del caché
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Guardar datos en caché
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Método específico para productos
  async getProducts(
    fetchFunction: () => Promise<any>,
    params: Record<string, any> = {},
    ttl: number = 2 * 60 * 1000 // 2 minutos para productos
  ): Promise<any> {
    const key = this.generateKey('products', params);
    
    let cachedData = this.get(key);
    if (cachedData) {
      return cachedData;
    }

    const freshData = await fetchFunction();
    this.set(key, freshData, ttl);
    return freshData;
  }

  // Método específico para categorías
  async getCategories(
    fetchFunction: () => Promise<any>,
    params: Record<string, any> = {},
    ttl: number = 10 * 60 * 1000 // 10 minutos para categorías
  ): Promise<any> {
    const key = this.generateKey('categories', params);
    
    let cachedData = this.get(key);
    if (cachedData) {
      return cachedData;
    }

    const freshData = await fetchFunction();
    this.set(key, freshData, ttl);
    return freshData;
  }

  // Método específico para dashboard
  async getDashboardStats(
    fetchFunction: () => Promise<any>,
    ttl: number = 30 * 1000 // 30 segundos para dashboard
  ): Promise<any> {
    const key = 'dashboard:stats';
    
    let cachedData = this.get(key);
    if (cachedData) {
      return cachedData;
    }

    const freshData = await fetchFunction();
    this.set(key, freshData, ttl);
    return freshData;
  }

  // Invalidar caché por patrón
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Limpiar caché completo
  clear(): void {
    this.cache.clear();
  }

  // Estadísticas del caché
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Exportar instancia singleton
export const cache = new SimpleCache();

// Funciones helper para uso en endpoints
export const withCache = async <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached) {
    return cached;
  }

  const result = await fetchFunction();
  cache.set(key, result, ttl);
  return result;
};
