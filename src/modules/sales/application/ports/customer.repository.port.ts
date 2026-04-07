export abstract class CustomerRepositoryPort {
  abstract findById(id: string): Promise<any>;
}