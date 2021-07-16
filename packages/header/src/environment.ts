declare const process: any

function isBrowser(): boolean {
  try {
    return typeof window !== 'undefined'
  } catch (e) {
    return false
  }
}

const ENV = isBrowser() ? (window as any).APP_ENV : process.env // Solve variables using Docker

export interface Environment {
  TITLE: string
}

export const getEnv = (env = process.env.APP_ENV): Environment => {
  switch (env) {
    case 'production':
      return {
        ...ENV,
      }
    default:
      return {
        TITLE: 'Aplicação na máquina',
      }
  }
}
