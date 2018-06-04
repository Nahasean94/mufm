class SetPlaylistDate {
    //declare date variable
    state = {
        date: '',
        endTime:''
    }

    setDate(date) {
        this.state.date = date
    }

    getDate() {
        return this.state.date
    }
    setEndTime(time) {
        this.state.endTime = time
    }

    getEndTime() {
        return this.state.endTime
    }

}


const instance = new SetPlaylistDate()
Object.freeze(instance)

export default instance