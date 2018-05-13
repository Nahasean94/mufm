import {ADD_FILE, CLEAR_FILES, DELETE_FILE, UPDATE_FILE,GET_FILE} from "./types"


 export function addFile(file) {
     return {
         type:ADD_FILE,
         payload:file
     }
 }
 export function clearFiles() {
     return {
         type:CLEAR_FILES,
         payload:{}
     }
 }
 export function updateFile(file) {
     return {
         type:UPDATE_FILE,
         payload:file
     }
 }
 export function deleteFile(fileId) {
     return {
         type:DELETE_FILE,
         payload:fileId
     }
 }
 export function getFile(id) {

     return {
         type:GET_FILE,
         payload:{id:id}
     }
   
 }