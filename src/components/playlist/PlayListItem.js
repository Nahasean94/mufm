import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile,getFile} from '../../actions/playlistActions'


class PlayListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false
        }
        this.play = this.play.bind(this)
        // PlayListItem.playNext = PlayListItem.playNext.bind(this)
    }

    play() {
        document.getElementById('playing_song').innerText = this.props.filename
        const audioPlayer = document.getElementById('audio_player')
        audioPlayer.src = this.props.path
        audioPlayer.play()
        audioPlayer.onended=()=>{
            this.playNext()
        }
        this.props.updateFile({
            id: this.props.id,
            name: this.props.filename,
            duration: this.props.duration,
            path: this.props.path,
            played: true
        })
    }
        playNext() {
        const nextFile=this.props.getFile(this.props.id)
            console.log(nextFile)
        document.getElementById('playing_song').innerText = nextFile.filename
        const audioPlayer = document.getElementById('audio_player')
        audioPlayer.src = nextFile.path
        audioPlayer.play()
        // this.props.updateFile({
        //     id: this.props.id,
        //     name: this.props.filename,
        //     duration: this.props.duration,
        //     path: this.props.path,
        //     played: true
        // })
        // this.setState({isPlaying: true})

    }

    render() {
        const {filename, id, duration, played} = this.props
        console.log("kljklj")
        return (
            <tr className={classnames( {"table-success": played}, {"table-primary": this.state.isPlaying})}>
                <td>{id}</td>
                <td onDoubleClick={this.play}>{filename}</td>
                <td>{''}</td>
                <td>{duration}</td>
                <td>{''}</td>
                <td>{''}</td>
            </tr>
        )
    }
}

PlayListItem.propTypes = {
    filename: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    updateFile: PropTypes.func.isRequired,
    played: PropTypes.bool.isRequired,
    getFile: PropTypes.func.isRequired,

}

export default connect(null, {updateFile,getFile})(PlayListItem)