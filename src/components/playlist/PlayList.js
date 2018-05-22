import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {addFile, deleteFile, clearFiles} from "../../actions/playlistActions"
import PlayListItem from "./PlayListItem"
import Sortable from "sortablejs"

class PlayList extends React.Component {
    constructor(props) {
        super(props)
        this.props.clearFiles()
        this.props.files.map(file => this.props.addFile(file))

    }

    componentDidMount() {
        const element = document.getElementById('playlist')
        Sortable.create(element)
    }

    render() {
        let count = 1
        return (

             <table className="table table-sm table-hover table-borderless" >
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
                    return <PlayListItem key={i} filename={file.name} duration={file.duration} id={file.id}
                                         path={file.path} played={file.played}
                                         startTime={file.startTime ? file.startTime : ''} cover={file.cover}
                                         count={count++}/>
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
