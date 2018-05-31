import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {addFile, deleteFile, clearFiles, updateFile} from "../../actions/playlistActions"
import PlayListItem from "./PlayListItem"
import Sortable from "sortablejs"
import {addTimes,} from "../../shared/TimeFunctions"
import SetPlaylistDate from "../../shared/SetPlaylistDate"
import Player from '../../shared/Player'

const {ipcRenderer} = window.require('electron')

class PlayList extends React.Component {
    constructor(props) {
        super(props)
this.state={

}

        ipcRenderer.send('get-playlist', new Date().toISOString().split("T")[0])
        ipcRenderer.on('got-playlist', (event, playlist) => {
            this.props.clearFiles()
            Player.emptyPlayList()
            //check is playlist exists

            if (playlist.length > 0) {
                let date = SetPlaylistDate.getDate()
                //if date is not set assume today date
                if (!date) {
                    date = new Date().toISOString().split("T")[0]
                }

                let startTime = ''
                if (JSON.parse(localStorage.getItem(date))) {
                    startTime = JSON.parse(localStorage.getItem(date)).time
                }
                if (startTime) {
                    this.startTimer()
                }

                document.getElementById('progress-bar').hidden = false

                document.getElementById('processing').innerText = "Processing metadata. Please wait..."
                let count = 0
                playlist.map(file => {
                    const duration = file.duration
                    let endTime = ''
                    if (localStorage.getItem(date)) {
                        endTime = JSON.parse(localStorage.getItem(date)).endTime
                    }
                    file.startTime = endTime ? endTime : startTime ? startTime : ''
                    this.props.addFile(file)

                    if (localStorage.getItem(date)) {
                        let dateStore = JSON.parse(localStorage.getItem(date))
                        if(dateStore.time){
                        dateStore = {
                            date: dateStore.date,
                            time: dateStore.time,
                            endTime: endTime ? addTimes(endTime, duration) : startTime ? addTimes(startTime, duration) : ''
                        }
                        }
                        localStorage.setItem(date, JSON.stringify(dateStore))
                    }
                    if (count++ === playlist.length - 1) {
                        document.getElementById('progress-bar').hidden = true
                    }
                })
            }

        })
    }

    startTimer() {
        const stopwatch = setInterval(() => {
            let date = SetPlaylistDate.getDate()
            //if date is not set assume today date
            if (!date) {
                date = new Date().toISOString().split("T")[0]
            }
            const playTime = JSON.parse(localStorage.getItem(date)).time
            let countDownDate = new Date(`${date} ${playTime}`).getTime()

//                     Get todays date and time
            let now = new Date().getTime()

            // Find the distance between now an the count down date
            let distance = countDownDate - now


            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24))
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            let seconds = Math.floor((distance % (1000 * 60)) / 1000)

            // // If the count down is finished, write some text
            if (distance > 0) {
                document.getElementById('playback-time').innerText = "Playback starts in:"
                if (days > 0) {
                    document.getElementById("clock").innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s "
                }
                else if (hours > 0) {
                    document.getElementById("clock").innerText = hours + "h " + minutes + "m " + seconds + "s "
                }
                else if (minutes > 0) {
                    document.getElementById("clock").innerText = minutes + "m " + seconds + "s "
                }
                else {
                    document.getElementById("clock").innerText = seconds + "s "
                }
            }
            else {
                document.getElementById('playback-time').innerText = ""
                document.getElementById("clock").innerText = ""
                clearInterval(stopwatch)
                if(Player.getPlayList().length>0){
                this.props.startPlaying(0, this)

                }
            }
        }, 1000)
    }

    componentDidMount() {
        const element = document.getElementById('playlist')
        Sortable.create(element, {
            onMove: this.onDrop,
            pull: 'clone',
            onClone: function (evt) {
                // console.log("cloned")
            }
        })
    }


    render() {
        let count = 1

        return (
            <div className="table-wrapper" id="table-list">
                <table className="table table-sm table-hover table-borderless">
                    <thead>
                    <tr>

                        <th scope="col">Cover</th>
                        <th scope="col">Name</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Remove</th>
                    </tr>
                    </thead>
                    <tbody id="playlist">
                    {this.props.files.map((file, i) => {
                        return <PlayListItem key={i} name={file.name} duration={file.duration} id={file.id}
                                             path={file.path} played={file.played}
                                             isPlaying={file.isPlaying}
                                             startTime={file.startTime ? file.startTime : ''} cover={file.cover}
                                             count={count++} startPlaying={this.props.startPlaying} _id={file._id}/>
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}


PlayList.propTypes = {
    addFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    startPlaying: PropTypes.func.isRequired,
    clearFiles: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    updateFile: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile, deleteFile, clearFiles, updateFile})(PlayList)