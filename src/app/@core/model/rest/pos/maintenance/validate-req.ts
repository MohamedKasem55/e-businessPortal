
export interface PosMaintananceValidateReq extends PosValidateBaseReq {
    
    terminals: string[]
}

export interface PosValidateBaseReq{
    accountNumber?: string | null,
    mobile: string,
    contactName: string,
    branch: string,
    city: string,
    type: string,
}

export interface PosMaintananceTerminal {
    terminal: string
}

