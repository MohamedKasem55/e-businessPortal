export enum  CARD_TYPE {
    OWNER =  "CREDIT_CARD",
    PREPAID =  "PREPAID_CARD",
    BUSINESS =  "BUSINESS_CARD",
    DEBIT = "DEBIT_CARD"
};

export enum CARDS_STATUS {
    CLOSED = '1',
    ACTIVE = '2',
    INACTIVE = '3',
    CLOSED_BY_BANK = '4',
    CLOSED_BY_CUSTOMER = '5',
}

export const CARDS_STATUS_TXT = {
    '1': "closed",
    '2': "active",
    '3': "inActive",
    '4': "closedByBank",
    '5': "closedByCustomer",
}

export const DEBIT_CARDS_STATUS_TXT = {
    AT: 'Active',
    AC: 'Renewed',
    EX: 'Expiring',
    SO: 'Blocked',
    RP: 'Replaced',
    NP: 'Issued',
}

export const DEBIT_CARDS_STATUS_PILL = {
    AT: "Positive",
    AC: "Positive",
    EX: "Warning",
    SO: "Negative",
    RP: "Negative",
    NP: "Activate",
}

export enum CARDS_IMAGES {
    OWNER =  "assets/img/cards/405433.svg",
    PREPAID =  "assets/img/cards/prepaidCardsNew.png",
    PREPAID_EXPLORE =  "assets/img/cards/prepaidExplore.png",
    DEBIT = "assets/img/cards/madaCardNew.svg",
    DEBIT_EXPLORE = "assets/img/cards/madaExplore.png",
    BUSINESS = "assets/img/cards/businessCardsNew.png",
}
