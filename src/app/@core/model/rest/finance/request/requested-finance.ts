import { AvatarModel } from "arb-design-library/model/avatar.model"
import { PillModel } from 'arb-design-library/model/pill.model';

export interface contractLstRes {
  dossierID: String
  contractDate: string | any
  dossierType: string
  productKey: productKey
  dossierStatus: string
  profit: number
  hasDisbursmentDossier: boolean
  firstDisbursmentDossierStatus: string
  childContracts: Array<childContracts>
  financeType: string
  financeKey: string
  currency: string
  avatar: AvatarModel
  pillStatus?: PillModel,
  amt?:string
}

export interface productKey {
  cIst: string
  channel: string
  macroFacility: string
  facility: string
  productCode: string
}

export interface childContracts {
  dossierID: string
  contractDate: {
    hijriDate: boolean
    startDate: string
    timestamp: string
  }
  amt: number
  dossierType: string
  productKey: productKey
  dossierStatus: string
  profit: number
  hasDisbursmentDossier: boolean
  firstDisbursmentDossierStatus: string
  pillStatus: PillModel
}
