import findIndex from "lodash/findIndex"

class Player {
    playlist = []

    addToPlayList(item) {
        this.playlist.push(item)
    }

    getPlayList() {
        return this.playlist
    }

    emptyPlayList() {

        this.playlist.length = 0

    }

    addID(song) {
        this.playlist.forEach(file => {
            if (file.path === song.path && !file._id) {
                file._id = song._id
            }

            return file
        })
    }

    getIndex(_id) {
        return this.playlist.findIndex(file => file._id === _id)
    }

    removeSong(id) {
        const index = findIndex(this.playlist, {id: id})
        if (index >= 0) {
            this.playlist.splice(index, 1)

        }
        // return this.playlist
    }

    addCover(song) {
        this.playlist.forEach(file => {
            if (file.path === song.path && file.cover === undefined) {
                file.cover = song.cover
            }
            return file
        })
    }

    addDuration(song) {
        this.playlist.forEach(file => {
            if (file.path === song.path && !file.isDuration) {
                file.duration = song.duration
            }

            return file
        })
    }

    renderAudioPlayer() {
        const audio = new Audio()
        audio.controls = true
        audio.id = "audio_player"

// Establish all variables that your Analyser will use
        let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height
// Initialize the MP3 player after the page loads all of its HTML into the window
        window.addEventListener("load", initMp3Player, false)

        function initMp3Player() {
            document.getElementById('audio_box').appendChild(audio)
            context = new AudioContext() // AudioContext object instance
            analyser = context.createAnalyser() // AnalyserNode method
            canvas = document.getElementById('analyser_render')
            ctx = canvas.getContext('2d')
            // Re-route audio playback into the processing graph of the AudioContext
            source = context.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(context.destination)
            frameLooper()
        }

// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
        function frameLooper() {
            window.requestAnimationFrame(frameLooper)
            fbc_array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(fbc_array)
            ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
            ctx.fillStyle = '#28a745' // Color of the bars
            bars = 100
            for (let i = 0; i < bars; i++) {
                bar_x = i * 3
                bar_width = 2
                bar_height = -(fbc_array[i] / 2)
                //  fillRect( x, y, width, height ) // Explanation of the parameters below
                ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
            }
        }
    }

}


const instance = new Player()
Object.freeze(instance)

export default instance
