let accessToken;
const clientID = "1b57f9e615864becaadc445ac5616266";
const redirectURI = "https://oceanic-grape.surge.sh";

var Spotify = {
    getAccessToken() {
        if(accessToken){
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expirationMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expirationMatch){
            accessToken = accessTokenMatch[1];
            const expiration = Number(expirationMatch[1]);

            window.setTimeout(()=> accessToken = '', expiration * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { 
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          if (!jsonResponse.tracks) {
            return [];
          }
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        })
      },

      async savePlaylist(name, trackUris, description="jammming playlist") {
        if (!name || !trackUris.length) {
          return;
        }
    
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
    
        return await fetch('https://api.spotify.com/v1/me', {
          headers: headers
        }).then(response => response.json()
        ).then(jsonResponse => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ name: name, description: description })
            }).then(response => response.json()
            ).then(jsonResponse => {
              const playlistId = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
              });
            });
        });
      }

}

export default Spotify;