/**
 * shared store is created for any shared state between more than one module 
 */

export interface SharedState {
    userInfo: any,
    pendingActions: {[key: string]: number} | undefined,
}