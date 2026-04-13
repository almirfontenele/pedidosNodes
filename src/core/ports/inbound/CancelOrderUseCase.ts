export interface CancelOrderUseCase {
  execute(id: string): Promise<void>;
}
