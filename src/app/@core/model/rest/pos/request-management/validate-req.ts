import {PosValidateBaseReq } from "../maintenance/validate-req";

export interface PosRequestValidateReq extends PosValidateBaseReq{
    terminals: PosRequestTerminal[]
}

export interface PosRequestTerminal {
    terminal: string
}