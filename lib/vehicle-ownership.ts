export interface VehicleOwnership {
  vehicleId: string
  ownerId: string
  ownerName: string
  ownerEmail: string
}

// Mock data for vehicle ownership
const vehicleOwnershipData: VehicleOwnership[] = [
  {
    vehicleId: "1",
    ownerId: "seller_1",
    ownerName: "Tanaka Hiroshi",
    ownerEmail: "tanaka@example.com",
  },
  {
    vehicleId: "2",
    ownerId: "seller_2",
    ownerName: "Yamada Hanako",
    ownerEmail: "yamada@example.com",
  },
  {
    vehicleId: "3",
    ownerId: "seller_3",
    ownerName: "Sato Kenji",
    ownerEmail: "sato@example.com",
  },
]

export function getVehicleOwnership(vehicleId: string): VehicleOwnership | undefined {
  return vehicleOwnershipData.find((ownership) => ownership.vehicleId === vehicleId)
}

export function verifyVehicleOwnership(vehicleId: string, userEmail: string): boolean {
  const ownership = getVehicleOwnership(vehicleId)
  return !!ownership && ownership.ownerEmail === userEmail
}
