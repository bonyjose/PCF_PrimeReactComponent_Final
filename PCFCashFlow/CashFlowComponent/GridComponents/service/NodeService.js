import axios from 'axios';

export class NodeService {

    getTreeTableNodes() {
        return axios.get('./data/treetablenodes.json')
                .then(res => res.data.root);
    }

}