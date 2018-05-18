import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE,ADD_DURATION,ADD_IMAGE} from "../actions/types"
import findIndex from 'lodash/findIndex'

export default (state = [], action) => {
    switch (action.type) {
        case ADD_FILE:
            return [ ...state,action.payload]
        case CLEAR_FILES:
            return []
        case UPDATE_FILE:
            return state.map(file=>{
// console.log(action.payload)
                if(file.id===action.payload.id ){
                    return action.payload
                }
                return file
            })
        case ADD_DURATION:
            return state.map(file=>{
// console.log(action.payload)
                if(file.path===action.payload.path && file.isDuration===false){
                    return {...action.payload,id:file.id,cover:file.cover}
                }
                return file
            })
        case ADD_IMAGE:
            return state.map(file=>{

                if(file.path===action.payload.path && file.isCover===false){

                    return {...file,cover:action.payload.cover}
                }
                return file
            })
        case DELETE_FILE:
            const index = findIndex(state, {id: action.payload.id})
            if (index >= 0) {
                return [...state.slice(0, index), ...state.slice(index + 1)]
            }
            return state
        default:
            return state
    }
}
