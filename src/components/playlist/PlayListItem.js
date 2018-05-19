import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile, deleteFile} from '../../actions/playlistActions'
import Player from '../../Player'

class PlayListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.props,
            isPlaying: false,
        }
        this.play = this.play.bind(this)
        Player.addToPlayList({
            id: this.props.id,
            path: this.props.path,
            filename: this.props.filename,
            duration: this.props.duration,
            played: this.props.played,
            cover:this.props.cover
        })
        this.onDeleteFile = this.onDeleteFile.bind(this)
    }

    play(e) {
        this.startPlaying(e.target.id - 1)
    }

    startPlaying(playFrom) {
        const existingPlaylist = Player.getPlayList()
        // for (let i = playFrom; i < existingPlaylist.length; i++) {
        if (playFrom >= existingPlaylist.length) {
            playFrom = 0
        }
        // updateFile({
        //     id:playFrom,
        //     path: existingPlaylist[playFrom].path,
        //     filename:existingPlaylist[playFrom].filename,
        //     duration:existingPlaylist[playFrom].duration,
        //     played:true
        // })
        this.hasPlayed({
            id: playFrom + 1,
            path: existingPlaylist[playFrom].path,
            filename: existingPlaylist[playFrom].filename,
            duration: existingPlaylist[playFrom].duration,
            played: true
        })
        this.setState({
            id: playFrom + 1,
            path: existingPlaylist[playFrom].path,
            filename: existingPlaylist[playFrom].filename,
            duration: existingPlaylist[playFrom].duration,
            played: true
        })
        // console.log(existingPlaylist[playFrom])
        document.getElementById('cover-image').src=existingPlaylist[playFrom].cover
        document.getElementById('playing_song').innerText = existingPlaylist[playFrom].filename
        const audioPlayer = document.getElementById('audio_player')
        audioPlayer.src = existingPlaylist[playFrom].path
        audioPlayer.play()
        this.setState({isPlaying: true})
        audioPlayer.addEventListener('ended', () => {
            this.startPlaying(playFrom + 1)
        })
        // }
    }

    hasPlayed(media) {
        // console.log(media)
        // this.props.updateFile(media)


    }

    onDeleteFile(e) {
        e.preventDefault()
        this.props.deleteFile(this.props.id)
        Player.removeSong(this.props.id)
    }

    render() {
        const {filename, count,id, duration, played, path, startTime,} = this.props
        let {cover} = this.props
        if (!cover) {
            cover = 'media/mp3.png'
        }
        return (
            <tr className={classnames({"table-success": played},)}>
                <td>{count}</td>
                <td><img src={cover} width="20" height="20"/></td>
                <td onDoubleClick={this.play} id={id}>{filename}</td>
                <td>{startTime}</td>
                <td>{duration}</td>
                <td><i className="fa fa-trash" onClick={this.onDeleteFile}></i></td>

            </tr>
        )
    }
}

PlayListItem.propTypes = {
    filename: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    updateFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    played: PropTypes.bool.isRequired,
    startTime: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,

}
// function mapStateToProps(state) {
//     return {files: state.playlistReducers}
// }


export default connect(null, {updateFile, deleteFile})(PlayListItem)