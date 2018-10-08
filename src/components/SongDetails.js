import React from "react";
import { join, split, map, last } from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    songsSelector,
    showSideBarSelector,
    artistTopTracksSelector,
    artistDataSelector
} from "../selectors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import _ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { compose, mapProps } from "recompose";
import Typography from "@material-ui/core/Typography";
import PlayButton from "./Analyzer/PlayButton";
import PlayAll from "./PlayAll";
import styled from "styled-components";

const ListItemText = styled(_ListItemText)`
    flex: 1 !important;
`;

const ArtistPanel = compose(
    connect(
        createStructuredSelector({
            artistTopTracks: artistTopTracksSelector,
            showSideBar: showSideBarSelector,
            songs: songsSelector,
            artistData: artistDataSelector
        })
    ),
    mapProps(({ artistData, artistTopTracks, showSideBar, songs }) => {
        const [, type, id] = split(showSideBar, ":");
        return {
            topTracks: map(artistTopTracks[id], trackId => songs[trackId]),
            artistData: artistData[id] || {}
        };
    })
)(function _ArtistPanel({ topTracks, artistData }) {
    return (
        <React.Fragment>
            <Typography variant="display2" gutterBottom>
                {artistData.name}
            </Typography>
            <PlayAll uris={map(topTracks, track => track.uri)} />
            <List>
                {map(topTracks, track => (
                    <ListItem key={track.id}>
                        <ListItemIcon>
                            <PlayButton uri={track.uri} />
                        </ListItemIcon>
                        <ListItemText
                            primary={track.name}
                            secondary={join(map(track.artists, artist => artist.name), ", ")}
                        />
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    );
});

const SongDetails = ({ showSideBar }) =>
    split(showSideBar, ":")[1] === "artist" ? <ArtistPanel /> : null;

export default connect(
    createStructuredSelector({
        showSideBar: showSideBarSelector
    })
)(SongDetails);
