import React, {Component} from 'react'
import AddMediaFiles from './components/modals/AddMediaFiles'
import Player from "./Player"
import PlayList from "./components/playlist/PlayList"
import PlaylistDate from "./components/PlaylistDate"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showUploadMediaModal: false,
            playlistDate: ''
        }
        this.showUploadMediaModal = this.showUploadMediaModal.bind(this)
        this.closeUploadMediaModal = this.closeUploadMediaModal.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
    }

    showUploadMediaModal() {
        this.setState({showUploadMediaModal: true})
    }

    closeUploadMediaModal() {
        this.setState({showUploadMediaModal: false})
    }

    savePlaylist() {
        const todayDate = new Date().toISOString().split("T")[0]
        if (!localStorage.getItem(todayDate)) {
            localStorage.setItem(todayDate, JSON.stringify({
                date: todayDate,
                playlist: Player.getPlayList()
            }))
        }
        else {
            let todayItem = JSON.parse(localStorage.getItem(todayDate))
            todayItem = {
                date: todayItem.date,
                playlist: Player.getPlayList()
            }
            localStorage.setItem(todayDate, JSON.stringify(todayItem))
        }
        document.getElementById('save-playlist').hidden = true

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
            <div>
                <div className="container-fluid">
                    <div className="row flex-xl-nowrap">
                        <div className="col-12 col-md-2 bd-sidebar">
                            <PlaylistDate/>
                            <div id="timer">
                            <div><strong id="playback-time"></strong></div>
                            <div id="clock">

                            </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-10 col-xl-10 bd-content">
                            <div className="container-fluid">
                                <div className="navbar navbar-expand-lg navbar-light bg-light ">
                                    <button onClick={this.showUploadMediaModal} className="btn btn-success btn-sm"
                                            id="add-media">Add Media
                                    </button>
                                    &nbsp;
                                    <button hidden={true} onClick={this.savePlaylist} className="btn btn-success btn-sm"
                                            id="save-playlist">Save Playlist
                                    </button>
                                </div>
                                <hr/>
                                <div className="row flex-xl-nowrap">


                                    <PlayList/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <div className="container-fluid">
                        <div className="row flex-xl-nowrap">
                            <div className="col-sm  cover">
                                <img hidden={true} width={60} height={60} className="rounded" id="cover-image"/>
                            </div>
                            <div className="col-sm-11  bd-content">
                                <div id="mp3_player">
                                    <div id="playing">
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

                    </div>
                    {showUploadMediaModal ?
                        <AddMediaFiles show={showUploadMediaModal} onClose={this.closeUploadMediaModal}
                                       onDrop={this.onDrop}
                                       onDropRejected={this.onDropRejected}
                        /> : ''}
                </div>
            </div>

        )
    }
}


export default App
