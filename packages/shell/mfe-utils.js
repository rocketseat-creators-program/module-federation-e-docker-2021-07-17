module.exports = {
    mfeDynamicRemoteHost({appName, remoteHostVariable}) {
        return `promise new Promise((resolve, reject) => {
      const env = window.APP_ENV;
      const remoteHost = env["${remoteHostVariable}"];
      const script = document.createElement('script')
      script.src = remoteHost
      script.onload = () => {
        const proxy = {
          get: (request) => window.${appName}.get(request),
          init: (arg) => {
            try {
              return window.${appName}.init(arg)
            } catch(e) {
              reject(e)
              console.error('remote container ${appName} already initialized');
              throw new Error(e);
            }
          }
        }
        resolve(proxy)
      }
      document.head.appendChild(script);
    })`
    },
    handleWebpackMode({mode = 'development', ...envs}) {
        try {
            return envs[mode];
        } catch (e) {
            console.warn(`cant find ${mode} environment`);
            return null;
        }
    }
}
