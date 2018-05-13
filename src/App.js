import React, {Component} from 'react'
import AddMediaFiles from './components/modals/AddMediaFiles'
import Player from "./Player"
import PlayList from "./components/playlist/PlayList"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showUploadMediaModal: false,
        }
        this.showUploadMediaModal = this.showUploadMediaModal.bind(this)
        this.closeUploadMediaModal = this.closeUploadMediaModal.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
    }

    showUploadMediaModal() {
        this.setState({showUploadMediaModal: true})
    }

    closeUploadMediaModal() {
        this.setState({showUploadMediaModal: false})
    }

    onDrop(acceptedFiles) {
        for (let i = 0; i < acceptedFiles.length; i++) {
            this.props.addFile({
                name: acceptedFiles[i].name,
                path: acceptedFiles[i].path,
                duration: acceptedFiles[i].duration
            })

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
        this.closeUploadMediaModal()
    }

    onDropRejected(...args) {
        console.log('reject', args)
    }



    render() {
        const {showUploadMediaModal} = this.state
        return (
            <div className="container-fluid">
                <div className="row flex-xl-nowrap">
                    <div className="col-12 col-md-2 bd-sidebar"> Nahashon</div>
                    <div className="col-12 col-md-9 col-xl-10 py-md-3 pl-md-5 bd-content">
                        <button onClick={this.showUploadMediaModal} className="btn btn-primary btn-sm">Add Media
                        </button>
                        <PlayList/>
                    </div>

                    <div className="footer">
                        <div id="mp3_player">
                            <div  id="playing">
                                <strong id="playing_song"></strong>
                            </div>

                            <div id="audio_box">

                            </div>
                            <canvas id="analyser_render"
                            >
                                {Player.renderAudioPlayer()}
                            </canvas>
                        </div>
                    </div>
                </div>

                {showUploadMediaModal ?
                    <AddMediaFiles show={showUploadMediaModal} onClose={this.closeUploadMediaModal} onDrop={this.onDrop}
                                   onDropRejected={this.onDropRejected}
                    /> : ''}
            </div>

        )
    }
}


export default App
