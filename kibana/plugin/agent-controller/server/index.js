"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "TestPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.TestPluginSetup;
  }
});
Object.defineProperty(exports, "TestPluginStart", {
  enumerable: true,
  get: function () {
    return _types.TestPluginStart;
  }
});

var _plugin = require("./plugin");

var _types = require("./types");

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
  return new _plugin.TestPlugin(initializerContext);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbInBsdWdpbiIsImluaXRpYWxpemVyQ29udGV4dCIsIlRlc3RQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFTQTs7QUFQQTtBQUNBO0FBRU8sU0FBU0EsTUFBVCxDQUFnQkMsa0JBQWhCLEVBQThEO0FBQ25FLFNBQU8sSUFBSUMsa0JBQUosQ0FBZUQsa0JBQWYsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGx1Z2luSW5pdGlhbGl6ZXJDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvcmUvc2VydmVyJztcbmltcG9ydCB7IFRlc3RQbHVnaW4gfSBmcm9tICcuL3BsdWdpbic7XG5cbi8vICBUaGlzIGV4cG9ydHMgc3RhdGljIGNvZGUgYW5kIFR5cGVTY3JpcHQgdHlwZXMsXG4vLyAgYXMgd2VsbCBhcywgS2liYW5hIFBsYXRmb3JtIGBwbHVnaW4oKWAgaW5pdGlhbGl6ZXIuXG5cbmV4cG9ydCBmdW5jdGlvbiBwbHVnaW4oaW5pdGlhbGl6ZXJDb250ZXh0OiBQbHVnaW5Jbml0aWFsaXplckNvbnRleHQpIHtcbiAgcmV0dXJuIG5ldyBUZXN0UGx1Z2luKGluaXRpYWxpemVyQ29udGV4dCk7XG59XG5cbmV4cG9ydCB7IFRlc3RQbHVnaW5TZXR1cCwgVGVzdFBsdWdpblN0YXJ0IH0gZnJvbSAnLi90eXBlcyc7XG4iXX0=