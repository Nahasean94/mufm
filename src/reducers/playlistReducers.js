import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE, ADD_DURATION, ADD_IMAGE} from "../actions/types"

export default (state = [], action) => {
    switch (action.type) {
        case ADD_FILE:
            return [...state, action.payload]
        case CLEAR_FILES:

           return []
        case UPDATE_FILE:
            return state.map(file => {
                if (file.id === action.payload.id) {
                    return action.payload
                }
                return file
            })
        case ADD_DURATION:
            return state.map(file => {
                if (file.path === action.payload.path && file.isDuration === false) {
                    return {...action.payload, id: file.id, cover: file.cover}
                }
                return file
            })
        case ADD_IMAGE:
            return state.map(file => {
                if (file.path === action.payload.path && file.isCover === false) {
                    return {...file, cover: action.payload.cover}
                }
                return file
            })
        case DELETE_FILE:
            return state.filter((file)=>file.id !== action.payload.id);
        default:
            return state
    }
}
