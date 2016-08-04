/*
 * Redux Actions
 */
import BugsApi from './../lib/BugsApi'

export const INVALIDATE_BUG_DATA = "INVALIDATE_BUG_DATA"
export const REQUEST_BUG_DATA = "REQUEST_BUG_DATA"
export const POST_BUG_DATA_REQUEST = "POST_BUG_DATA_REQUEST"
export const QUERY_BUG_DATA_REQUEST = "QUERY_BUG_DATA_REQUEST"
export const RECEIVE_BUG_DATA = "RECEIVE_BUG_DATA"
export const RECEIVE_FILTERED_BUG_DATA = "RECEIVE_FILTERED_BUG_DATA"
export const FILTERED_RESULTS_NOT_FOUND = "FILTERED_RESULTS_NOT_FOUND"
export const FETCH_BUG_DATA_ERROR = "FETCH_BUG_DATA_ERROR"
export const POST_BUG_DATA_ERROR = "POST_BUG_DATA_ERROR"
export const QUERY_BUG_DATA_ERROR = "QUERY_BUG_DATA_ERROR"
export const INVALIDATE_RESULTS_NOT_FOUND = "INVALIDATE_RESULTS_NOT_FOUND"

const requestBugData = () => {
  return {
    type: REQUEST_BUG_DATA
  }
}

const postBugDataRequest = () => {
  return {
    type: POST_BUG_DATA_REQUEST
  }
}

const queryBugDataRequest = () => {
  return {
    type: QUERY_BUG_DATA_REQUEST
  }
}

const receiveBugData = (data) => {
  return {
    type: RECEIVE_BUG_DATA,
    payload: data,
    receivedAt: Date.now()
  }
}

const receiveFilteredBugData = (data) => {
  return {
    type: RECEIVE_FILTERED_BUG_DATA,
    payload: data,
    receivedAt: Date.now()
  }
}

const filteredResultsNotFound = () => {
  return {
    type: FILTERED_RESULTS_NOT_FOUND
  }
}

const fetchBugDataError = (err) => {
  return {
    type: FETCH_BUG_DATA_ERROR,
    message: err
  }
}

const postBugDataError = (err) => {
  return {
    type: POST_BUG_DATA_ERROR,
    message: err
  }
}

const queryBugDataError = (err) => {
  return {
    type: QUERY_BUG_DATA_ERROR,
    message: err
  }
}

const fetchBugData = () => {
  return dispatch => {
    dispatch(requestBugData())
    return BugsApi.getBugData(data => {
      dispatch(receiveBugData(data))
    }, err => {
      dispatch(fetchBugDataError(err))
    })
  }
}

const postBugData = (newbug) => {
  return dispatch => {
      dispatch(postBugDataRequest())
    return BugsApi.addBugData(newbug, data => {
      dispatch(invalidateBugData())
      dispatch(fetchBugDataIfNeeded())
    }, err => {
      dispatch(postBugDataError(err))
    })
  }
}

const queryBugData = (query) => {
  return dispatch  => {
      dispatch(queryBugDataRequest())
    return BugsApi.filterBugData(query, data => {
      if(data.length != 0) {
        dispatch(receiveFilteredBugData(data))
      }
      else {
        dispatch(filteredResultsNotFound())
      }
    }, err => {
      dispatch(queryBugDataError(err))
    })
  }
}

const shouldFetchBugData = (state) => {
  const bugdata = state.bugDataReducer
  if(!bugdata.fetched) {
    return true
  }
  else if(bugdata.fetching) {
    return false
  }
  else {
    return bugdata.didInvalidate
  }
}

/*
* Exported Actions
*/

export const invalidateBugData = () => {
  return {
    type: INVALIDATE_BUG_DATA
  }
}

export const fetchBugDataIfNeeded = () => {
  return (dispatch, getState) => {
    if(shouldFetchBugData(getState())) {
      return dispatch(fetchBugData())
    }
  }
}

export const addNewBugData = (newbug) => {
  return dispatch => {
    return dispatch(postBugData(newbug))
  }
}

export const filterBugData = (query) => {
  return dispatch => {
    return dispatch(queryBugData(query))
  }
}

export const invalidateResultsNotFound = () => {
  return {
    type: INVALIDATE_RESULTS_NOT_FOUND
  }
}