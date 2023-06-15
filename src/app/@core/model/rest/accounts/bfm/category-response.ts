

export interface CategoryResponse {
    income: IncomeAndExpenseItem[]
    expense: IncomeAndExpenseItem[]
}


export interface IncomeAndExpenseItem {
    subCategoryName?:string	
	categoryName?:string
	total: number
    codes: string
    currency: string
    grouped:boolean

}