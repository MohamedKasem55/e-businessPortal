import { PillModel } from "arb-design-library/model/pill.model";

export interface DisplayedCardsList {
    cardIndex: number;
    cardType: string;
    cardName: string;
    image: string;
    cardNum: string;
    cardSeqNum: string;
    number: string;
    status: string;
    isActive: boolean;
    cardStatusBadge: PillModel;
    holderName: string;
    balance: string;
    limitAmount: string;
    duePayment: string;
    currency: string;
  }
  