import React, { Component } from "react";
import { defaultTableRowRenderer } from "react-virtualized";
import { compose } from "recompact";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { genreColorsSelector, queryParamsSelector, albumsSelector } from "../../selectors";
import Table from "../Table";
import { toggleNewReleaseAlbum, reorderTags, reorderQueryTags } from "../../redux/actions";
import { noop, map, get, size, join, first, difference, find } from "lodash";
import SearchBar from "./SearchBar";
import AlbumImageCellRenderer from "./AlbumImageCellRenderer";
import _ItemTagList from "./ItemTagList";
import Settings from "./Settings";
import NewReleasesAddTagModal from "../NewReleases/NewReleasesAddTagModal";

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
            !isTrack ? this.props.toggleNewReleaseAlbum(id) : noop,
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
            const { index, rowData } = props;
            const {
                meta: { genres }
            } = rowData;
            return (
                <RowRenderer onClick={event => onRowClick({ event, index, rowData })} style={style}>
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

    // TODO: Use html encode library, he to encode strings
    render() {
        const { tableData, genreColors, queryParams, loading } = this.props;
        const active = map(
            queryParams.tags,
            tagGenre =>
                find(genreColors, ({ genre }) => genre === tagGenre) || {
                    genre: tagGenre
                }
        );
        const inactive = difference(genreColors, active);
        return (
            <NewReleasesAlbumsTableWrapper>
                {loading ? (
                    <Loader>
                        <CircularProgress size={80} color="primary" />
                    </Loader>
                ) : (
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
                )}
            </NewReleasesAlbumsTableWrapper>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    genreColors: genreColorsSelector,
    queryParams: queryParamsSelector,
    albums: albumsSelector
});

export default compose(
    connect(
        mapStateToProps,
        {
            toggleNewReleaseAlbum,
            reorderTags,
            reorderQueryTags
        }
    )
)(NewReleasesAlbumsTable);
