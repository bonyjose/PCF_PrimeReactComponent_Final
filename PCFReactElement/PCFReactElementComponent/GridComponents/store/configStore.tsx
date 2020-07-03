import {createStore, combineReducers, compose} from 'redux';

import postReducer from './reducers/postReducer'


const rootReducer = combineReducers({
    postReduce: postReducer
});


//let composeEnhancers = compose;
// const composedEnhancers = compose(...enhancers)
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
    return createStore(rootReducer);
};

export default configureStore;
// export type RootState = ReturnType<typeof rootReducer>;



