import React, { Component } from "react";
import { createStructuredSelector } from "reselect";
import TagList from "./TagList";
import { defaultTableRowRenderer } from "react-virtualized";
import { compose } from "recompact";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "../Table";
import IconButton from "@material-ui/core/IconButton";
import {
    toggleNewReleaseAlbum,
    toggleNewReleaseSong,
    reorderTags,
    openNewReleaseModal,
    reorderQueryTags,
    setLocalStorage,
    getSongsStart,
    getNewReleasesStart
} from "../../redux/actions";
import { get, size, join, first, map, find, includes } from "lodash";
import SearchBar from "./SearchBar";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import _ItemTagList from "./ItemTagList";
import Settings from "./Settings";
import NewReleasesAddTagModal from "../NewReleases/NewReleasesAddTagModal";
import {
    genreColorsSelector,
    queryParamsTagsSelector,
    routerPathnameSelector
} from "../../selectors";
import materialStyled from "../../materialStyled";
import _Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";

const Button = materialStyled(_Button)({
    minWidth: 30
});

const Tags = styled.div`
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
`;

const TagsWithButton = styled.div`
    display: flex;
    overflow: hidden;
    align-items: center;
`;

const ItemTagList = styled(_ItemTagList)`
    margin: 0 2px;
`;

const NewReleasesAlbumsTableWrapper = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
`;

const HeaderCell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const SearchColumn = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ColumnCellRenderer = ({ cellData }) => <Typography variant="caption">{cellData}</Typography>;
const HeaderCellRenderer = ({ label, dataKey, sortIndicator }) => (
    <HeaderCell>
        <Typography title={label}>{label}</Typography>
        <Typography>{sortIndicator && sortIndicator}</Typography>
    </HeaderCell>
);

const RowRenderer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const Loader = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;
class NewReleasesAlbumsTable extends Component {
    virtualizedConfig = {
        onRowClick: ({ event, index, rowData: { uri, id, isTrack } }) =>
            !isTrack ? this.props.toggleNewReleaseAlbum(id) : this.props.toggleNewReleaseSong(id),
        rowStyle: ({ index }) => {
            const {
                tableData: { rows }
            } = this.props;
            const backgroundColors = get(rows, `${index}.meta.backgroundColors`);
            const linearGradientString = join(backgroundColors, ", ");
            return (
                size(backgroundColors) && {
                    background:
                        size(backgroundColors) > 1
                            ? `linear-gradient(90deg, ${linearGradientString})`
                            : first(backgroundColors)
                }
            );
        },
        rowHeight: 80,
        headerHeight: 32,
        rowRenderer: ({ style, onRowClick, ...props }) => {
            const { index, rowData, key } = props;
            const {
                meta: { genres }
            } = rowData;
            return (
                <RowRenderer
                    key={key}
                    onClick={event => onRowClick({ event, index, rowData })}
                    style={style}
                >
                    {defaultTableRowRenderer(props)}
                    <ItemTagList genres={genres} />
                </RowRenderer>
            );
        }
    };

    columnConfig = {
        cellRenderer: ColumnCellRenderer,
        headerRenderer: HeaderCellRenderer
    };

    handleQueryTagSort = ({ oldIndex, newIndex }) =>
        this.props.reorderQueryTags(oldIndex, newIndex);

    handleTagSort = ({ oldIndex, newIndex }) => this.props.reorderTags(oldIndex, newIndex);

    refreshData = () => {
        const { setLocalStorage, routerPathname, getNewReleasesStart, getSongsStart } = this.props;
        const mode = includes(routerPathname, "new-release")
            ? "newRelease"
            : includes(routerPathname, "analyzer")
                ? "library"
                : null;

        if (mode) {
            if (mode === "newRelease") {
                setLocalStorage("newReleaseData", "", new Date().getTime() + 1000 * 60 * 60 * 24);
                getNewReleasesStart();
            } else if (mode === "library") {
                setLocalStorage("library", "", new Date().getTime() + 1000 * 60 * 60 * 24);
                getSongsStart();
            }
        }
    };

    render() {
        const {
            openNewReleaseModal,
            tableData,
            loading,
            genreColors,
            queryParamsTags
        } = this.props;
        const active = map(
            queryParamsTags,
            tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre) || {
                    genre: tagGenre
                }
        );
        return (
            <NewReleasesAlbumsTableWrapper>
                {loading ? (
                    <Loader>
                        <CircularProgress size={80} color="primary" />
                    </Loader>
                ) : (
                    <React.Fragment>
                        <TagsWithButton>
                            <Button size="small" onClick={openNewReleaseModal}>
                                <AddIcon fontSize="small" color="action" />
                                {size(active) ? "" : "Add Genre"}
                            </Button>
                            <Tags>
                                <TagList
                                    axis="x"
                                    lockAxis="x"
                                    tags={active}
                                    onSortEnd={this.handleQueryTagSort}
                                    useDragHandle={true}
                                />
                            </Tags>
                            <IconButton onClick={this.refreshData}>
                                <RefreshIcon fontSize="small" color="action" />
                            </IconButton>
                        </TagsWithButton>
                        <Table
                            tableData={tableData}
                            prefixColumnsProps={[
                                {
                                    cellRenderer: AlbumImageCellRenderer,
                                    key: "album",
                                    width: 160,
                                    headerRenderer: () => (
                                        <SearchColumn>
                                            <Settings tableData={tableData} />
                                            <NewReleasesAddTagModal />
                                            <SearchBar />
                                        </SearchColumn>
                                    ),
                                    disableSort: true,
                                    flexGrow: 5
                                }
                            ]}
                            virtualizedConfig={this.virtualizedConfig}
                            columnConfig={this.columnConfig}
                        />
                    </React.Fragment>
                )}
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

export default compose(
    connect(
        createStructuredSelector({
            genreColors: genreColorsSelector,
            routerPathname: routerPathnameSelector,
            queryParamsTags: queryParamsTagsSelector
        }),
        {
            toggleNewReleaseAlbum,
            toggleNewReleaseSong,
            reorderTags,
            reorderQueryTags,
            openNewReleaseModal,
            setLocalStorage,
            getSongsStart,
            getNewReleasesStart
        }
    )
)(NewReleasesAlbumsTable);
