/** Core mathematical utility functions used across experiments */

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function getPrimes(max: number): number[] {
  const sieve = new Uint8Array(max + 1).fill(1);
  sieve[0] = 0;
  sieve[1] = 0;
  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = 0;
      }
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= max; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}

export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n = Math.floor(n / d);
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

export function mean(data: number[]): number {
  if (!data.length) return 0;
  return data.reduce((a, b) => a + b, 0) / data.length;
}

export function median(data: number[]): number {
  if (!data.length) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function mode(data: number[]): number[] {
  if (!data.length) return [];
  const freq: Record<number, number> = {};
  data.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
  const max = Math.max(...Object.values(freq));
  return Object.entries(freq)
    .filter(([, v]) => v === max)
    .map(([k]) => Number(k))
    .sort((a, b) => a - b);
}

export function stdDev(data: number[]): number {
  if (data.length < 2) return 0;
  const m = mean(data);
  const variance = data.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / data.length;
  return Math.sqrt(variance);
}

export function range(data: number[]): number {
  if (!data.length) return 0;
  return Math.max(...data) - Math.min(...data);
}

export function fibonacci(n: number): number[] {
  const seq = [1, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq.slice(0, n);
}

export function arithmeticSequence(a: number, d: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + i * d);
}

export function geometricSequence(a: number, r: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a * Math.pow(r, i));
}

export function triangularNumbers(n: number): number[] {
  return Array.from({ length: n }, (_, i) => ((i + 1) * (i + 2)) / 2);
}

export function squareNumbers(n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.pow(i + 1, 2));
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function midpoint(x1: number, y1: number, x2: number, y2: number): [number, number] {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

export function slope(x1: number, y1: number, x2: number, y2: number): number | null {
  if (x2 === x1) return null;
  return (y2 - y1) / (x2 - x1);
}

export function round(n: number, decimals = 4): number {
  return Number(n.toFixed(decimals));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function linspace(start: number, end: number, num: number): number[] {
  if (num < 2) return [start];
  const step = (end - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + i * step);
}

export function evaluateFunction(expr: string, x: number): number | null {
  try {
    const clean = expr
      .replace(/\^/g, '**')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-zA-Z])/g, 'Math.E');
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `"use strict"; return (${clean});`);
    const result = fn(x);
    return isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

export function formatNumber(n: number, decimals = 4): string {
  if (!isFinite(n)) return '—';
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatPercent(n: number, decimals = 2): string {
  return `${(n * 100).toFixed(decimals)}%`;
}
