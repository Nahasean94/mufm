import React, {Component} from 'react'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from "../shared/TextFieldsGroup"
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFile, clearFiles} from "../actions/playlistActions"
import {tConv12, addTimes, convert_to_24h} from "../shared/TimeFunctions"
import Player from '../Player'

class PlaylistDate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            time: '',
            timelineDate: new Date().toDateString(),
            timelineTime: localStorage.getItem(new Date().toISOString().split("T")[0]) ? localStorage.getItem(new Date().toISOString().split("T")[0]).time?tConv12(JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).time) : 'not set':'not set',
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
        if (validator.isEmpty(data.date)) {
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
//selected date is past
//                 console.log(Player.playlist)
            if (Date.parse(new Date().toLocaleDateString()) > Date.parse(this.state.date)) {
                document.getElementById('add-media').hidden = true
                document.getElementById('save-playlist').hidden = true
                Player.emptyPlayList()
                this.props.clearFiles()
                this.setState({disableTime: true})
            }
            //selected date is future
            else if (Date.parse(new Date().toLocaleDateString()) < Date.parse(this.state.date)) {
                Player.emptyPlayList()
                // console.log(Player.playlist)
                document.getElementById('save-playlist').hidden = true
                // document.getElementById('add-media').hidden = true
                // this.setState({disableTime: true})
                this.props.clearFiles()
                localStorage.setItem(this.state.date, JSON.stringify({date: this.state.date}))
            }
            else {

                localStorage.setItem(this.state.date, JSON.stringify({date: this.state.date}))
            }
        }

//             else{
//                 let todayItem=JSON.parse(localStorage.getItem(todayDatetodayItem,
//     date:
// }
//         }
        // }
        this.setState({timelineDate: this.state.date, time: '', date: '', errors: {}, isLoading: true})
    }

    validateTime(data) {
        let errors = {}
        if (validator.isEmpty(data.time)) {
            errors.time = 'This field is required'
        }
        if (!this.state.date) {

            const regex = new RegExp(':', 'g'),
                setTime = this.state.time + ":00",
                timeNow = convert_to_24h(new Date().toLocaleTimeString())
            if (parseInt(setTime.replace(regex, ''), 10) < parseInt(timeNow.replace(regex, ''), 10)) {
                errors.time = "Start time cannot be in the past"
            }
            // else {
            //     console.log('timeStr2 is smaller then timeStr1');
            // }
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
            if (!this.state.date) {
                if (!localStorage.getItem(todayDate)) {
                    localStorage.setItem(todayDate, JSON.stringify({
                        date: todayDate,
                        time: this.state.time + ":00"
                    }))
                }
            }
            else {
                let todayItem = JSON.parse(localStorage.getItem(this.state.date))
                todayItem = {
                    date: todayItem.date,

                    time: this.state.time + ":00"
                }
                localStorage.setItem(this.state.date, JSON.stringify(todayItem))
            }

            this.props.files.map(file => {
                this.props.updateFile({
                    id: file.id,
                    path: file.path,
                    name: file.name,
                    duration: file.duration,
                    played: file.played,
                    startTime: timer
                })
                timer = addTimes((timer).split(" ")[0], file.duration)
                let todayItem = JSON.parse(localStorage.getItem(todayDate))
                todayItem = {
                    date: todayItem.date,
                    time: todayItem.time,
                    endTime: timer
                }
                localStorage.setItem(todayDate, JSON.stringify(todayItem))
            })
            //Start playing when the time reaches
            setInterval(function () {

                let currentTime = new Date().toLocaleTimeString()
                if (currentTime.match(/am|pm/i) || currentTime.toString().match(/am|pm/i)) {
                    currentTime = convert_to_24h(currentTime)
                }
                if (currentTime === JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).time + ":00") {
                    Player.startPlaying(0)
                }
            }, 1000)
        }
    }


    render() {
        const {errors, date, time, timelineDate, timelineTime, disableTime} = this.state

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
                        <input type="submit" className="form-control form-control-sm btn btn-sm btn-primary"
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
                        <input type="submit" className="form-control form-control-sm btn btn-sm btn-primary"
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
    clearFiles: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        files: state.playlistReducers
    }
}

export default connect(mapStateToProps, {updateFile, clearFiles})(PlaylistDate)