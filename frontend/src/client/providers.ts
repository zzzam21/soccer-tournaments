import { EnvironmentProviders, Provider } from '@angular/core';

export function provideDefaultClient(config: { basePath: string }): (Provider | EnvironmentProviders)[] {
  return [];
}
