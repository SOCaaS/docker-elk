"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestPlugin = void 0;

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TestPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    this.logger = initializerContext.logger.get();
  }

  setup(core) {
    this.logger.debug('test: Setup');
    const router = core.http.createRouter(); // Register server side APIs

    (0, _routes.defineRoutes)(router);
    return {};
  }

  start(core) {
    this.logger.debug('test: Started');
    return {};
  }

  stop() {}

}

exports.TestPlugin = TestPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbi50cyJdLCJuYW1lcyI6WyJUZXN0UGx1Z2luIiwiY29uc3RydWN0b3IiLCJpbml0aWFsaXplckNvbnRleHQiLCJsb2dnZXIiLCJnZXQiLCJzZXR1cCIsImNvcmUiLCJkZWJ1ZyIsInJvdXRlciIsImh0dHAiLCJjcmVhdGVSb3V0ZXIiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7OztBQUVPLE1BQU1BLFVBQU4sQ0FBcUU7QUFHMUVDLEVBQUFBLFdBQVcsQ0FBQ0Msa0JBQUQsRUFBK0M7QUFBQTs7QUFDeEQsU0FBS0MsTUFBTCxHQUFjRCxrQkFBa0IsQ0FBQ0MsTUFBbkIsQ0FBMEJDLEdBQTFCLEVBQWQ7QUFDRDs7QUFFTUMsRUFBQUEsS0FBUCxDQUFhQyxJQUFiLEVBQThCO0FBQzVCLFNBQUtILE1BQUwsQ0FBWUksS0FBWixDQUFrQixhQUFsQjtBQUNBLFVBQU1DLE1BQU0sR0FBR0YsSUFBSSxDQUFDRyxJQUFMLENBQVVDLFlBQVYsRUFBZixDQUY0QixDQUk1Qjs7QUFDQSw4QkFBYUYsTUFBYjtBQUVBLFdBQU8sRUFBUDtBQUNEOztBQUVNRyxFQUFBQSxLQUFQLENBQWFMLElBQWIsRUFBOEI7QUFDNUIsU0FBS0gsTUFBTCxDQUFZSSxLQUFaLENBQWtCLGVBQWxCO0FBQ0EsV0FBTyxFQUFQO0FBQ0Q7O0FBRU1LLEVBQUFBLElBQVAsR0FBYyxDQUFFOztBQXRCMEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBQbHVnaW5Jbml0aWFsaXplckNvbnRleHQsXG4gIENvcmVTZXR1cCxcbiAgQ29yZVN0YXJ0LFxuICBQbHVnaW4sXG4gIExvZ2dlcixcbn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvcmUvc2VydmVyJztcblxuaW1wb3J0IHsgVGVzdFBsdWdpblNldHVwLCBUZXN0UGx1Z2luU3RhcnQgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGRlZmluZVJvdXRlcyB9IGZyb20gJy4vcm91dGVzJztcblxuZXhwb3J0IGNsYXNzIFRlc3RQbHVnaW4gaW1wbGVtZW50cyBQbHVnaW48VGVzdFBsdWdpblNldHVwLCBUZXN0UGx1Z2luU3RhcnQ+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXI6IExvZ2dlcjtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplckNvbnRleHQ6IFBsdWdpbkluaXRpYWxpemVyQ29udGV4dCkge1xuICAgIHRoaXMubG9nZ2VyID0gaW5pdGlhbGl6ZXJDb250ZXh0LmxvZ2dlci5nZXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXR1cChjb3JlOiBDb3JlU2V0dXApIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygndGVzdDogU2V0dXAnKTtcbiAgICBjb25zdCByb3V0ZXIgPSBjb3JlLmh0dHAuY3JlYXRlUm91dGVyKCk7XG5cbiAgICAvLyBSZWdpc3RlciBzZXJ2ZXIgc2lkZSBBUElzXG4gICAgZGVmaW5lUm91dGVzKHJvdXRlcik7XG5cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwdWJsaWMgc3RhcnQoY29yZTogQ29yZVN0YXJ0KSB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoJ3Rlc3Q6IFN0YXJ0ZWQnKTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwdWJsaWMgc3RvcCgpIHt9XG59XG4iXX0=