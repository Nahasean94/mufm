import React, {Component} from 'react'
import AddMediaFiles from './components/modals/AddMediaFiles'
import Player from "./shared/Player"
import PlayList from "./components/playlist/PlayList"
import PlaylistDate from "./components/PlaylistDate"
import SetPlaylistDate from "./shared/SetPlaylistDate"


const {ipcRenderer} = window.require('electron')


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

    //start playing
    startPlaying(playFrom, ctx) {

        const existingPlaylist = Player.getPlayList()
        // for (let i = playFrom; i < existingPlaylist.length; i++) {
        if (playFrom >= existingPlaylist.length) {
            playFrom = 0
        }

        ctx.props.files.map(file => {
            ctx.props.updateFile({
                id: file.id,
                path: file.path,
                name: file.name,
                duration: file.duration,
                isPlaying: playFrom + 1 === file.id,
                played: playFrom + 1 === file.id ? true : file.played,
                cover: file.cover,
                startTime: file.startTime,
            })
        })
        // console.log(existingPlaylist[playFrom])
        document.getElementById('cover-image').src = existingPlaylist[playFrom].cover
        document.getElementById('cover-image').hidden = false
        document.getElementById('playing_song').innerText = existingPlaylist[playFrom].name
        const audioPlayer = document.getElementById('audio_player')
        audioPlayer.src = existingPlaylist[playFrom].path
        audioPlayer.play()
        // this.setState({isPlaying: true})
        audioPlayer.addEventListener('ended', () => {
            this.startPlaying(playFrom + 1, ctx)
        })
        // }
    }

    savePlaylist(e) {
        e.preventDefault()
        let date = SetPlaylistDate.getDate()
        //check if date is set, if it doesnt exist, assume today's date
        if (!date) {
            date = new Date().toISOString().split("T")[0]
        }
        const playlist = Player.getPlayList()
        playlist.map(file => {
            //only save the files that are not saved
            if (!file.saved && !file._id)
                ipcRenderer.send('save-playlist', {
                    ...file,
                    date: date,
                    saved: true
                })
            file.saved=true
        })


        document.getElementById('save-playlist').hidden = true

    }

    onDrop(acceptedFiles) {
        for (let i = 0; i < acceptedFiles.length; i++) {
            this.props.addFile({
                name: acceptedFiles[i].name,
                path: acceptedFiles[i].path,
                duration: acceptedFiles[i].duration
            })

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
                            <PlaylistDate startPlaying={this.startPlaying}/>
                            <div id="timer">
                                <div><strong id="playback-time"></strong></div>
                                <div id="clock">

                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-10 col-xl-10 bd-content">
                            <div className="container-fluid">

                                <div className="progress" id="progress-bar" hidden={true}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated  "
                                         role="progressbar" id="processing" style={{"width": "100%"}} min="0"
                                         max="100"></div>
                                    asd
                                </div>
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
                                    <PlayList startPlaying={this.startPlaying}/>
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

                                        {Player.renderAudioPlayer()}
                                    </div>
                                    <canvas id="analyser_render"
                                    >
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

