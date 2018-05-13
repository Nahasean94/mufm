import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE, GET_FILE} from "./types"
import playlistReducers from '../reducers/playlistReducers'

export function addFile(file) {
    return {
        type: ADD_FILE,
        payload: file
    }
}

export function clearFiles() {
    return {
        type: CLEAR_FILES,
        payload: {}
    }
}

export function updateFile(file) {
    console.log("filing")
    return {
        type: UPDATE_FILE,
        payload: file
    }
}

export function deleteFile(fileId) {
    return {
        type: DELETE_FILE,
        payload: fileId
    }
}

