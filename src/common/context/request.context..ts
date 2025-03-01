import { REQUEST } from '@nestjs/core';
import { Injectable, Inject, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextProvider {
  private readonly contextMap: Map<string, unknown> = new Map();

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  set<T>(key: string, value: T): void {
    this.contextMap.set(key, value);
    console.log(`RequestContextProvider: Set key '${key}' with value:`, value);
  }

  get<T>(key: string): T | undefined {
    const value = this.contextMap.get(key);
    console.log(`RequestContextProvider: Get key '${key}' with value:`, value);
    return value as T;
  }

  getRequest(): Request {
    return this.request;
  }

  has(key: string): boolean {
    return this.contextMap.has(key);
  }

  delete(key: string): boolean {
    return this.contextMap.delete(key);
  }

  clear(): void {
    this.contextMap.clear();
  }
}
