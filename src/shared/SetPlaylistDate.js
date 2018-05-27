class SetPlaylistDate {
    //declare date variable
    state = {
        date: ''
    }

    setDate(date) {
        this.state.date = date
    }

    getDate() {
        return this.state.date
    }

}


const instance = new SetPlaylistDate()
Object.freeze(instance)

export default instance