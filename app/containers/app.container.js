import React from 'react';

import Search from '../components/search.component';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Footer from '../components/footer.component';

//used to make some ajax calls
import Axios from 'axios';
//for the sound
import Sound from 'react-sound';


//autoComplete value is the value of the auto-complete in the search box
class AppContainer extends React.Component{

    constructor(props){
      super(props);

      this.client_id = '2f98992c40b8edf17423d93bda2e04ab';

      this.state = {
        track: {stream_url:'', title: '', artwork_url: ''},
        playStatus: Sound.status.STOPPED,
        elapsed: '00:00',
        total: '00:00',
        position: 0,
        playFromPosition: 0,
        autoCompleteValue: '',
        tracks: []
      }
    }

    componentDidMount(){
      this.randomTrack();
    }

    //picking a track from Soundcloud to play when the component is fully loaded
    randomTrack(){
      let _this = this;

      //using request for playlist for soundcloud
      Axios.get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
        .then(function (response){

          const trackLength = response.data.tracks.length;

          const randomNumber = Math.floor((Math.random() * trackLength) + 1);

          _this.setState({track: response.data.tracks[randomNumber]});
        })
        .catch(function (err){
          console.log(err);
        });
    }

    //preparing the url to stream
    prepareUrl(url){
      return `${ url }?client_id= ${ this.client_id }`
    }

    //when playing, update the elapsed time of the song playing
    //receives the current status of audio instance and gives access to audio properties
    handleSongPlaying(audio){
      this.setState({ elapsed: this.formatMilliseconds(audio.position),
                      total: this.formatMilliseconds(audio.duration),
                      position: audio.position / audio.duration });
    }

    //when song is finished playing, find another track to play
    handleSongFinished(){
      this.randomTrack();
    }


    ///FOR THE SEARCH COMPONENT///////
    /////////////////////////////////

    //changing the track to the song chosen
    handleSelect(value, item){
      this.setState({ autoCompleteValue: value, track: item });
    }

    //when changing the value in the search box
    handleChange(event, value){

      //updating input box
      this.setState({ autoCompleteValue: event.target.value });
      let _this = this;

      //Searching for the song with the entered value in soundcloud
      Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
        .then (function (response){

          //updating with the tracks with what it sends back
          _this.setState({ tracks: response.data });
        })
        .catch(function(err){
          console.log(err);
        });
    }

    ///FOR THE PLAYER COMPONENT///////
    /////////////////////////////////
    togglePlay(){
      if (this.state.playStatus === Sound.status.PLAYING){
        this.setState({ playStatus: Sound.status.PAUSED })
      }
      else{
        this.setState({ playStatus: Sound.status.PLAYING })
      }
    }

    stop(){
      this.setState({ playStatus: Sound.status.STOPPED });
    }

    //adding 10 seconds
    forward(){
      this.setState({ playFromPosition: this.state.playFromPosition += 1000 * 10 });
    }

    //go back 10 seconds
    backward(){
      this.setState({ playFromPosition: this.state.playFromPosition -= 1000 * 10 });
    }

    //formatting the time for the position and elapsed on the player
    formatMilliseconds(milliseconds){
      // Format hours
      var hours = Math.floor(milliseconds / 3600000);
      milliseconds = milliseconds % 3600000;

      // Format minutes
      var minutes = Math.floor(milliseconds / 60000);
      milliseconds = milliseconds % 60000;

      // Format seconds
      var seconds = Math.floor(milliseconds / 1000);
      milliseconds = Math.floor(milliseconds % 1000);

      // Return as string
      return (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;
    }


    /////////FOR THE ARTWORK//////
    /////////////////////////////
    xlArtwork(url){
      return url.replace(/large/, 't500x500');
    }


    render(){

      //for the artwork in the background
      const scotchStyle = {
        width: '500px',
        height: '500px',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba( 0, 0, 0, 0.7)),
                          url(${this.xlArtwork(this.state.track.artwork_url)})`
      }

      return(
        <div className = 'scotch_music' style = { scotchStyle }>

          <Search
            autoCompleteValue={this.state.autoCompleteValue}
            tracks={this.state.tracks}
            handleSelect={this.handleSelect.bind(this)}
            handleChange={this.handleChange.bind(this)}/>

          <Details
            title = { this.state.track.title } />

          <Player
            togglePlay = { this.togglePlay.bind(this) }
            stop = { this.stop.bind(this) }
            playStatus = { this.state.playStatus }
            forward = { this.forward.bind(this) }
            backward = { this.backward.bind(this) }
            random = { this.randomTrack.bind(this) } />

          <Progress
            elapsed = { this.state.elapsed }
            total = { this.state.total }
            position = { this.state.position }/>

          <Sound
            url = { this.prepareUrl(this.state.track.stream_url) }
            playStatus = { this.state.playStatus }
            onPlaying = { this.handleSongPlaying.bind(this) }
            playFromPosition = { this.state.playFromPosition }
            onFinishedPlaying = { this.handleSongFinished.bind(this)}/>
        </div>
      );
    }
}

export default AppContainer;
