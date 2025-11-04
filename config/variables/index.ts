const ENV = (process.env.ENV_NAME || process.env.NUXT_NODE_ENV || 'development');

const isDev = ENV === 'development';
const isStage = ENV === 'stage';
const isDebug = isDev || isStage;

export {
  isDebug,
  isDev,
  isStage,
  ENV,
};
