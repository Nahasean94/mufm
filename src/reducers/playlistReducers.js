import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE,GET_FILE} from "../actions/types"
import findIndex from 'lodash/findIndex'

export default (state = [], action) => {
    switch (action.type) {
        case ADD_FILE:
            return [ ...state,action.payload]
        case CLEAR_FILES:
            return []
        case UPDATE_FILE:
            return state.filter(file => {
                if (file.id === action.payload.id) {
                    return file
                }

            })
        case GET_FILE:
            const fileIndex = findIndex(state, {id: action.payload.id})
            if (fileIndex >= 0) {
                return new Array(state[fileIndex])
            }
            return state
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
