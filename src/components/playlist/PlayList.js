import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {addFile, deleteFile, clearFiles} from "../../actions/playlistActions"
import PlayListItem from "./PlayListItem"

class PlayList extends React.Component {
    constructor(props){
        super(props)
        this.props.clearFiles()
        this.props.files.map(file=>this.props.addFile(file))
    }

    render() {
        return (
            <table className="table table-sm table-hover " >
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Cover</th>
                    <th scope="col">Name</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {this.props.files.map((file,i)=>{
                    return <PlayListItem key={i} filename={file.name} duration={file.duration} id={file.id} path={file.path} played={file.played} startTime={file.startTime?file.startTime:''}  cover={file.cover}/>
                })}
                </tbody>
            </table>
        )
    }
}


PlayList.propTypes = {
    addFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    clearFiles: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile, deleteFile, clearFiles})(PlayList)
