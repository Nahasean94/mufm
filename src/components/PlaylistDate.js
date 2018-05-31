import React, {Component} from 'react'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from "../shared/TextFieldsGroup"
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile, clearFiles, addFile, deleteFile} from "../actions/playlistActions"
import {tConv12, addTimes, convert_to_24h,} from "../shared/TimeFunctions"
import Player from '../shared/Player'
import SetPlaylistDate from "../shared/SetPlaylistDate"

const {ipcRenderer} = window.require('electron')

class PlaylistDate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            time: '',
            timelineDate: new Date().toDateString(),
            timelineTime: '',
            errors: {},
            isLoading: false,
            invalid: false,
            startTime: '',

        }
        this.onSelectDate = this.onSelectDate.bind(this)
        this.onSelectTime = this.onSelectTime.bind(this)
        this.onChange = this.onChange.bind(this)
    }


    onChange(e) {
        e.preventDefault()
        this.setState({[e.target.name]: e.target.value})
    }

    validateDate(data) {
        let errors = {}

        if (data.date === '') {
            errors.date = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isDateValid() {
        const {errors, isValid} = this.validateDate(this.state)
        if (!isValid) {

            this.setState({errors})
        }
        return isValid
    }

    onSelectDate(e) {
        e.preventDefault()
        if (this.isDateValid()) {
            Player.emptyPlayList()
            this.props.clearFiles()

//selected date is past
            if (Date.parse(new Date().toLocaleDateString()) > Date.parse(this.state.date)) {
                document.getElementById('add-media').hidden = true
                document.getElementById('save-playlist').hidden = true
                this.setState({disableTime: true})
                ipcRenderer.send('get-playlist', this.state.date)
            }
            //selected date is future
            else if (Date.parse(new Date().toLocaleDateString()) < Date.parse(this.state.date)) {
                SetPlaylistDate.setDate(this.state.date)
                document.getElementById('save-playlist').hidden = true
                document.getElementById('add-media').hidden = false
                this.setState({disableTime: false})

                //check if date exists in localstorage, if not create an entry, if exists fetch the playlist
                if (!localStorage.getItem(this.state.date)) {
                    localStorage.setItem(this.state.date, JSON.stringify({date: this.state.date}))
                }
                console.log("State date is", this.state.date)

                ipcRenderer.send('get-playlist', this.state.date)

            }
            //date is today
            else if (Date.parse(new Date().toLocaleDateString()) === Date.parse(this.state.date)) {


                SetPlaylistDate.setDate(this.state.date)
                document.getElementById('add-media').hidden = false
                this.setState({disableTime: false})
                //check if date exists in localstorage, if not create an entry, if exists fetch the playlist
                if (!localStorage.getItem(this.state.date)) {
                    localStorage.setItem(this.state.date, JSON.stringify({date: this.state.date}))
                }

                ipcRenderer.send('get-playlist', this.state.date)


            }
        }
        this.setState({timelineDate: this.state.date, time: '', date: '', errors: {}, isLoading: true})
    }

    validateTime(data) {
        let errors = {}
        if (validator.isEmpty(data.time)) {
            errors.time = 'This field is required'
        }
        let date = SetPlaylistDate.getDate()
        //if date is not set assume today date
        if (!date) {
            date = new Date().toISOString().split("T")[0]
        }
        const playTime = this.state.time + ":00"
        let countDownDate = new Date(`${date} ${playTime}`).getTime()

//  Get todays date and time
        let now = new Date().getTime()

        // Find the distance between now an the count down date
        let distance = countDownDate - now
        if (distance < 0) {
            errors.time = "Start time cannot be in the past"
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isTimeValid() {
        const {errors, isValid} = this.validateTime(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSelectTime(e) {
        e.preventDefault()

        if (this.isTimeValid()) {
            // console.log(this.state.time)
            // console.log(new Date().toLocaleTimeString())
            let timer = this.state.time + ":00"
            this.setState({
                errors: {}, isLoading: true,
                timelineTime: this.state.time,
                startTime: this.state.time,
            })
            const todayDate = new Date().toISOString().split("T")[0]
            let date = SetPlaylistDate.getDate()
            if (!date) {
                if (!localStorage.getItem(todayDate)) {
                    localStorage.setItem(todayDate, JSON.stringify({
                        date: todayDate,
                        time: this.state.time + ":00"
                    }))
                }
                else {
                    let todayItem = JSON.parse(localStorage.getItem(todayDate))
                    todayItem = {
                        date: todayItem.date,
                        time: this.state.time + ":00"
                    }
                    localStorage.setItem(this.state.date, JSON.stringify(todayItem))
                }
            }

            else {

                let dateItem = JSON.parse(localStorage.getItem(date))
                dateItem = {
                    date: dateItem.date,
                    time: this.state.time + ":00"
                }
                localStorage.setItem(date, JSON.stringify(dateItem))
            }

            if (!date) {
                date = todayDate
            }
            this.props.files.map(file => {
                this.props.updateFile({
                    id: file.id,
                    path: file.path,
                    name: file.name,
                    duration: file.duration,
                    played: file.played,
                    startTime: timer,
                    cover: file.cover
                })
                timer = addTimes((timer).split(" ")[0], file.duration)
                let todayItem = JSON.parse(localStorage.getItem(date))
                todayItem = {
                    date: todayItem.date,
                    time: todayItem.time,
                    endTime: timer
                }
                localStorage.setItem(date, JSON.stringify(todayItem))
            })

            const stopwatch = setInterval(() => {
                const playTime = this.state.time + ":00"

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
                    if (Player.getPlayList().length > 0) {
                        console.log(Player.getPlayList())
                        this.props.startPlaying(0, this)
                    }
                }
            }, 1000)

        }
    }


    render() {
        const {errors, date, time, timelineDate, disableTime} = this.state
        let dateItem = SetPlaylistDate.getDate()
        if (!dateItem) {
            dateItem = new Date().toISOString().split("T")[0]
        }
        const timelineTime = localStorage.getItem(dateItem) ?JSON.parse(localStorage.getItem(dateItem)).time ? tConv12(JSON.parse(localStorage.getItem(dateItem)).time) : 'not set' : 'not set'

        return (
            <div>
                <br/>

                <form onSubmit={this.onSelectDate}>
                    <TextFieldGroup
                        label="Date"
                        type="date"
                        name="date"
                        value={date}
                        onChange={this.onChange}
                        error={errors.date}
                    />
                    <div className="form-group">
                        <input type="submit" className="form-control form-control-sm btn btn-sm btn-success"
                               value="Select"/>

                    </div>
                </form>
                <form onSubmit={this.onSelectTime}>
                    <TextFieldGroup
                        label="Start time"
                        type="time"
                        name="time"
                        value={time}
                        onChange={this.onChange}
                        error={errors.time}
                        disabled={disableTime}
                    />
                    <div className="form-group">
                        <input type="submit" className="form-control form-control-sm btn btn-sm btn-success"
                               value="Save" disabled={disableTime}/>

                    </div>
                </form>

                <br/>
                <br/>
                <div id="timeline">
                    <strong>TIMELINE:</strong>
                    <p><strong><em>Date:</em></strong> {timelineDate}</p>
                    <p><strong><em>Start time:</em></strong> {timelineTime}</p>
                </div>

            </div>
        )
    }
}

PlaylistDate.propTypes = {
    files: PropTypes.array.isRequired,
    updateFile: PropTypes.func.isRequired,
    startPlaying: PropTypes.func.isRequired,
    clearFiles: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        files: state.playlistReducers
    }
}

export default connect(mapStateToProps, {updateFile, clearFiles, addFile, deleteFile})(PlaylistDate)