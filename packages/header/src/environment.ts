declare const process: any

export interface Environment {
  TITLE: string
}

export const getEnv = (): Environment => {
  return {
    TITLE: process.env.TITLE
  }
}
