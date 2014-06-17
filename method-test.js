if (Meteor.isClient) {
  Template.hello.events({
    'click input': function () {
      _.times(20, function() {
        Meteor.call('test', function() {
          console.log(arguments);
        });
      });
    }
  });
}

if (Meteor.isServer) {
  var waitFor = function(time) {
    var Future = Npm.require('fibers/future');
    var f = new Future();
    Meteor.setTimeout(function() {
      f.return();
    }, time);
    return f.wait();
  };

  Meteor.methods({
    test: function() {
      // this.unblock();

      var id = Random.id();

      console.log('init ' + id);
      waitFor(1000);
      console.log('done ' + id);
      console.log();

      return 'done ' + id;
    }
  });
}
