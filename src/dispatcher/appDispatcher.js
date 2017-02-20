import parameters from '../constants/parameters';
import {Dispatcher} from 'flux';
import assign from 'object-assign';

var Payload = parameters.PAYLOAD;

export default assign(new Dispatcher(), {

  handleServerAction: function(action) {
    // console.log('Server action:', action.actionType);
    var payload = {
      source: Payload.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction: function(action) {
    // console.log('View action:', action.actionType);
    var payload = {
      source: Payload.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  },
});