export type PromiseRes<T={}> = Promise<MangeResult<T>>

// 定义返回值类型
interface MangeResult<T={}> {
  code: number,
  message?: string
  data: T
}