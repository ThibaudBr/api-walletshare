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
                                <a href="modules/ApiLandingPageModule.html" data-type="entity-link" >ApiLandingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' : 'data-target="#xs-controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' :
                                            'id="xs-controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                            <li class="link">
                                                <a href="controllers/ApiLandingPageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLandingPageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' : 'data-target="#xs-injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' :
                                        'id="xs-injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLandingPageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLandingPageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApiLogModule.html" data-type="entity-link" >ApiLogModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' : 'data-target="#xs-injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' :
                                        'id="xs-injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApiMailModule.html" data-type="entity-link" >ApiMailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' : 'data-target="#xs-controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' :
                                            'id="xs-controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                            <li class="link">
                                                <a href="controllers/ApiMailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiMailController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' : 'data-target="#xs-injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' :
                                        'id="xs-injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiMailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiMailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' : 'data-target="#xs-controllers-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' :
                                            'id="xs-controllers-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' : 'data-target="#xs-injectables-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' :
                                        'id="xs-injectables-links-module-AppModule-ea14aae329bb7e3a24113ed8eade55d1c09c79c0bc8349841e341a7dd22800c9532114249c94cf0e94fcc755d1da1aba11e56dcb1d335596f193fad3c22b705d"' }>
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
                                            'data-target="#controllers-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' : 'data-target="#xs-controllers-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' :
                                            'id="xs-controllers-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' }>
                                            <li class="link">
                                                <a href="controllers/AppTestE2eController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' : 'data-target="#xs-injectables-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' :
                                        'id="xs-injectables-links-module-AppTestE2eModule-4a5a40587ef94b1ef0558f8078f4badfa4e7a807a6798766ccd2c85d0c61320c0a41a22e390a4674ca79010ec13512243b6080fb06a0813c3717d464ec2a7f7d"' }>
                                        <li class="link">
                                            <a href="injectables/AppTestE2eService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' : 'data-target="#xs-controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' :
                                            'id="xs-controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' : 'data-target="#xs-injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' :
                                        'id="xs-injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CardModule.html" data-type="entity-link" >CardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' : 'data-target="#xs-controllers-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' :
                                            'id="xs-controllers-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' }>
                                            <li class="link">
                                                <a href="controllers/CardController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' : 'data-target="#xs-injectables-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' :
                                        'id="xs-injectables-links-module-CardModule-e488bfeebe0407d99e977bd9268d914ddbaa292bf30b8b046df008462a85e23a28c64f145bae9665bba7a5c39a2de1f7cb113875851e4d6e5eee3a33e8f91ab4"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EntitiesToMoveModule.html" data-type="entity-link" >EntitiesToMoveModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GroupModule.html" data-type="entity-link" >GroupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' : 'data-target="#xs-controllers-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' :
                                            'id="xs-controllers-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' }>
                                            <li class="link">
                                                <a href="controllers/GroupController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' : 'data-target="#xs-injectables-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' :
                                        'id="xs-injectables-links-module-GroupModule-33cc970104a0c394ab05e52b57fead678656d5eb27873e6260d98e1447bd7568b97593a6d944df41b33937c5fbad0ce6e6d79a50755329758d07a5bea7a1c7f2"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GroupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                <a href="modules/OccupationModule.html" data-type="entity-link" >OccupationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' : 'data-target="#xs-controllers-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' :
                                            'id="xs-controllers-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' }>
                                            <li class="link">
                                                <a href="controllers/OccupationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OccupationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' : 'data-target="#xs-injectables-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' :
                                        'id="xs-injectables-links-module-OccupationModule-3b9a858311f5e69fa31e8bf78efd3f7d74d90ed93de3720aaa900ee061337a458a16a41d2e693f754da7d461c26f84b93ecbf4daba63a0e74274dc1846048383"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OccupationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OccupationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' : 'data-target="#xs-controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' :
                                            'id="xs-controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' : 'data-target="#xs-injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' :
                                        'id="xs-injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SocialNetworkModule.html" data-type="entity-link" >SocialNetworkModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' : 'data-target="#xs-controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' :
                                            'id="xs-controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                            <li class="link">
                                                <a href="controllers/SocialNetworkController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialNetworkController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' : 'data-target="#xs-injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' :
                                        'id="xs-injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SocialNetworkService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialNetworkService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' : 'data-target="#xs-controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' :
                                            'id="xs-controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' : 'data-target="#xs-injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' :
                                        'id="xs-injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
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
                                    <a href="entities/AddressEntity.html" data-type="entity-link" >AddressEntity</a>
                                </li>
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
                                    <a href="entities/GroupRequestEntity.html" data-type="entity-link" >GroupRequestEntity</a>
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
                                    <a href="entities/NotificationEntity.html" data-type="entity-link" >NotificationEntity</a>
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
                                    <a href="entities/ReferralCodeEntity.html" data-type="entity-link" >ReferralCodeEntity</a>
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
                                <a href="classes/AcceptGroupRequestCommand.html" data-type="entity-link" >AcceptGroupRequestCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AcceptGroupRequestCommandHandler.html" data-type="entity-link" >AcceptGroupRequestCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AcceptGroupRequestEvent.html" data-type="entity-link" >AcceptGroupRequestEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AcceptGroupRequestEventHandler.html" data-type="entity-link" >AcceptGroupRequestEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AcceptGroupRequestRequest.html" data-type="entity-link" >AcceptGroupRequestRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardCommand.html" data-type="entity-link" >AddConnectedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardCommandHandler.html" data-type="entity-link" >AddConnectedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardEvent.html" data-type="entity-link" >AddConnectedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardEventHandler.html" data-type="entity-link" >AddConnectedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardRequest.html" data-type="entity-link" >AddConnectedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardCommand.html" data-type="entity-link" >AddSavedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardCommandHandler.html" data-type="entity-link" >AddSavedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardEvent.html" data-type="entity-link" >AddSavedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardEventHandler.html" data-type="entity-link" >AddSavedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardRequest.html" data-type="entity-link" >AddSavedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardCommand.html" data-type="entity-link" >AddViewCountCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardCommandHandler.html" data-type="entity-link" >AddViewCountCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardEvent.html" data-type="entity-link" >AddViewCountCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardEventHandler.html" data-type="entity-link" >AddViewCountCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelGroupRequestCommand.html" data-type="entity-link" >CancelGroupRequestCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelGroupRequestCommandHandler.html" data-type="entity-link" >CancelGroupRequestCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelGroupRequestEvent.html" data-type="entity-link" >CancelGroupRequestEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelGroupRequestEventHandler.html" data-type="entity-link" >CancelGroupRequestEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardDto.html" data-type="entity-link" >CardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardResponse.html" data-type="entity-link" >CardResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommandErrorHttpException.html" data-type="entity-link" >CommandErrorHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardCommand.html" data-type="entity-link" >CreateCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardCommandHandler.html" data-type="entity-link" >CreateCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardEvent.html" data-type="entity-link" >CreateCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardEventHandler.html" data-type="entity-link" >CreateCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardRequest.html" data-type="entity-link" >CreateCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupCommand.html" data-type="entity-link" >CreateGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupCommandHandler.html" data-type="entity-link" >CreateGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupEvent.html" data-type="entity-link" >CreateGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupEventHandler.html" data-type="entity-link" >CreateGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupRequest.html" data-type="entity-link" >CreateGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogCommand.html" data-type="entity-link" >CreateLogCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogCommandHandler.html" data-type="entity-link" >CreateLogCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogDto.html" data-type="entity-link" >CreateLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMethodLogDto.html" data-type="entity-link" >CreateMethodLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationCommand.html" data-type="entity-link" >CreateOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationCommandHandler.html" data-type="entity-link" >CreateOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationDto.html" data-type="entity-link" >CreateOccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationEvent.html" data-type="entity-link" >CreateOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationEventHandler.html" data-type="entity-link" >CreateOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationRequest.html" data-type="entity-link" >CreateOccupationRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileCommand.html" data-type="entity-link" >CreateProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileCommandHandler.html" data-type="entity-link" >CreateProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileEvent.html" data-type="entity-link" >CreateProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileEventHandler.html" data-type="entity-link" >CreateProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileRequest.html" data-type="entity-link" >CreateProfileRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkCommand.html" data-type="entity-link" >CreateSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkCommandHandler.html" data-type="entity-link" >CreateSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkEvent.html" data-type="entity-link" >CreateSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkEventHandler.html" data-type="entity-link" >CreateSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkRequest.html" data-type="entity-link" >CreateSocialNetworkRequest</a>
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
                                <a href="classes/DeleteCardCommand.html" data-type="entity-link" >DeleteCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardCommandHandler.html" data-type="entity-link" >DeleteCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardEvent.html" data-type="entity-link" >DeleteCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardEventHandler.html" data-type="entity-link" >DeleteCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupCommand.html" data-type="entity-link" >DeleteGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupCommandHandler.html" data-type="entity-link" >DeleteGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupEvent.html" data-type="entity-link" >DeleteGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupEventHandler.html" data-type="entity-link" >DeleteGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupMembershipCommand.html" data-type="entity-link" >DeleteGroupMembershipCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupMembershipCommandHandler.html" data-type="entity-link" >DeleteGroupMembershipCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupMembershipEvent.html" data-type="entity-link" >DeleteGroupMembershipEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupMembershipEventHandler.html" data-type="entity-link" >DeleteGroupMembershipEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupRequestCommand.html" data-type="entity-link" >DeleteGroupRequestCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupRequestCommandHandler.html" data-type="entity-link" >DeleteGroupRequestCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupRequestEvent.html" data-type="entity-link" >DeleteGroupRequestEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteGroupRequestEventHandler.html" data-type="entity-link" >DeleteGroupRequestEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailCommand.html" data-type="entity-link" >DeleteMailCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailCommandHandler.html" data-type="entity-link" >DeleteMailCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailEvent.html" data-type="entity-link" >DeleteMailEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailEventHandler.html" data-type="entity-link" >DeleteMailEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationCommand.html" data-type="entity-link" >DeleteOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationCommandHandler.html" data-type="entity-link" >DeleteOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationEvent.html" data-type="entity-link" >DeleteOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationEventHandler.html" data-type="entity-link" >DeleteOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileCommand.html" data-type="entity-link" >DeleteProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileCommandHandler.html" data-type="entity-link" >DeleteProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileEvent.html" data-type="entity-link" >DeleteProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileEventHandler.html" data-type="entity-link" >DeleteProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkCommand.html" data-type="entity-link" >DeleteSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkCommandHandler.html" data-type="entity-link" >DeleteSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkEvent.html" data-type="entity-link" >DeleteSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkEventHandler.html" data-type="entity-link" >DeleteSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserCommand.html" data-type="entity-link" >DeleteUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserCommandHandler.html" data-type="entity-link" >DeleteUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserEvent.html" data-type="entity-link" >DeleteUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserEventHandler.html" data-type="entity-link" >DeleteUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateMailHttpException.html" data-type="entity-link" >DuplicateMailHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateNameHttpException.html" data-type="entity-link" >DuplicateNameHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateUsernameHttpException.html" data-type="entity-link" >DuplicateUsernameHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityCreationHttpException.html" data-type="entity-link" >EntityCreationHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCardAlreadyConnectedRuntimeException.html" data-type="entity-link" >ErrorCardAlreadyConnectedRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCardAlreadyInGroupRuntimeException.html" data-type="entity-link" >ErrorCardAlreadyInGroupRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCardNotInGroupRuntimeException.html" data-type="entity-link" >ErrorCardNotInGroupRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEvent.html" data-type="entity-link" >ErrorCustomEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEventHandler.html" data-type="entity-link" >ErrorCustomEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorDeleteRuntimeException.html" data-type="entity-link" >ErrorDeleteRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorExceptionFilter.html" data-type="entity-link" >ErrorExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorGetWithCriteriaRuntimeException.html" data-type="entity-link" >ErrorGetWithCriteriaRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorInvalidGroupNameRuntimeException.html" data-type="entity-link" >ErrorInvalidGroupNameRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorInvalidIdRuntimeException.html" data-type="entity-link" >ErrorInvalidIdRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorParameterNotProvidedRuntimeException.html" data-type="entity-link" >ErrorParameterNotProvidedRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorRestoreRuntimeException.html" data-type="entity-link" >ErrorRestoreRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorSaveRuntimeException.html" data-type="entity-link" >ErrorSaveRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorSoftDeleteRuntimeException.html" data-type="entity-link" >ErrorSoftDeleteRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorUpdateRuntimeException.html" data-type="entity-link" >ErrorUpdateRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorUserHaveNoRightOverGroupRuntimeException.html" data-type="entity-link" >ErrorUserHaveNoRightOverGroupRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorUserIsNotOwnerOfCardRuntimeException.html" data-type="entity-link" >ErrorUserIsNotOwnerOfCardRuntimeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateUserDto.html" data-type="entity-link" >GenerateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardQuery.html" data-type="entity-link" >GetAllCardQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardQueryHandler.html" data-type="entity-link" >GetAllCardQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithProfileIdQuery.html" data-type="entity-link" >GetAllCardWithProfileIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithProfileIdQueryHandler.html" data-type="entity-link" >GetAllCardWithProfileIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithUserIdQuery.html" data-type="entity-link" >GetAllCardWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithUserIdQueryHandler.html" data-type="entity-link" >GetAllCardWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllGroupQuery.html" data-type="entity-link" >GetAllGroupQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllGroupQueryHandler.html" data-type="entity-link" >GetAllGroupQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllMailQuery.html" data-type="entity-link" >GetAllMailQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllMailQueryHandler.html" data-type="entity-link" >GetAllMailQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllOccupationQuery.html" data-type="entity-link" >GetAllOccupationQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllOccupationQueryHandler.html" data-type="entity-link" >GetAllOccupationQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllProfileQuery.html" data-type="entity-link" >GetAllProfileQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllProfileQueryHandler.html" data-type="entity-link" >GetAllProfileQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllSocialNetworkQuery.html" data-type="entity-link" >GetAllSocialNetworkQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllSocialNetworkQueryHandler.html" data-type="entity-link" >GetAllSocialNetworkQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardByIdQuery.html" data-type="entity-link" >GetCardByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardByIdQueryHandler.html" data-type="entity-link" >GetCardByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaQuery.html" data-type="entity-link" >GetCardWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaQueryHandler.html" data-type="entity-link" >GetCardWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaRequest.html" data-type="entity-link" >GetCardWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupByIdQuery.html" data-type="entity-link" >GetGroupByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupByIdQueryHandler.html" data-type="entity-link" >GetGroupByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMemberQuery.html" data-type="entity-link" >GetGroupMemberQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMemberQueryHandler.html" data-type="entity-link" >GetGroupMemberQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMembershipWithCardIdQuery.html" data-type="entity-link" >GetGroupMembershipWithCardIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMembershipWithCardIdQueryHandler.html" data-type="entity-link" >GetGroupMembershipWithCardIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMembershipWithCriteriaQuery.html" data-type="entity-link" >GetGroupMembershipWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupMembershipWithCriteriaQueryHandler.html" data-type="entity-link" >GetGroupMembershipWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupRequestWithCardIdAndGroupIdQuery.html" data-type="entity-link" >GetGroupRequestWithCardIdAndGroupIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupRequestWithCardIdAndGroupIdQueryHandler.html" data-type="entity-link" >GetGroupRequestWithCardIdAndGroupIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupRequestWithCriteriaQuery.html" data-type="entity-link" >GetGroupRequestWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupRequestWithCriteriaQueryHandler.html" data-type="entity-link" >GetGroupRequestWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupRequestWithCriteriaRequest.html" data-type="entity-link" >GetGroupRequestWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWhereCardIsAdminQuery.html" data-type="entity-link" >GetGroupWhereCardIsAdminQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWhereCardIsAdminQueryHandler.html" data-type="entity-link" >GetGroupWhereCardIsAdminQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWhereUserIdIsMemberQuery.html" data-type="entity-link" >GetGroupWhereUserIdIsMemberQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWhereUserIdIsMemberQueryHandler.html" data-type="entity-link" >GetGroupWhereUserIdIsMemberQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWithCardIdAndGroupIdRequest.html" data-type="entity-link" >GetGroupWithCardIdAndGroupIdRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWithCriteriaQuery.html" data-type="entity-link" >GetGroupWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWithCriteriaQueryHandler.html" data-type="entity-link" >GetGroupWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupWithCriteriaRequest.html" data-type="entity-link" >GetGroupWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationByIdQuery.html" data-type="entity-link" >GetOccupationByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationByIdQueryHandler.html" data-type="entity-link" >GetOccupationByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaDto.html" data-type="entity-link" >GetOccupationWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaQuery.html" data-type="entity-link" >GetOccupationWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaQueryHandler.html" data-type="entity-link" >GetOccupationWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaRequest.html" data-type="entity-link" >GetOccupationWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileByIdQuery.html" data-type="entity-link" >GetProfileByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileByIdQueryHandler.html" data-type="entity-link" >GetProfileByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesByUserIdQuery.html" data-type="entity-link" >GetProfilesByUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesByUserIdQueryHandler.html" data-type="entity-link" >GetProfilesByUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesWithCriteriaRequest.html" data-type="entity-link" >GetProfilesWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaDto.html" data-type="entity-link" >GetProfileWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaQuery.html" data-type="entity-link" >GetProfileWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaQueryHandler.html" data-type="entity-link" >GetProfileWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithProfileIdQuery.html" data-type="entity-link" >GetSavedCardWithProfileIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithProfileIdQueryHandler.html" data-type="entity-link" >GetSavedCardWithProfileIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithUserIdQuery.html" data-type="entity-link" >GetSavedCardWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithUserIdQueryHandler.html" data-type="entity-link" >GetSavedCardWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkByIdQuery.html" data-type="entity-link" >GetSocialNetworkByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkByIdQueryHandler.html" data-type="entity-link" >GetSocialNetworkByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaQuery.html" data-type="entity-link" >GetSocialNetworkWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaQueryHandler.html" data-type="entity-link" >GetSocialNetworkWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaRequest.html" data-type="entity-link" >GetSocialNetworkWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByEmailQuery.html" data-type="entity-link" >GetUserByEmailQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByEmailQueryHandler.html" data-type="entity-link" >GetUserByEmailQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByUsernameQuery.html" data-type="entity-link" >GetUserByUsernameQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByUsernameQueryHandler.html" data-type="entity-link" >GetUserByUsernameQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesQuery.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesQueryHandler.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginQuery.html" data-type="entity-link" >GetUserLoginQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginQueryHandler.html" data-type="entity-link" >GetUserLoginQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQuery.html" data-type="entity-link" >GetUserQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQueryHandler.html" data-type="entity-link" >GetUserQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaDto.html" data-type="entity-link" >GetUserWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaQuery.html" data-type="entity-link" >GetUserWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaQueryHandler.html" data-type="entity-link" >GetUserWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GiveAdminRightGroupCommand.html" data-type="entity-link" >GiveAdminRightGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/GiveAdminRightGroupCommandHandler.html" data-type="entity-link" >GiveAdminRightGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GiveAdminRightGroupEvent.html" data-type="entity-link" >GiveAdminRightGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/GiveAdminRightGroupEventHandler.html" data-type="entity-link" >GiveAdminRightGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GiveAdminRightGroupRequest.html" data-type="entity-link" >GiveAdminRightGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupMembershipResponse.html" data-type="entity-link" >GroupMembershipResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupRequestResponse.html" data-type="entity-link" >GroupRequestResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupResponse.html" data-type="entity-link" >GroupResponse</a>
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
                                <a href="classes/IdProfileDto.html" data-type="entity-link" >IdProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidIdHttpException.html" data-type="entity-link" >InvalidIdHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidMailHttpException.html" data-type="entity-link" >InvalidMailHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidParameterEntityHttpException.html" data-type="entity-link" >InvalidParameterEntityHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidPasswordHttpException.html" data-type="entity-link" >InvalidPasswordHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidUsernameHttpException.html" data-type="entity-link" >InvalidUsernameHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsCardOwnerWithUserIdQuery.html" data-type="entity-link" >IsCardOwnerWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsCardOwnerWithUserIdQueryHandler.html" data-type="entity-link" >IsCardOwnerWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsProfileOwnerWithUserIsQuery.html" data-type="entity-link" >IsProfileOwnerWithUserIsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsProfileOwnerWithUserIsQueryHandler.html" data-type="entity-link" >IsProfileOwnerWithUserIsQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsTestEnvironmentPipe.html" data-type="entity-link" >IsTestEnvironmentPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsUserIdHaveRoleInGroupQuery.html" data-type="entity-link" >IsUserIdHaveRoleInGroupQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsUserIdHaveRoleInGroupQueryHandler.html" data-type="entity-link" >IsUserIdHaveRoleInGroupQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListRolesDto.html" data-type="entity-link" >ListRolesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggingTypeEnum.html" data-type="entity-link" >LoggingTypeEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginOfUserEvent.html" data-type="entity-link" >LoginOfUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginOfUserEventHandler.html" data-type="entity-link" >LoginOfUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailDto.html" data-type="entity-link" >MailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailLandingPageDto.html" data-type="entity-link" >MailLandingPageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailRequiredHttpException.html" data-type="entity-link" >MailRequiredHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailResponse.html" data-type="entity-link" >MailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotTheOwnerHttpException.html" data-type="entity-link" >NotTheOwnerHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUserTraceHttpException.html" data-type="entity-link" >NoUserTraceHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationDto.html" data-type="entity-link" >OccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationNotFoundHttpException.html" data-type="entity-link" >OccupationNotFoundHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationResponse.html" data-type="entity-link" >OccupationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileResponse.html" data-type="entity-link" >ProfileResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryErrorHttpException.html" data-type="entity-link" >QueryErrorHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterCommand.html" data-type="entity-link" >RegisterCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterEvent.html" data-type="entity-link" >RegisterEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterEventHandler.html" data-type="entity-link" >RegisterEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterHandler.html" data-type="entity-link" >RegisterHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAdminRightGroupCommand.html" data-type="entity-link" >RemoveAdminRightGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAdminRightGroupCommandHandler.html" data-type="entity-link" >RemoveAdminRightGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAdminRightGroupEvent.html" data-type="entity-link" >RemoveAdminRightGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAdminRightGroupEventHandler.html" data-type="entity-link" >RemoveAdminRightGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAdminRightGroupRequest.html" data-type="entity-link" >RemoveAdminRightGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveCardFromGroupCommand.html" data-type="entity-link" >RemoveCardFromGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveCardFromGroupCommandHandler.html" data-type="entity-link" >RemoveCardFromGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveCardFromGroupEvent.html" data-type="entity-link" >RemoveCardFromGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveCardFromGroupEventHandler.html" data-type="entity-link" >RemoveCardFromGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveCardFromGroupRequest.html" data-type="entity-link" >RemoveCardFromGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardCommand.html" data-type="entity-link" >RemoveConnectedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardCommandHandler.html" data-type="entity-link" >RemoveConnectedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardEvent.html" data-type="entity-link" >RemoveConnectedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardEventHandler.html" data-type="entity-link" >RemoveConnectedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardRequest.html" data-type="entity-link" >RemoveConnectedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenCommand.html" data-type="entity-link" >RemoveRefreshTokenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenCommandHandler.html" data-type="entity-link" >RemoveRefreshTokenCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenEvent.html" data-type="entity-link" >RemoveRefreshTokenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenEventHandler.html" data-type="entity-link" >RemoveRefreshTokenEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardCommand.html" data-type="entity-link" >RemoveSavedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardEvent.html" data-type="entity-link" >RemoveSavedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardRequest.html" data-type="entity-link" >RemoveSavedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardCommand.html" data-type="entity-link" >RestoreCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardCommandHandler.html" data-type="entity-link" >RestoreCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardEvent.html" data-type="entity-link" >RestoreCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardEventHandler.html" data-type="entity-link" >RestoreCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreGroupCommand.html" data-type="entity-link" >RestoreGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreGroupCommandHandler.html" data-type="entity-link" >RestoreGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreGroupEvent.html" data-type="entity-link" >RestoreGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreGroupEventHandler.html" data-type="entity-link" >RestoreGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationCommand.html" data-type="entity-link" >RestoreOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationCommandHandler.html" data-type="entity-link" >RestoreOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationEvent.html" data-type="entity-link" >RestoreOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationEventHandler.html" data-type="entity-link" >RestoreOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileCommand.html" data-type="entity-link" >RestoreProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileCommandHandler.html" data-type="entity-link" >RestoreProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileEvent.html" data-type="entity-link" >RestoreProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileEventHandler.html" data-type="entity-link" >RestoreProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkCommand.html" data-type="entity-link" >RestoreSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkCommandHandler.html" data-type="entity-link" >RestoreSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkEvent.html" data-type="entity-link" >RestoreSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkEventHandler.html" data-type="entity-link" >RestoreSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserCommand.html" data-type="entity-link" >RestoreUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserCommandHandler.html" data-type="entity-link" >RestoreUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserEvent.html" data-type="entity-link" >RestoreUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserEventHandler.html" data-type="entity-link" >RestoreUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGroupMembershipEnum.html" data-type="entity-link" >RoleGroupMembershipEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/SamePasswordHttpException.html" data-type="entity-link" >SamePasswordHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGroupRequestCommand.html" data-type="entity-link" >SendGroupRequestCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGroupRequestCommandHandler.html" data-type="entity-link" >SendGroupRequestCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGroupRequestEvent.html" data-type="entity-link" >SendGroupRequestEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGroupRequestEventHandler.html" data-type="entity-link" >SendGroupRequestEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGroupRequestRequest.html" data-type="entity-link" >SendGroupRequestRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailCommand.html" data-type="entity-link" >SendMailCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailCommandHandler.html" data-type="entity-link" >SendMailCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailEvent.html" data-type="entity-link" >SendMailEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailEventHandler.html" data-type="entity-link" >SendMailEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenCommand.html" data-type="entity-link" >SetCurrentRefreshTokenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenCommandHandler.html" data-type="entity-link" >SetCurrentRefreshTokenCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenEvent.html" data-type="entity-link" >SetCurrentRefreshTokenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenEventHandler.html" data-type="entity-link" >SetCurrentRefreshTokenEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerCommand.html" data-type="entity-link" >ShiftProfileOwnerCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerCommandHandler.html" data-type="entity-link" >ShiftProfileOwnerCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerEvent.html" data-type="entity-link" >ShiftProfileOwnerEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerEventHandler.html" data-type="entity-link" >ShiftProfileOwnerEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerRequest.html" data-type="entity-link" >ShiftProfileOwnerRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialNetworkDto.html" data-type="entity-link" >SocialNetworkDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialNetworkResponse.html" data-type="entity-link" >SocialNetworkResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardCommand.html" data-type="entity-link" >SoftDeleteCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardCommandHandler.html" data-type="entity-link" >SoftDeleteCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardEvent.html" data-type="entity-link" >SoftDeleteCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardEventHandler.html" data-type="entity-link" >SoftDeleteCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteGroupCommand.html" data-type="entity-link" >SoftDeleteGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteGroupCommandHandler.html" data-type="entity-link" >SoftDeleteGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteGroupEvent.html" data-type="entity-link" >SoftDeleteGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteGroupEventHandler.html" data-type="entity-link" >SoftDeleteGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationCommand.html" data-type="entity-link" >SoftDeleteOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationCommandHandler.html" data-type="entity-link" >SoftDeleteOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationEvent.html" data-type="entity-link" >SoftDeleteOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationEventHandler.html" data-type="entity-link" >SoftDeleteOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileCommand.html" data-type="entity-link" >SoftDeleteProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileCommandHandler.html" data-type="entity-link" >SoftDeleteProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileEvent.html" data-type="entity-link" >SoftDeleteProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileEventHandler.html" data-type="entity-link" >SoftDeleteProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkCommand.html" data-type="entity-link" >SoftDeleteSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkCommandHandler.html" data-type="entity-link" >SoftDeleteSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkEvent.html" data-type="entity-link" >SoftDeleteSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkEventHandler.html" data-type="entity-link" >SoftDeleteSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserCommand.html" data-type="entity-link" >SoftDeleteUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserCommandHandler.html" data-type="entity-link" >SoftDeleteUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserEvent.html" data-type="entity-link" >SoftDeleteUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserEventHandler.html" data-type="entity-link" >SoftDeleteUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampEntityExtendEntity.html" data-type="entity-link" >TimestampEntityExtendEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferProfileToUserCommand.html" data-type="entity-link" >TransferProfileToUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedRequestHttpException.html" data-type="entity-link" >UnauthorizedRequestHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardCommand.html" data-type="entity-link" >UpdateCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardCommandHandler.html" data-type="entity-link" >UpdateCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardEvent.html" data-type="entity-link" >UpdateCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardEventHandler.html" data-type="entity-link" >UpdateCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardRequest.html" data-type="entity-link" >UpdateCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupCommand.html" data-type="entity-link" >UpdateGroupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupCommandHandler.html" data-type="entity-link" >UpdateGroupCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupEvent.html" data-type="entity-link" >UpdateGroupEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupEventHandler.html" data-type="entity-link" >UpdateGroupEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupRequest.html" data-type="entity-link" >UpdateGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationCommand.html" data-type="entity-link" >UpdateOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationCommandHandler.html" data-type="entity-link" >UpdateOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationDto.html" data-type="entity-link" >UpdateOccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationEvent.html" data-type="entity-link" >UpdateOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationEventHandler.html" data-type="entity-link" >UpdateOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationRequest.html" data-type="entity-link" >UpdateOccupationRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileCommand.html" data-type="entity-link" >UpdateOccupationsProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileCommandHandler.html" data-type="entity-link" >UpdateOccupationsProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileDto.html" data-type="entity-link" >UpdateOccupationsProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileEvent.html" data-type="entity-link" >UpdateOccupationsProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileEventHandler.html" data-type="entity-link" >UpdateOccupationsProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileCommand.html" data-type="entity-link" >UpdateProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileCommandHandler.html" data-type="entity-link" >UpdateProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileEvent.html" data-type="entity-link" >UpdateProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileEventHandler.html" data-type="entity-link" >UpdateProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileRequest.html" data-type="entity-link" >UpdateProfileRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkCommand.html" data-type="entity-link" >UpdateSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkCommandHandler.html" data-type="entity-link" >UpdateSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkEvent.html" data-type="entity-link" >UpdateSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkEventHandler.html" data-type="entity-link" >UpdateSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkRequest.html" data-type="entity-link" >UpdateSocialNetworkRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommand.html" data-type="entity-link" >UpdateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommandHandler.html" data-type="entity-link" >UpdateUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialCommand.html" data-type="entity-link" >UpdateUserCredentialCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialCommandHandler.html" data-type="entity-link" >UpdateUserCredentialCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialDto.html" data-type="entity-link" >UpdateUserCredentialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialEvent.html" data-type="entity-link" >UpdateUserCredentialEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialEventHandler.html" data-type="entity-link" >UpdateUserCredentialEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEvent.html" data-type="entity-link" >UpdateUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEventHandler.html" data-type="entity-link" >UpdateUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleCommand.html" data-type="entity-link" >UpdateUserRoleCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleCommandHandler.html" data-type="entity-link" >UpdateUserRoleCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleEvent.html" data-type="entity-link" >UpdateUserRoleEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleEventHandler.html" data-type="entity-link" >UpdateUserRoleEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserIsNotOwnerOfCardHttpException.html" data-type="entity-link" >UserIsNotOwnerOfCardHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserListResponse.html" data-type="entity-link" >UserListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginDto.html" data-type="entity-link" >UserLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginResponse.html" data-type="entity-link" >UserLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundHttpException.html" data-type="entity-link" >UserNotFoundHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponse.html" data-type="entity-link" >UserResponse</a>
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
                                    <a href="injectables/JwtAuthenticationGuard.html" data-type="entity-link" >JwtAuthenticationGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshGuard.html" data-type="entity-link" >JwtRefreshGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthenticationGuard.html" data-type="entity-link" >LocalAuthenticationGuard</a>
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
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RequestUser.html" data-type="entity-link" >RequestUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenPayload.html" data-type="entity-link" >TokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserIdDto.html" data-type="entity-link" >UserIdDto</a>
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