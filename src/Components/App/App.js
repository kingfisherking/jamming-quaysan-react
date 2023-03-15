//deleted import logo from './logo.svg';
import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from "../PlayList/PlayList"
import Spotify from "../../util/Spotify"

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [], 
      playlistName: "New Playlist",
      playlistTracks: [], 
      description: ""
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  updateDescription(desc){
    this.setState({
      description: desc
    });
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if(tracks.every(
      (song) => song.id !== track.id
    )) {
      tracks.push(track);
      //alert(track.uri)
      this.setState({
        playlistTracks: tracks
      });
    }
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks.filter(song => song.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  savePlaylist(){
    const name = this.state.playlistName;
    const description = this.state.description;
    const trackURIs =  this.state.playlistTracks.map((song)=> song.uri);
    Spotify.savePlaylist(name, trackURIs, description).then(
      () => {
        this.setState(
          {
            playlistName: "New Playlist",
            playlistTracks: [], 
            description: ""
          }
        );
        const lastbit = document.getElementById("desc");
        lastbit.value = ""; //sorry, this was the last bit I wanted to fix, this isn't super descriptive
      }
    );
  }

  search(term) {
    Spotify.search(term).then(results => {
      this.setState({searchResults: results})
    });
    

  }

  render(){
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search}/>
    <div className="App-playlist">
      <SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack}/>
      <PlayList playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} 
      onSave={this.savePlaylist} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack}
       onDesChange={this.updateDescription}/>
    </div>
  </div>
</div>
    )
  }
}

export default App;
