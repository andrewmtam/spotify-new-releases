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
import { storeFirebaseUserStart, createUserIdSuccess } from '../redux/actions';
import { accessTokenSelector, spotifyPlaylistIdSelector  } from '../selectors';

export default function initializeConnections(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType('CREATE_USER_ID_START'),
        mergeMap(
            action => ([
                createUserIdSuccess(uuid()),
            ])
        )
    );
}