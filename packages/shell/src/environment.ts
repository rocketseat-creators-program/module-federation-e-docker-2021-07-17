declare const process: any

function isBrowser(): boolean {
  try {
    return typeof window !== 'undefined'
  } catch (e) {
    return false
  }
}

const ENV = isBrowser() ? (window as any).HEADER_ENV : process.env // Solve variables using Docker

export interface Environment {
  TITLE: string
}

export const getEnv = (env = process.env.HEADER_NODE_ENV): Environment => {
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
