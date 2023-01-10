(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.__anilist__ = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Element = exports.Document = void 0;
var Document = /*#__PURE__*/function () {
  function Document(ref) {
    _classCallCheck(this, Document);
    this.ref = ref;
  }
  _createClass(Document, [{
    key: "free",
    value: function free() {
      __document_free(this.ref);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return new Element(__document_getElementById(this.ref, id));
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(name) {
      return __document_getElementsByClassName(this.ref, name).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "getElementsByTagName",
    value: function getElementsByTagName(name) {
      return __document_getElementsByTagName(this.ref, name).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "querySelector",
    value: function querySelector(selector) {
      return new Element(__document_querySelector(this.ref, selector));
    }
  }, {
    key: "querySelectorAll",
    value: function querySelectorAll(selector) {
      return __document_querySelectorAll(this.ref, selector).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "children",
    get: function get() {
      return __document_children(this.ref).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "body",
    get: function get() {
      return new Element(__document_body(this.ref));
    }
  }, {
    key: "head",
    get: function get() {
      return new Element(__document_head(this.ref));
    }
  }, {
    key: "root",
    get: function get() {
      return new Element(__document_root(this.ref));
    }
  }], [{
    key: "parse",
    value: function parse(html) {
      return new this(__document_parse(html));
    }
  }]);
  return Document;
}();
exports.Document = Document;
var Element = /*#__PURE__*/function () {
  function Element(ref) {
    _classCallCheck(this, Element);
    this.ref = ref;
  }
  _createClass(Element, [{
    key: "attributes",
    get: function get() {
      return __element_attributes(this.ref);
    }
  }, {
    key: "childElementCount",
    get: function get() {
      return __element_childElementCount(this.ref);
    }
  }, {
    key: "children",
    get: function get() {
      return __element_children(this.ref).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "classList",
    get: function get() {
      return __element_classList(this.ref);
    }
  }, {
    key: "className",
    get: function get() {
      return __element_className(this.ref);
    }
  }, {
    key: "firstElementChild",
    get: function get() {
      return new Element(__element_firstElementChild(this.ref));
    }
  }, {
    key: "lastElementChild",
    get: function get() {
      return new Element(__element_lastElementChild(this.ref));
    }
  }, {
    key: "id",
    get: function get() {
      return __element_id(this.ref);
    }
  }, {
    key: "innerHTML",
    get: function get() {
      return __element_innerHTML(this.ref);
    }
  }, {
    key: "outerHTML",
    get: function get() {
      return __element_outerHTML(this.ref);
    }
  }, {
    key: "previousElementSibling",
    get: function get() {
      var ref = __element_previousElementSibling(this.ref);
      return ref === null ? null : new Element(ref);
    }
  }, {
    key: "nextElementSibling",
    get: function get() {
      var ref = __element_nextElementSibling(this.ref);
      return ref === null ? null : new Element(ref);
    }
  }, {
    key: "tagName",
    get: function get() {
      return __element_tagName(this.ref);
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(name) {
      return __element_getAttribute(this.ref, name);
    }
  }, {
    key: "getAttributeNames",
    value: function getAttributeNames() {
      return __element_getAttributeNames(this.ref);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return new Element(__element_getElementById(this.ref, id));
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(name) {
      return __element_getElementsByClassName(this.ref, name).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "getElementsByTagName",
    value: function getElementsByTagName(name) {
      return __element_getElementsByTagName(this.ref, name).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "querySelector",
    value: function querySelector(selector) {
      return new Element(__element_querySelector(this.ref, selector));
    }
  }, {
    key: "querySelectorAll",
    value: function querySelectorAll(selector) {
      return __element_querySelectorAll(this.ref, selector).map(function (ref) {
        return new Element(ref);
      });
    }
  }, {
    key: "hasAttribute",
    value: function hasAttribute(name) {
      return __element_hasAttribute(this.ref, name);
    }
  }, {
    key: "hasAttributes",
    value: function hasAttributes() {
      return __element_hasAttributes(this.ref);
    }
  }, {
    key: "matches",
    value: function matches(selector) {
      return __element_matches(this.ref, selector);
    }
  }, {
    key: "innerText",
    get: function get() {
      return __element_innerText(this.ref);
    }
  }, {
    key: "outerText",
    get: function get() {
      return __element_outerText(this.ref);
    }
  }, {
    key: "style",
    get: function get() {
      return __element_style(this.ref);
    }
  }, {
    key: "title",
    get: function get() {
      return __element_title(this.ref);
    }
  }]);
  return Element;
}();
exports.Element = Element;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEntryResults = exports.createEntryResultsInfo = exports.VideoEpisodeUrlType = exports.createVideoEpisodeUrl = exports.createVideoEpisodeProvider = exports.createVideoEpisodeDetails = exports.createImageChapterPage = exports.createImageChapterDetails = exports.createTextChapterDetails = exports.createVideoEpisode = exports.VideoEpisodeType = exports.createImageChapter = exports.createTextChapter = exports.createEntry = exports.createShortEntry = exports.EntryContentRating = exports.EntryStatus = void 0;
var EntryStatus;
(function (EntryStatus) {
  EntryStatus["unknown"] = "UNKNOWN";
  EntryStatus["ongoing"] = "ONGOING";
  EntryStatus["completed"] = "COMPLETED";
  EntryStatus["dropped"] = "DROPPED";
  EntryStatus["hiatus"] = "HIATUS";
})(EntryStatus = exports.EntryStatus || (exports.EntryStatus = {}));
var EntryContentRating;
(function (EntryContentRating) {
  EntryContentRating["safe"] = "SAFE";
  EntryContentRating["suggestive"] = "SUGGESTIVE";
  EntryContentRating["nsfw"] = "NSFW";
})(EntryContentRating = exports.EntryContentRating || (exports.EntryContentRating = {}));
var createShortEntry = function createShortEntry(entry) {
  return entry;
};
exports.createShortEntry = createShortEntry;
var createEntry = function createEntry(entry) {
  return entry;
};
exports.createEntry = createEntry;
var createTextChapter = function createTextChapter(chapter) {
  return chapter;
};
exports.createTextChapter = createTextChapter;
var createImageChapter = function createImageChapter(chapter) {
  return chapter;
};
exports.createImageChapter = createImageChapter;
var VideoEpisodeType;
(function (VideoEpisodeType) {
  VideoEpisodeType["sub"] = "SUB";
  VideoEpisodeType["dub"] = "DUB";
  VideoEpisodeType["unknown"] = "UNKNOWN";
})(VideoEpisodeType = exports.VideoEpisodeType || (exports.VideoEpisodeType = {}));
var createVideoEpisode = function createVideoEpisode(episode) {
  return episode;
};
exports.createVideoEpisode = createVideoEpisode;
var createTextChapterDetails = function createTextChapterDetails(details) {
  return details;
};
exports.createTextChapterDetails = createTextChapterDetails;
var createImageChapterDetails = function createImageChapterDetails(details) {
  return details;
};
exports.createImageChapterDetails = createImageChapterDetails;
var createImageChapterPage = function createImageChapterPage(page) {
  return page;
};
exports.createImageChapterPage = createImageChapterPage;
var createVideoEpisodeDetails = function createVideoEpisodeDetails(details) {
  return details;
};
exports.createVideoEpisodeDetails = createVideoEpisodeDetails;
var createVideoEpisodeProvider = function createVideoEpisodeProvider(provider) {
  return provider;
};
exports.createVideoEpisodeProvider = createVideoEpisodeProvider;
var createVideoEpisodeUrl = function createVideoEpisodeUrl(url) {
  return url;
};
exports.createVideoEpisodeUrl = createVideoEpisodeUrl;
var VideoEpisodeUrlType;
(function (VideoEpisodeUrlType) {
  VideoEpisodeUrlType["hls"] = "HLS";
  VideoEpisodeUrlType["video"] = "VIDEO";
})(VideoEpisodeUrlType = exports.VideoEpisodeUrlType || (exports.VideoEpisodeUrlType = {}));
var createEntryResultsInfo = function createEntryResultsInfo(info) {
  return info;
};
exports.createEntryResultsInfo = createEntryResultsInfo;
var createEntryResults = function createEntryResults(results) {
  return results;
};
exports.createEntryResults = createEntryResults;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = exports.createFetchOptions = void 0;
var createFetchOptions = function createFetchOptions(options) {
  return options;
};
exports.createFetchOptions = createFetchOptions;
var fetch = function fetch(url, options) {
  return new Promise(function (resolve, reject) {
    __fetch__(url, options !== null && options !== void 0 ? options : {}, resolve, reject);
  });
};
exports.fetch = fetch;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRangeFilter = exports.createNumberFilter = exports.createAscendableSortFilter = exports.createSortFilter = exports.createExcludableMultiSelectFilter = exports.createMultiSelectFilter = exports.createExcludableSelectFilter = exports.createSelectFilter = exports.createSegmentFilter = exports.createToggleFilter = exports.createTextFilter = void 0;
var createTextFilter = function createTextFilter(filter) {
  return Object.assign({
    type: "text"
  }, filter);
};
exports.createTextFilter = createTextFilter;
var createToggleFilter = function createToggleFilter(filter) {
  return Object.assign({
    type: "toggle"
  }, filter);
};
exports.createToggleFilter = createToggleFilter;
var createSegmentFilter = function createSegmentFilter(filter) {
  return Object.assign({
    type: "segment"
  }, filter);
};
exports.createSegmentFilter = createSegmentFilter;
var createSelectFilter = function createSelectFilter(filter) {
  return Object.assign({
    type: "select"
  }, filter);
};
exports.createSelectFilter = createSelectFilter;
var createExcludableSelectFilter = function createExcludableSelectFilter(filter) {
  return Object.assign({
    type: "excludableSelect"
  }, filter);
};
exports.createExcludableSelectFilter = createExcludableSelectFilter;
var createMultiSelectFilter = function createMultiSelectFilter(filter) {
  return Object.assign({
    type: "multiSelect"
  }, filter);
};
exports.createMultiSelectFilter = createMultiSelectFilter;
var createExcludableMultiSelectFilter = function createExcludableMultiSelectFilter(filter) {
  return Object.assign({
    type: "excludableMultiSelect"
  }, filter);
};
exports.createExcludableMultiSelectFilter = createExcludableMultiSelectFilter;
var createSortFilter = function createSortFilter(filter) {
  return Object.assign({
    type: "sort"
  }, filter);
};
exports.createSortFilter = createSortFilter;
var createAscendableSortFilter = function createAscendableSortFilter(filter) {
  return Object.assign({
    type: "ascendableSort"
  }, filter);
};
exports.createAscendableSortFilter = createAscendableSortFilter;
var createNumberFilter = function createNumberFilter(filter) {
  return Object.assign({
    type: "number"
  }, filter);
};
exports.createNumberFilter = createNumberFilter;
var createRangeFilter = function createRangeFilter(filter) {
  return Object.assign({
    type: "range"
  }, filter);
};
exports.createRangeFilter = createRangeFilter;

},{}],5:[function(require,module,exports){
"use strict";

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __exportStar = void 0 && (void 0).__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
__exportStar(require("./entry"), exports);
__exportStar(require("./fetch"), exports);
__exportStar(require("./source"), exports);
__exportStar(require("./listing"), exports);
__exportStar(require("./settings"), exports);
__exportStar(require("./filter"), exports);
__exportStar(require("./document"), exports);
__exportStar(require("./tracker"), exports);

},{"./document":1,"./entry":2,"./fetch":3,"./filter":4,"./listing":6,"./settings":7,"./source":8,"./tracker":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListing = void 0;
var createListing = function createListing(listing) {
  return listing;
};
exports.createListing = createListing;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

},{}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoSource = exports.ImageSource = exports.TextSource = void 0;
var TextSource = /*#__PURE__*/function () {
  function TextSource() {
    _classCallCheck(this, TextSource);
  }
  _createClass(TextSource, [{
    key: "_getListing",
    value: function _getListing(callback, error, previousInfo, listing) {
      this.getListing(previousInfo, listing).then(callback)["catch"](error);
    }
  }, {
    key: "_getSearchResults",
    value: function _getSearchResults(callback, error, previousInfo, query, filters) {
      this.getSearchResults(previousInfo, query, filters).then(callback)["catch"](error);
    }
  }, {
    key: "_getEntry",
    value: function _getEntry(callback, error, id) {
      this.getEntry(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getChapters",
    value: function _getChapters(callback, error, id) {
      this.getChapters(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getChapterDetails",
    value: function _getChapterDetails(callback, error, id, entryId) {
      this.getChapterDetails(id, entryId).then(callback)["catch"](error);
    }
  }, {
    key: "_getFilters",
    value: function _getFilters(callback, error) {
      this.getFilters().then(callback)["catch"](error);
    }
  }, {
    key: "_getListings",
    value: function _getListings(callback, error) {
      this.getListings().then(callback)["catch"](error);
    }
  }, {
    key: "_getSettings",
    value: function _getSettings(callback, error) {
      this.getSettings().then(callback)["catch"](error);
    }
  }]);
  return TextSource;
}();
exports.TextSource = TextSource;
var ImageSource = /*#__PURE__*/function () {
  function ImageSource() {
    _classCallCheck(this, ImageSource);
  }
  _createClass(ImageSource, [{
    key: "_getListing",
    value: function _getListing(callback, error, previousInfo, listing) {
      this.getListing(previousInfo, listing).then(callback)["catch"](error);
    }
  }, {
    key: "_getSearchResults",
    value: function _getSearchResults(callback, error, previousInfo, query, filters) {
      this.getSearchResults(previousInfo, query, filters).then(callback)["catch"](error);
    }
  }, {
    key: "_getEntry",
    value: function _getEntry(callback, error, id) {
      this.getEntry(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getChapters",
    value: function _getChapters(callback, error, id) {
      this.getChapters(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getChapterDetails",
    value: function _getChapterDetails(callback, error, id, entryId) {
      this.getChapterDetails(id, entryId).then(callback)["catch"](error);
    }
  }, {
    key: "_getFilters",
    value: function _getFilters(callback, error) {
      this.getFilters().then(callback)["catch"](error);
    }
  }, {
    key: "_getListings",
    value: function _getListings(callback, error) {
      this.getListings().then(callback)["catch"](error);
    }
  }, {
    key: "_getSettings",
    value: function _getSettings(callback, error) {
      this.getSettings().then(callback)["catch"](error);
    }
  }, {
    key: "_modifyImageRequest",
    value: function _modifyImageRequest(callback, error, url, options) {
      this.modifyImageRequest(url, options).then(callback)["catch"](error);
    }
  }]);
  return ImageSource;
}();
exports.ImageSource = ImageSource;
var VideoSource = /*#__PURE__*/function () {
  function VideoSource() {
    _classCallCheck(this, VideoSource);
  }
  _createClass(VideoSource, [{
    key: "_getListing",
    value: function _getListing(callback, error, previousInfo, listing) {
      this.getListing(previousInfo, listing).then(callback)["catch"](error);
    }
  }, {
    key: "_getSearchResults",
    value: function _getSearchResults(callback, error, previousInfo, query, filters) {
      this.getSearchResults(previousInfo, query, filters).then(callback)["catch"](error);
    }
  }, {
    key: "_getEntry",
    value: function _getEntry(callback, error, id) {
      this.getEntry(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getEpisodes",
    value: function _getEpisodes(callback, error, id) {
      this.getEpisodes(id).then(callback)["catch"](error);
    }
  }, {
    key: "_getEpisodeDetails",
    value: function _getEpisodeDetails(callback, error, id, entryId) {
      this.getEpisodeDetails(id, entryId).then(callback)["catch"](error);
    }
  }, {
    key: "_getFilters",
    value: function _getFilters(callback, error) {
      this.getFilters().then(callback)["catch"](error);
    }
  }, {
    key: "_getListings",
    value: function _getListings(callback, error) {
      this.getListings().then(callback)["catch"](error);
    }
  }, {
    key: "_getSettings",
    value: function _getSettings(callback, error) {
      this.getSettings().then(callback)["catch"](error);
    }
  }, {
    key: "_modifyVideoRequest",
    value: function _modifyVideoRequest(callback, error, url, options) {
      this.modifyVideoRequest(url, options).then(callback)["catch"](error);
    }
  }]);
  return VideoSource;
}();
exports.VideoSource = VideoSource;

},{}],9:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tracker = exports.MediaType = exports.History = void 0;
var History;
(function (History) {
  var Status;
  (function (Status) {
    Status["COMPLETED"] = "COMPLETED";
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["PLANNED"] = "PLANNED";
    Status["DROPPED"] = "DROPPED";
    Status["PAUSED"] = "PAUSED";
    Status["UNKNOWN"] = "UNKNOWN";
  })(Status = History.Status || (History.Status = {}));
})(History = exports.History || (exports.History = {}));
var MediaType;
(function (MediaType) {
  MediaType["TEXT"] = "TEXT";
  MediaType["IMAGE"] = "IMAGE";
  MediaType["VIDEO"] = "VIDEO";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
var Tracker = /*#__PURE__*/function () {
  function Tracker() {
    _classCallCheck(this, Tracker);
  }
  _createClass(Tracker, [{
    key: "_getAuthUrl",
    value: function _getAuthUrl() {
      return this.authUrl;
    }
  }, {
    key: "_handleResponse",
    value: function _handleResponse(callback, error, url) {
      this.handleResponse(url).then(callback)["catch"](error);
    }
  }, {
    key: "_getHistory",
    value: function _getHistory(callback, error, mediaType, id) {
      this.getHistory(mediaType, id).then(callback)["catch"](error);
    }
  }, {
    key: "_setHistory",
    value: function _setHistory(callback, error, mediaType, id, history) {
      this.setHistory(mediaType, id, history).then(callback)["catch"](error);
    }
  }, {
    key: "_deleteHistory",
    value: function _deleteHistory(callback, error, mediaType, id) {
      this.deleteHistory(mediaType, id).then(callback)["catch"](error);
    }
  }, {
    key: "_getSearchResults",
    value: function _getSearchResults(callback, error, previousInfo, mediaType, query) {
      this.getSearchResults(previousInfo, mediaType, query).then(callback)["catch"](error);
    }
  }]);
  return Tracker;
}();
exports.Tracker = Tracker;

},{}],10:[function(require,module,exports){
"use strict";

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
exports.__esModule = true;
var soshiki_sources_1 = require("soshiki-sources");
var AniListTracker = /** @class */function (_super) {
  __extends(AniListTracker, _super);
  function AniListTracker() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AniListTracker.prototype.handleResponse = function (url) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        console.log(url);
        return [2 /*return*/];
      });
    });
  };
  //"npx", ["browserify", ...glob.sync("out/**/*"), "--standalone", `__${manifest.id}__`, "-o", "temp/tracker.js", "-t", "[", "babelify", "--presets", "[", "@babel/preset-env", "]", "--global", "]"
  AniListTracker.prototype.getHistory = function (mediaType, id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        throw new Error("Method not implemented.");
      });
    });
  };
  AniListTracker.prototype.setHistory = function (mediaType, id, history) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        throw new Error("Method not implemented.");
      });
    });
  };
  AniListTracker.prototype.deleteHistory = function (mediaType, id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        throw new Error("Method not implemented.");
      });
    });
  };
  AniListTracker.prototype.getSearchResults = function (previousInfo, mediaType, query) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        throw new Error("Method not implemented.");
      });
    });
  };
  return AniListTracker;
}(soshiki_sources_1.Tracker);
exports["default"] = AniListTracker;

},{"soshiki-sources":5}]},{},[10])(10)
});
