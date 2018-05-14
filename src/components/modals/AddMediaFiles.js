import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import Dropzone from "react-dropzone"
import {addFile} from "../../actions/playlistActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {secondsToHms, addTimes} from "../../shared/TimeFunctions"

class AddMediaFiles extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
    }


    onDrop(acceptedFiles) {
        if (acceptedFiles.length > 0) {
            let id = this.props.files.length + 1
            acceptedFiles.map(file => {
                const audio = new Audio()
                audio.src = file.path
                audio.addEventListener('loadedmetadata', () => {
                    const duration = secondsToHms(audio.duration)
                    let endTime = ''
                    if (localStorage.getItem(new Date().toISOString().split("T")[0])){
                        endTime = JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).endTime
                    }
                    this.props.addFile({
                        id: id++,
                        name: file.name,
                        path: file.path,
                        duration: duration,
                        played: false,
                        startTime: endTime
                    })
                    if (localStorage.getItem(new Date().toISOString().split("T")[0])) {
                        let todayStore = JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0]))
                        todayStore = {
                            date: todayStore.date,
                            time: todayStore.time,
                            endTime: addTimes(endTime, duration)
                        }
                        localStorage.setItem(new Date().toISOString().split("T")[0], JSON.stringify(todayStore))
                    }
                })
            })
            this.props.onClose()
        }
        // );

        //     const reader = new FileReader()
        //     reader.onload = () => {
        //         const fileAsBinaryString = reader.result
        //       console.log(fileAsBinaryString)
        //     }
        //     reader.onabort = () => console.log('file reading was aborted')
        //     reader.onerror = () => console.log('file reading has failed')
        //
        //     reader.readAsBinaryString(file)
        // }
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
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile})(AddMediaFiles)