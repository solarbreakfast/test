export function rafThrottle<T extends (...args: any[]) => void>(callback: T): T {
  let frameId: number | null = null;
  
  return ((...args: Parameters<T>) => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    
    frameId = requestAnimationFrame(() => {
      callback(...args);
      frameId = null;
    });
  }) as T;
}