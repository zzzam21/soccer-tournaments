import { Config } from 'ng-openapi';

const config: Config = {
  input: './swagger.json',
  output: './src/client',
  servicePrefix: 'Api',
  serviceSuffix: 'Service',
  responseSuffix: 'Response',
  modelSuffix: '',
  modelPrefix: '',
  provider: 'root',
};

export default config;
