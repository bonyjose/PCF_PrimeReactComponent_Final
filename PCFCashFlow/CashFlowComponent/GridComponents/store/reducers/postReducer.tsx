import {
TEST,
 UPDATED
} from "./../actionType";



const INIT_STATE = {
    campaign: [],
    isUpdated: false
};


export default  (state = INIT_STATE, actions) => {
    switch (actions.type) {
        case TEST: {
            return {
                ...state,
                campaign: actions.campaign
            }
        }
        case UPDATED: {
            return{
                ...state,
                isUpdated: !state.isUpdated
            }
        }
        default:
            return state


    }
}