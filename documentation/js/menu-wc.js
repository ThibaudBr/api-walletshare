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
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' : 'data-target="#xs-controllers-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' :
                                            'id="xs-controllers-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' : 'data-target="#xs-injectables-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' :
                                        'id="xs-injectables-links-module-AppModule-c389a8aed94a0f3eeae6ecd30d07024d89e2ebcbd0b3aa6507aa761f37de2de06cb0f18e4035446e72a35c2c394bb04571b19fa5e8542f711b2d213b8cc1f9ad"' }>
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
                                <a href="classes/InvalidParameterEntityException.html" data-type="entity-link" >InvalidParameterEntityException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidPasswordException.html" data-type="entity-link" >InvalidPasswordException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsTestEnvironmentPipe.html" data-type="entity-link" >IsTestEnvironmentPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUserTraceException.html" data-type="entity-link" >NoUserTraceException</a>
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