'use strict';
import Reflux from 'reflux';
import {BUNDLE_URL} from '../constants/QueueConstants';
import SocketService from '../services/SocketService'

export var QueueActions = Reflux.createActions([
  { "searchBundle": { asyncResult: true, displayName: "Search for alternates", icon: "search" } },
  { "setBundlePriority": { asyncResult: true, displayName: "Set priority" } },
  { "setFilePriority": { asyncResult: true, displayName: "Set priority" } },
  { "removeBundle": { asyncResult: true, displayName: "Remove", icon: "remove" } },
  { "removeFile": { asyncResult: true, displayName: "Remove", icon: "remove" } }
]);

QueueActions.setBundlePriority.listen(function(bundleId, newPrio) {
    var that = this;
    return SocketService.put(BUNDLE_URL + "/" + bundleId, {
    	priority: newPrio
    })
      .then(that.completed)
      .catch(this.failed);
});

QueueActions.removeBundle.listen(function(bundleId) {
    var that = this;
    return SocketService.delete(BUNDLE_URL + "/" + bundleId)
      .then(that.completed)
      .catch(this.failed);
});

QueueActions.searchBundle.listen(function(bundleId) {
    var that = this;
    return SocketService.post(BUNDLE_URL + "/" + bundleId + "/search")
      .then(that.completed)
      .catch(this.failed);
});

export default QueueActions;
