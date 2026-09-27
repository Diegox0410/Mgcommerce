export interface ReadRepository<T> {
  getById(id: string): Promise<T | null>
  list(): Promise<T[]>
}

export interface WriteRepository<T> {
  save(entity: T): Promise<T>
  remove(id: string): Promise<void>
}

export type Repository<T> = ReadRepository<T> & WriteRepository<T>
