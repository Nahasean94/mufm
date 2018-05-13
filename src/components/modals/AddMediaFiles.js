import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import Dropzone from "react-dropzone"
import {addFile} from "../../actions/playlistActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"

class AddMediaFiles extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
    }

    secondsToHms(d) {
        d = Number(d)

        const h = Math.floor(d / 3600)
        const m = Math.floor(d % 3600 / 60)
        const s = Math.floor(d % 3600 % 60)
        if (h === 0) {
            return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2)
        }
        if (m === 0) {
            return ('0' + s).slice(-2)
        }

        return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2)
    }

    onDrop(acceptedFiles) {
        for (let i = 0; i < acceptedFiles.length; i++) {
            const audio = new Audio()
            audio.src = acceptedFiles[i].path
            audio.onloadedmetadata = () => {
                const duration = this.secondsToHms(audio.duration)
                this.props.addFile({
                    id:i+1,
                    name: acceptedFiles[i].name,
                    path: acceptedFiles[i].path,
                    duration: duration,
                    played:false
                })
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
}

export default connect(null, {addFile})(AddMediaFiles)