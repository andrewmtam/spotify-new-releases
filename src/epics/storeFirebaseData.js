import { ofType, combineEpics } from 'redux-observable';
import _ from 'lodash';
import { merge } from 'rxjs/observable/merge';
import {
    take,
    takeUntil,
    mergeMap,
    switchMap,
    mapTo,
    delay,
    map,
    catchError,
    takeWhile,
} from 'rxjs/operators';
import {
    from,
    of,
    interval,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';
import { storeFirebaseUserSuccess, storeFirebaseUserError } from '../redux/actions';
import { accessTokenSelector, spotifyPlaylistIdSelector  } from '../selectors';

export default function initializeConnections(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('STORE_FIREBASE_USER_START'),
        switchMap(
            () => (
                action$.ofType('SET_SPOTIFY_USER_SUCCESS')
                    .pipe(
                        take(1)
                    )
            )
        ),
        switchMap(
            () => (
                action$.ofType('CREATE_PLAYLIST_SUCCESS')
                    .pipe(
                        take(1)
                    )
            )
        ),
        mergeMap(
            action => {
                const id = uuid();
                const doc = {
                    id,
                    token: accessTokenSelector(state$.value),
                    playlistId: spotifyPlaylistIdSelector(state$.value),
                };
                return from(
                    firebaseApp.setUserData(doc)
                        .then(() => doc)
                )
            },
        ),
        mergeMap( doc => (
            [
                storeFirebaseUserSuccess(doc),
            ]
        )),
        catchError(e => of(storeFirebaseUserError(e.message)))
    );
}