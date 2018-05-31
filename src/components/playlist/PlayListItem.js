import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile, deleteFile} from '../../actions/playlistActions'
import Player from '../../shared/Player'
import {addTimes} from "../../shared/TimeFunctions"
import SetPlaylistDate from "../../shared/SetPlaylistDate"

const {ipcRenderer} = window.require('electron')

class PlayListItem extends React.Component {
    constructor(props) {
        super(props)

        this.play = this.play.bind(this)
        Player.addToPlayList({
            id: this.props.id,
            _id: this.props._id,
            path: this.props.path,
            name: this.props.name,
            duration: this.props.duration,
            played: this.props.played,
            cover: this.props.cover
        })
        this.onDeleteFile = this.onDeleteFile.bind(this)

    }

    play(e) {
        e.preventDefault()
        this.props.startPlaying(Player.getIndex(e.target.id), this)
    }



    onDeleteFile(e) {
        e.preventDefault()
        this.props.deleteFile(this.props.id)
        ipcRenderer.send('delete-file', this.props.id)
        ipcRenderer.on('deleted', (err, arg) => {
        })
        Player.removeSong(this.props.id)
        let date = SetPlaylistDate.getDate()
        let startTime = ''
        if (!date) {
            date = new Date().toISOString().split("T")[0]
        }
        if (localStorage.getItem(date)) {
            const dateItem = JSON.parse(localStorage.getItem(date))
            startTime = dateItem.time ? dateItem.time : ''
        }
        // let todayDate = new Date().toISOString().split("T")[0]
        if (startTime) {
            let timer = startTime
            this.props.files.map((file, count) => {
                if (file.id !== this.props.id) {
                    this.props.updateFile({
                        id: file.id,
                        _id: file._id,
                        path: file.path,
                        name: file.name,
                        duration: file.duration,
                        played: file.played,
                        cover: file.cover,
                        startTime: timer
                    })

                    timer = addTimes((timer).split(" ")[0], file.duration)
                    let todayItem = JSON.parse(localStorage.getItem(date))
                    todayItem = {
                        date: todayItem.date,
                        time: todayItem.time,
                        endTime: timer
                    }
                    localStorage.setItem(date, JSON.stringify(todayItem))
                    if (count === this.props.files.length) {
                        let finalItem = JSON.parse(localStorage.getItem(date))
                        finalItem = {
                            date: finalItem.date,
                            time: finalItem.time,
                            endTime: timer
                        }
                        localStorage.setItem(date, JSON.stringify(finalItem))
                    }
                }
            })
        }


    }


    render() {
        const {name, isPlaying, _id, duration, played, startTime} = this.props
        let {cover} = this.props
        if (!cover) {
            cover = 'media/mp3.png'
        }

        return (
            <tr className={classnames({"table-success": isPlaying}, {"table-secondary": played},)} >

                <td><img src={cover} width="20" height="20"/></td>
                <td id={_id} onDoubleClick={this.play} >{name}</td>
                <td>{startTime}</td>
                <td>{duration}</td>
                <td><i className="fa fa-trash" onClick={this.onDeleteFile}></i></td>

            </tr>
        )
    }
}

PlayListItem.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    updateFile: PropTypes.func.isRequired,
    startPlaying: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    played: PropTypes.bool.isRequired,
    startTime: PropTypes.string.isRequired,
    cover: PropTypes.string,
    files: PropTypes.array.isRequired,
    isPlaying: PropTypes.bool,
    _id: PropTypes.string,

}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}


export default connect(mapStateToProps, {updateFile, deleteFile})(PlayListItem)