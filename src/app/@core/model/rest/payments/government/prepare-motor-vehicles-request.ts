export interface PrepareMotorVehiclesRequest {
  transactionType: string;
  serviceType: string;
  applicationType: string;
  accountNumber: string;
  currentOwnerId?: string;
  vehicleSequenceNumber?: string;
  newOwnerId?: string;
  reason?: string;
  vehicleCustomCardNumber?: string;
  newVehicleRegistrationType?: string;
  vehicleBodyType?: string;
  licensePlateWithLogo?: string;
}
