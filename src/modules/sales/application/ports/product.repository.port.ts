export abstract class ProductRepositoryPort {
  abstract findById(id: string): Promise<any>;
}