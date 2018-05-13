import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile} from '../../actions/playlistActions'
import Player from '../../Player'

class PlayListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false,
        }
        this.play = this.play.bind(this)
        // PlayListItem.playNext = PlayListItem.playNext.bind(this)
    }

    play() {
        Player.startPlaying(this.props.id - 1)

    }

    render() {
        const {filename, id, duration, played, path} = this.props
        Player.addToPlayList({id: id, path: path, filename: filename, duration: duration, played: played})
        return (
            <tr className={classnames({"table-success": played}, {"table-primary": this.state.isPlaying})}>
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

}


export default connect(null, {updateFile,})(PlayListItem)