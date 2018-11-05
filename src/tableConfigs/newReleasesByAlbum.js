import { get, join } from "lodash";
const star = String.fromCharCode(parseInt(2605, 16));

export default [
    {
        dataKey: "uri",
        getter: "album.uri",
        hidden: true
    },
    {
        dataKey: "id",
        getter: "album.id",
        hidden: true
    },
    {
        dataKey: "image",
        hidden: true,
        getter: "album.images[2].url"
    },
    {
        label: "Album",
        dataKey: "album",
        hidden: true,
        getter: "album.name"
    },
    {
        label: "Release Date",
        dataKey: "releaseDate",
        getter: "newReleaseMeta.release_date",
        width: 140
    },
    {
        label: "Artist",
        dataKey: "artist",
        hidden: true,
        getter: "artists.0.name"
    },
    {
        label: `Album ${star}`,
        dataKey: "albumPopularity",
        getter: "album.popularity",
        width: 100
    },
    {
        label: `Artist ${star}`,
        dataKey: "artistPopularity",
        getter: "artists.0.popularity",
        width: 100
    },
    {
        label: "Genres",
        dataKey: "genres",
        formatter: row => join(get(row, "genres"), ", ")
    },
    {
        label: "Type",
        dataKey: "type",
        getter: "album.album_type",
        hidden: true
    }
];
