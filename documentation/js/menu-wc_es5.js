'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);
  var _super = _createSuper(_class);
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _super.call(this);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">api-walletshare documentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"changelog.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>CHANGELOG\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"contributing.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>CONTRIBUTING\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"license.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>LICENSE\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"todo.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>TODO\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter modules\">\n                        <a data-type=\"chapter-link\" href=\"modules.html\">\n                            <div class=\"menu-toggler linked\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"', ">\n                                <span class=\"icon ion-ios-archive\"></span>\n                                <span class=\"link-name\">Modules</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                        </a>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"', ">\n                            <li class=\"link\">\n                                <a href=\"modules/AppModule.html\" data-type=\"entity-link\" >AppModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"' : 'data-target="#xs-controllers-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"' : 'id="xs-controllers-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/AppController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"' : 'data-target="#xs-injectables-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"' : 'id="xs-injectables-links-module-AppModule-cd299ea368e1ba18f7f72c1858fd919daebf892bab344d6a2847cdae4e88b576a5484dd817c15b72143ee7a16327f7a8258c8ebc8004aeaf975748a6d82ba74d"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/AppService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/AppTestE2eModule.html\" data-type=\"entity-link\" >AppTestE2eModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'data-target="#xs-controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'id="xs-controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/AppTestE2eController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppTestE2eController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'data-target="#xs-injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'id="xs-injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/AppTestE2eService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppTestE2eService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/EntitiesToMoveModule.html\" data-type=\"entity-link\" >EntitiesToMoveModule</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/HealthCheckModule.html\" data-type=\"entity-link\" >HealthCheckModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'id="xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/HealthCheckController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HealthCheckController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'id="xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/CustomHealthCheckService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >CustomHealthCheckService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                </ul>\n                </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#entities-links"' : 'data-target="#xs-entities-links"', ">\n                                <span class=\"icon ion-ios-apps\"></span>\n                                <span>Entities</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"entities/CardEntity.html\" data-type=\"entity-link\" >CardEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/CompanyEmployeeEntity.html\" data-type=\"entity-link\" >CompanyEmployeeEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/CompanyEntity.html\" data-type=\"entity-link\" >CompanyEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/ConnectedCardEntity.html\" data-type=\"entity-link\" >ConnectedCardEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/ConversationEntity.html\" data-type=\"entity-link\" >ConversationEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/DiscountCodeEntity.html\" data-type=\"entity-link\" >DiscountCodeEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/GroupEntity.html\" data-type=\"entity-link\" >GroupEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/GroupMembershipEntity.html\" data-type=\"entity-link\" >GroupMembershipEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/InvoicesEntity.html\" data-type=\"entity-link\" >InvoicesEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/JoinedConversation.html\" data-type=\"entity-link\" >JoinedConversation</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/MediaEntity.html\" data-type=\"entity-link\" >MediaEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/MessageEntity.html\" data-type=\"entity-link\" >MessageEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/OccupationEntity.html\" data-type=\"entity-link\" >OccupationEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/PlanEntity.html\" data-type=\"entity-link\" >PlanEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/ProfileEntity.html\" data-type=\"entity-link\" >ProfileEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/SocialNetworkEntity.html\" data-type=\"entity-link\" >SocialNetworkEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/StripEventEntity.html\" data-type=\"entity-link\" >StripEventEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/SubscriptionEntity.html\" data-type=\"entity-link\" >SubscriptionEntity</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"entities/UserEntity.html\" data-type=\"entity-link\" >UserEntity</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/DuplicateEmailException.html\" data-type=\"entity-link\" >DuplicateEmailException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/DuplicateUsernameException.html\" data-type=\"entity-link\" >DuplicateUsernameException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ErrorCustomEvent.html\" data-type=\"entity-link\" >ErrorCustomEvent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ErrorCustomEventHandler.html\" data-type=\"entity-link\" >ErrorCustomEventHandler</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ErrorExceptionFilter.html\" data-type=\"entity-link\" >ErrorExceptionFilter</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/HealthCheckQuery.html\" data-type=\"entity-link\" >HealthCheckQuery</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/HealthCheckQueryHandler.html\" data-type=\"entity-link\" >HealthCheckQueryHandler</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/HealthCheckResponse.html\" data-type=\"entity-link\" >HealthCheckResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/InvalidParameterEntityException.html\" data-type=\"entity-link\" >InvalidParameterEntityException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/InvalidPasswordException.html\" data-type=\"entity-link\" >InvalidPasswordException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/IsTestEnvironmentPipe.html\" data-type=\"entity-link\" >IsTestEnvironmentPipe</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/NoUserTraceException.html\" data-type=\"entity-link\" >NoUserTraceException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/RoleGroupMembershipEnum.html\" data-type=\"entity-link\" >RoleGroupMembershipEnum</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/TimestampEntityExtendEntity.html\" data-type=\"entity-link\" >TimestampEntityExtendEntity</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/UnauthorizedRequestException.html\" data-type=\"entity-link\" >UnauthorizedRequestException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/UserNotFoundException.html\" data-type=\"entity-link\" >UserNotFoundException</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/DatabaseConfiguration.html\" data-type=\"entity-link\" >DatabaseConfiguration</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/enumerations.html\" data-type=\"entity-link\">Enums</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);
  return _class;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));