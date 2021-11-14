import sampleCategories from "../models/sampleCategories.json";

interface ReduxAction {
    type: string
    payload?: any
}

export interface Category {
    key: string,
    name: string,
    answer: string
}

export interface CategoryList {
    categoryList: Category[]
}

function genNewCategories(){
    return {
        categoryList: sampleCategories
    }
}

export const initalCategoryList = genNewCategories() as CategoryList

export const categoryList = (
    state: CategoryList = initalCategoryList,
    action: ReduxAction
): CategoryList => {
    switch(action.type){
        case 'ADD_CATEGORY':
            return ({
                ...state,
                categoryList : state.categoryList.concat({name: action.payload.name, key: action.payload.key, answer: ""})
            })
        case 'UPDATE_CATEGORY':
            return ({
                ...state,
                categoryList : state.categoryList.map(
                    (category: Category) => {
                        if (action.payload.key === category.key){
                            const updatedItem = {
                                ...category,
                                name : action.payload.name
                            };
                            return updatedItem
                        }else{
                            return category
                        }
                    }
                )
            })
        case 'REMOVE_CATEGORY':
            return ({
                ...state,
                categoryList : state.categoryList.filter((item:Category) => item.key !== action.payload.key)
            })
        case 'RESET_CATEGORIES':
            return genNewCategories()
        default:
            return state
    }

}

export default categoryList