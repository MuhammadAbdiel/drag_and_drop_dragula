var dragAndDrop = {
  store: [],

  init: function () {
    self = this;
    this.dragula();
    this.eventListeners();

    if (localStorage.getItem("store"))
      this.store = JSON.parse(localStorage.getItem("store"));

    // querySelectorAll returns a nodelist and should be converted to array to use filter, map and foreach
    var nodesArray = Array.prototype.slice.call(
      document.querySelectorAll("#left div")
    );

    var nodesArray = nodesArray
      .filter(function (e) {
        return (
          self.store
            .map(function (d) {
              return d["element"];
            })
            .indexOf(e.id) === -1
        );
      })
      .forEach(function (e) {
        self.store.push({ element: e.id, container: "left" });
      });

    this.store.forEach(function (obj) {
      document
        .getElementById(obj.container)
        .appendChild(document.getElementById(obj.element));
    });
  },

  eventListeners: function () {
    this.dragula.on("drop", this.dropped.bind(this));
  },

  dragula: function () {
    this.dragula = dragula(
      [document.getElementById("left"), document.getElementById("right")],
      {
        copy: false,
      }
    );
  },

  dropped: function (el, target, source, sibling) {
    // Remove element from store if it exists
    var indexEl = this.store
      .map(function (d) {
        return d["element"];
      })
      .indexOf(el.id);
    if (indexEl > -1) this.store.splice(indexEl, 1);

    var indexDrop = this.store.length;
    if (sibling) {
      // If sibling store before sibling
      indexDrop = this.store
        .map(function (d) {
          return d["element"];
        })
        .indexOf(sibling.id);
    }

    this.store.splice(indexDrop, 0, { element: el.id, container: target.id });

    localStorage.setItem("store", JSON.stringify(this.store));
  },
};

dragAndDrop.init();
