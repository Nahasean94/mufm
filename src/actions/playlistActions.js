import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE, ADD_DURATION, ADD_IMAGE} from "./types"


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
    return {
        type: UPDATE_FILE,
        payload: file
    }
}

export function addDuration(file) {
    return {
        type: ADD_DURATION,
        payload: file
    }
}
export function addCover(file) {
    return {
        type: ADD_IMAGE,
        payload: file
    }
}

export function deleteFile(fileId) {
    return {
        type: DELETE_FILE,
        payload:{id: fileId}
    }
}

