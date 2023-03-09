'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">api-walletshare documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApiLogModule.html" data-type="entity-link" >ApiLogModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiLogModule-ecf4dfd746947b093802c4dac2bd273439c05dad946f2461108973589bea2bdf9f2a9bbdd72e719737a84650ef4c5c18d96ffe2bfd1e9bef72944065cd4ecd9f"' : 'data-target="#xs-injectables-links-module-ApiLogModule-ecf4dfd746947b093802c4dac2bd273439c05dad946f2461108973589bea2bdf9f2a9bbdd72e719737a84650ef4c5c18d96ffe2bfd1e9bef72944065cd4ecd9f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiLogModule-ecf4dfd746947b093802c4dac2bd273439c05dad946f2461108973589bea2bdf9f2a9bbdd72e719737a84650ef4c5c18d96ffe2bfd1e9bef72944065cd4ecd9f"' :
                                        'id="xs-injectables-links-module-ApiLogModule-ecf4dfd746947b093802c4dac2bd273439c05dad946f2461108973589bea2bdf9f2a9bbdd72e719737a84650ef4c5c18d96ffe2bfd1e9bef72944065cd4ecd9f"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' : 'data-target="#xs-controllers-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' :
                                            'id="xs-controllers-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' : 'data-target="#xs-injectables-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' :
                                        'id="xs-injectables-links-module-AppModule-3df08a1f7ab24d56b173e1bfa12adc9cdf027c4a45a69738a4ba2de964cc59f31eaed9097cb66cffad671d68033378bbda1263e18dda364561d9a6699516b9f4"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppTestE2eModule.html" data-type="entity-link" >AppTestE2eModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'data-target="#xs-controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' :
                                            'id="xs-controllers-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' }>
                                            <li class="link">
                                                <a href="controllers/AppTestE2eController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' : 'data-target="#xs-injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' :
                                        'id="xs-injectables-links-module-AppTestE2eModule-f3ed8745c9317d33cf831772803af072fccbc1d9333601328cb619c33b22b3acad5865a2140c7321bdc808a75037d0dde9714a1c9ee5a8cc4701d5338449ffa2"' }>
                                        <li class="link">
                                            <a href="injectables/AppTestE2eService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EntitiesToMoveModule.html" data-type="entity-link" >EntitiesToMoveModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HealthCheckModule.html" data-type="entity-link" >HealthCheckModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' :
                                            'id="xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                            <li class="link">
                                                <a href="controllers/HealthCheckController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthCheckController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' :
                                        'id="xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                        <li class="link">
                                            <a href="injectables/CustomHealthCheckService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomHealthCheckService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' : 'data-target="#xs-controllers-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' :
                                            'id="xs-controllers-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' : 'data-target="#xs-injectables-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' :
                                        'id="xs-injectables-links-module-UserModule-e543e8dc62c4d02b1e9da1e63a9414a4a2066dd8d89be441aa2a4c5eab3be2f0532cf4734340497dea11ddc3657dd3a4cef6a0817d0bd4eaad03fc9d3177dec5"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/CardEntity.html" data-type="entity-link" >CardEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CompanyEmployeeEntity.html" data-type="entity-link" >CompanyEmployeeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CompanyEntity.html" data-type="entity-link" >CompanyEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ConnectedCardEntity.html" data-type="entity-link" >ConnectedCardEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ConversationEntity.html" data-type="entity-link" >ConversationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DiscountCodeEntity.html" data-type="entity-link" >DiscountCodeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GroupEntity.html" data-type="entity-link" >GroupEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GroupMembershipEntity.html" data-type="entity-link" >GroupMembershipEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/InvoicesEntity.html" data-type="entity-link" >InvoicesEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/JoinedConversation.html" data-type="entity-link" >JoinedConversation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MediaEntity.html" data-type="entity-link" >MediaEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MessageEntity.html" data-type="entity-link" >MessageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OccupationEntity.html" data-type="entity-link" >OccupationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PlanEntity.html" data-type="entity-link" >PlanEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProfileEntity.html" data-type="entity-link" >ProfileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SocialNetworkEntity.html" data-type="entity-link" >SocialNetworkEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/StripEventEntity.html" data-type="entity-link" >StripEventEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SubscriptionEntity.html" data-type="entity-link" >SubscriptionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateLogDto.html" data-type="entity-link" >CreateLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserCommand.html" data-type="entity-link" >CreateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserCommandHandler.html" data-type="entity-link" >CreateUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserEvent.html" data-type="entity-link" >CreateUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserEventHandler.html" data-type="entity-link" >CreateUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserResponse.html" data-type="entity-link" >CreateUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateEmailException.html" data-type="entity-link" >DuplicateEmailException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateUsernameException.html" data-type="entity-link" >DuplicateUsernameException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEvent.html" data-type="entity-link" >ErrorCustomEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEventHandler.html" data-type="entity-link" >ErrorCustomEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorExceptionFilter.html" data-type="entity-link" >ErrorExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckQuery.html" data-type="entity-link" >HealthCheckQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckQueryHandler.html" data-type="entity-link" >HealthCheckQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckResponse.html" data-type="entity-link" >HealthCheckResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidParameterEntityException.html" data-type="entity-link" >InvalidParameterEntityException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidPasswordException.html" data-type="entity-link" >InvalidPasswordException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsTestEnvironmentPipe.html" data-type="entity-link" >IsTestEnvironmentPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggingTypeEnum.html" data-type="entity-link" >LoggingTypeEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUserTraceException.html" data-type="entity-link" >NoUserTraceException</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGroupMembershipEnum.html" data-type="entity-link" >RoleGroupMembershipEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampEntityExtendEntity.html" data-type="entity-link" >TimestampEntityExtendEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedRequestException.html" data-type="entity-link" >UnauthorizedRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundException.html" data-type="entity-link" >UserNotFoundException</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DatabaseConfiguration.html" data-type="entity-link" >DatabaseConfiguration</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorLoggingMiddleware.html" data-type="entity-link" >ErrorLoggingMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestLoggingMiddleware.html" data-type="entity-link" >RequestLoggingMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponseLoggingMiddleware.html" data-type="entity-link" >ResponseLoggingMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});