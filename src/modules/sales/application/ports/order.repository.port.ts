export abstract class OrderRepositoryPort {
  abstract findById(id: string): Promise<any>;
  abstract save(order: any): Promise<any>;
  abstract saveShipment(shipment: any): Promise<any>;
}