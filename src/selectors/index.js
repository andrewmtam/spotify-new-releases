import _ from "lodash";
import { createSelector } from "reselect";

export const accessTokenSelector = createSelector(
    state => _.get(state, "app.firebase.token"),
    accessToken => accessToken
);

export const spotifyPlaylistIdSelector = createSelector(
    state => _.get(state, "app.playlist.id"),
    playlistId => playlistId
);

export const firebaseUserIdSelector = createSelector(
    state => _.get(state, "app.firebase.id"),
    userId => userId
);

export const searchTracksSelector = createSelector(
    state => _.get(state, "app.search.tracks.items") || [],
    tracks => tracks
);

export const searchTextSelector = createSelector(
    state => _.get(state, "app.search.text") || "",
    text => text
);

export const playlistIdSelector = createSelector(
    state => _.get(state, "app.firebase.playlistId") || "",
    playlistId => playlistId
);

export const playlistTracksSelector = createSelector(
    state => _.get(state, "app.playlist.tracks.items") || [],
    tracks => tracks
);

export const playlistUriSelector = createSelector(
    state => _.get(state, "app.playlist.uri") || "",
    playlistId => playlistId
);

export const spotifyUserIdSelector = createSelector(
    state => _.get(state, "app.spotifyUser.id") || "",
    spotifyUserId => spotifyUserId
);

export const playStatusSelector = createSelector(
    state => _.get(state, "app.firebase.playStatus") || "",
    playStatus => playStatus
);

export const songAddedSelector = createSelector(
    state => _.get(state, "app.firebase.songAdded") || "",
    songAdded => songAdded
);

export const songsSelector = createSelector(
    state => _.get(state, "app.analyzer.songs") || [],
    songs => songs
);

export const songIdsSelector = createSelector(songsSelector, songs =>
    _.map(songs, song => _.get(song, "track.id"))
);

export const songDataSelector = createSelector(
    state => _.get(state, "app.analyzer.songData") || [],
    songData => songData
);

export const songsWithDataByIdSelector = createSelector(
    songDataSelector,
    songsSelector,
    (songData, songs) =>
        _.merge(
            {},
            _.keyBy(_.map(songs, songDetails => ({ songDetails })), "songDetails.track.id"),
            _.keyBy(_.map(songData, songAnalysis => ({ songAnalysis })), "songAnalysis.id")
        )
);

export const artistIdsSelector = createSelector(songsSelector, songs => {
    console.log(songs);
    return _.uniq(
        _.map(_.flatten(_.map(songs, song => _.get(song, "track.artists"))), artist =>
            _.get(artist, "id")
        )
    );
});
