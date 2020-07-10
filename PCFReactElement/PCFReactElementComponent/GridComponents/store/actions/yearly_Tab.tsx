import {
    TEST,
    UPDATED
    } from "./../actionType";

    
    export const addCampaign = (campaign) => {
        return{
            type: TEST,
            campaign: campaign,
    
        };
    };

    export const changeUpadated = () => {
        return{
            type: UPDATED,
            
        }
    }