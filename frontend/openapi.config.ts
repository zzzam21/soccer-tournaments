import { GeneratorConfig } from 'ng-openapi';

const config: GeneratorConfig = {
  input: './swagger.json',
  output: './src/client',
  options: {
    dateType: 'string',
    enumStyle: 'enum',
    generateServices: true,
  },
};

export default config;
