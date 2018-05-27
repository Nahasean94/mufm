import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {addFile, deleteFile, clearFiles, updateFile} from "../../actions/playlistActions"
import PlayListItem from "./PlayListItem"
import Sortable from "sortablejs"
import Player from "../../shared/Player"

const {ipcRenderer} = window.require('electron')

class PlayList extends React.Component {
    constructor(props) {
        super(props)
        this.props.clearFiles()
        // this.props.files.map(file => this.props.addFile(file))
        this.onDrop = this.onDrop.bind(this)
//populate the table with the day's playlist
        ipcRenderer.send('get-playlist', new Date().toISOString().split("T")[0])
        ipcRenderer.on('got-playlist', (event, playlist) => {
            //check is playlist exists
            if (playlist) {
                playlist.map(file => {
                    this.props.addFile(file)
                })
            }
        })

        // db.get('playlists')
        //     .find({date: new Date().toISOString().split("T")[0]}).write()
        // const playlist = db.get('playlists')
        //     .find({date: new Date().toISOString().split("T")[0]}).write()
        // //check is playlist exists
        // if (playlist && playlist.playlist) {
        //     playlist.playlist.map(file => {
        //         this.props.addFile(file)
        //     })
        // }
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

    onDrop(e) {
// console.log(document.getElementById('playlist').childNodes)
        //TODO  allow sorting of future playlists
        //
        // let startTime = localStorage.getItem(new Date().toISOString().split("T")[0]) ? JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).time ? tConv12(JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).time) : '' : ''
        // let todayDate=new Date().toISOString().split("T")[0]
        // if (startTime) {
        //     let timer = startTime
        //     this.props.files.map(file => {
        //         this.props.updateFile({
        //             id: file.id,
        //             path: file.path,
        //             name: file.name,
        //             duration: file.duration,
        //             played: file.played,
        //             startTime: timer
        //         })
        //         timer = addTimes((timer).split(" ")[0], file.duration)
        //         let todayItem = JSON.parse(localStorage.getItem(todayDate))
        //         todayItem = {
        //             date: todayItem.date,
        //             time: todayItem.time,
        //             endTime: timer
        //         }
        //         localStorage.setItem(todayDate, JSON.stringify(todayItem))
        //     })
        // }
    }

    render() {
        let count = 1
        return (
            <div className="table-wrapper">
                <table className="table table-sm table-hover table-borderless">
                    <thead>
                    <tr>
                        {/*<th scope="col">#</th>*/}
                        <th scope="col">Cover</th>
                        <th scope="col">Name</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Remove</th>
                    </tr>
                    </thead>
                    <tbody id="playlist">
                    {this.props.files.map((file, i) => {
                        console.log(file)
                        return <PlayListItem key={i} name={file.name} duration={file.duration} id={file.id}
                                             path={file.path} played={file.played}
                                             isPlaying={file.isPlaying}
                                             startTime={file.startTime ? file.startTime : ''} cover={file.cover}
                                             count={count++}/>
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
    clearFiles: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    updateFile: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile, deleteFile, clearFiles, updateFile})(PlayList)