if (Meteor.isClient) {
  Session.setDefault('called', 0);
  Session.setDefault('received', 0);
  Session.setDefault('returned', 0);
  
  Template.hello.helpers({
    called: function() {
      return Session.get('called');
    },
    
    received: function() {
      return Session.get('received');
    },
    
    returned: function() {
      return Session.get('returned')
    }
  });
  
  Template.hello.events({
    'click input': function () {
      _.times(20, function() {
        Session.set('called', Session.get('called') + 1);
        Meteor.apply('test', [], {
          onResultReceived: function() {
            Session.set('received', Session.get('received') + 1)
          }
        }, function() {
          Session.set('returned', Session.get('returned') + 1);
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
