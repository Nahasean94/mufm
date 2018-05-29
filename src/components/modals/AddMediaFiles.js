import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import Dropzone from "react-dropzone"
import {addFile, addDuration, addCover} from "../../actions/playlistActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {secondsToHms, addTimes,} from "../../shared/TimeFunctions"
import * as jsmediatags from "jsmediatags"
import Player from "../../shared/Player"
import SetPlaylistDate from "../../shared/SetPlaylistDate"


class AddMediaFiles extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: ''
        }
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
    }


    onDrop(acceptedFiles) {
        if (acceptedFiles.length > 0) {
            document.getElementById('save-playlist').hidden = false
            let id = this.props.files.length + 1

            for (let i = 0; i < acceptedFiles.length; i++) {
                this.props.addFile({
                    id: id++,
                    name: acceptedFiles[i].name,
                    path: acceptedFiles[i].path,
                    duration: '',
                    played: false,
                    isDuration: false,
                    startTime: '',
                    isCover: false,
                })

                jsmediatags.read(acceptedFiles[i], {
                    onSuccess: (tag) => {
                        const image = tag.tags.picture
                        if (image) {
                            let base64String = ""
                            for (let i = 0; i < image.data.length; i++) {
                                base64String += String.fromCharCode(image.data[i])
                            }
                            let base64 = "data:" + image.format + ";base64," + window.btoa(base64String)
                            this.props.addCover({
                                path: acceptedFiles[i].path,
                                cover: base64
                            })
                            Player.addCover({
                                path: acceptedFiles[i].path,
                                cover: base64
                            })
                        } else {
                            this.props.addCover({
                                path: acceptedFiles[i].path,
                                cover: 'media/mp3.png'
                            })
                            Player.addCover({
                                path: acceptedFiles[i].path,
                                cover: 'media/mp3.png'
                            })
                        }
                    }
                })
                const audio = new Audio()
                audio.src = acceptedFiles[i].path
                audio.onloadedmetadata = () => {
                    const duration = secondsToHms(audio.duration)
                    let endTime = ''

                    let date = SetPlaylistDate.getDate()

                    if (!date) {
                        date = new Date().toISOString().split("T")[0]
                    }
                    if (localStorage.getItem(date)) {
                        endTime = JSON.parse(localStorage.getItem(date)).endTime
                    }
                    let startTime = ''
                    if (JSON.parse(localStorage.getItem(date))) {
                        startTime = JSON.parse(localStorage.getItem(date)).time
                    }


                    this.props.addDuration({
                        name: acceptedFiles[i].name,
                        path: acceptedFiles[i].path,
                        duration: duration,
                        played: false,
                        startTime: endTime ? endTime : startTime ? startTime : '',
                        isDuration: true
                    })
                    Player.addDuration({
                        path: acceptedFiles[i].path,
                        duration: duration,
                    })


                    if (localStorage.getItem(date)) {
                        let dateStore = JSON.parse(localStorage.getItem(date))
                        dateStore = {
                            date: dateStore.date,
                            time: dateStore.time,
                            endTime: addTimes(endTime ? endTime : startTime, duration)
                        }
                        localStorage.setItem(date, JSON.stringify(dateStore))
                    }
                }
            }
        }
        this.props.onClose()
    }

    onDropRejected(...args) {
        console.log('reject', args)
    }

    render() {

        const {show, onClose,} = this.props
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="sm">
                    <ModalHeader toggle={onClose}>Add media files</ModalHeader>
                    <ModalBody>
                        <Dropzone onDrop={this.onDrop} accept="audio/*,video/*" multiple={true}
                                  onDropRejected={this.onDropRejected}>
                            Drag file(s) here or click to upload.
                        </Dropzone>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="dark btn-sm" onClick={onClose}>Cancel</Button>{' '}
                    </ModalFooter>
                </Modal>
            )
        }
        else return null

    }
}

AddMediaFiles.propTypes = {
    addFile: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addDuration: PropTypes.func.isRequired,
    addCover: PropTypes.func.isRequired,
    files: PropTypes.array,
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile, addDuration, addCover})(AddMediaFiles)